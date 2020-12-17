varying vec2 vUv;
uniform float M_PI;
uniform float time;
uniform float index;
uniform float number;

void main() {
  vec3 color1 = vec3(0., 0., 0.);
  vec3 color2 = vec3(1., 1., 1.);

  float startPi = 1.;
  float stepPiFull = 4.;
  float stop1 = 3.;
  float stop2 = startPi + 2. * stepPiFull;
  float stop3 = stop2 + 1.;
  float stop4 = stop3 + 3. * stepPiFull;

  if (time < stop1 * M_PI / 2.) {
    float progress = sin(time + index * (2. * M_PI / number));
    float mixValue = smoothstep(progress, 1., vUv.y);
    gl_FragColor = vec4(mix(color1, vec3(sin(-time), sin(-time), sin(-time)), mixValue), 1.0);
  } else if (time < stop2 * M_PI / 2.) {
    float progress = sin(time + index * (2. * M_PI / number));
    float mixValue = smoothstep(progress, 1., vUv.y);
    gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
  } else if (time < stop3 * M_PI / 2.) {
    float progress = sin(time + index * (2. * M_PI / number));
    float mixValue = smoothstep(progress, 1., vUv.y);
    gl_FragColor = vec4(mix(color1, vec3(sin(time), sin(time), sin(time)), mixValue), 1.0);
  } else if (time < stop4 * M_PI / 2.) {
    float mixValue = smoothstep(sin(time - M_PI / 2.), 1., vUv.y);
    gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
  } else {
    float id = ceil((time - (stop4 * M_PI / 2. + M_PI / 2.)) * 3.) ;
    if (index <= id) {
      gl_FragColor = vec4(mix(color1, color2, sin(M_PI / 2. - time) / 2. + 0.5), 1.0);
    } else {
      gl_FragColor = vec4(mix(color1, color2, 0.), 1.0);
    }
  }
}