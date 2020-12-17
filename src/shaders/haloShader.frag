#define M_PI 3.1415926535897932384626433832795
varying vec2 vUv;
uniform float time;

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
  if (time < 1.) {
    float hue = mod(time + vUv.x, 1.);
    vec3 color = hsb2rgb(vec3(hue,time * vUv.y,.9));
    gl_FragColor = vec4(color, 1.);
  } else if (time < 2.) {
    float hue = mod(time + vUv.x, 1.);
    vec3 color = hsb2rgb(vec3(hue,vUv.y,1.0));
    gl_FragColor = vec4(color, 1.);
  } else if (time < 2.5) {
    float newTime = (time - 2.) * 2.;
    float hue = mod(time + vUv.x, 1.);
    vec3 color = hsb2rgb(vec3(hue,vUv.y - newTime * vUv.y,1.));
    gl_FragColor = vec4(color, 1.);
  } else if (time < 4.) {
    float newTime = (time - 2.5) * 4. + M_PI / 2.;
    vec3 color = hsb2rgb(vec3(0.,0.,sin(newTime) / 2. + 0.5));
    gl_FragColor = vec4(color, 1.);
  } else {
    float position = mod(time + vUv.x, 1.);
    float newTime = (time - 4.) * 4. + M_PI / 2.;
    if (mod(ceil(position * 10.), 2.) < 1. && newTime > 3. * M_PI / 2. && newTime <= 7. * M_PI / 2.) {
      gl_FragColor = vec4(0.,0.,0., 1.);
    } else if (mod(ceil(position * 10.), 2.) < 1. && newTime <= 3. * M_PI / 2.) {
      gl_FragColor = vec4(hsb2rgb(vec3(0.,0.,sin(newTime) / 2. + 0.5)), 1.);
    } else if (mod(ceil(position * 10.), 2.) < 1. && newTime > 7. * M_PI / 2.) {
      gl_FragColor = vec4(hsb2rgb(vec3(0.,0.,sin(newTime) / 2. + 0.5)), 1.);
    } else {
      gl_FragColor = vec4(hsb2rgb(vec3(0.,0.,.9)), 1.);
    }
  }
}