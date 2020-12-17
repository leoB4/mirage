#define M_PI 3.1415926535897932384626433832795
varying vec2 vUv;
uniform float time;
uniform float index;
uniform float number;

void main() {
  vec3 color1 = vec3(0., 0., 0.);
  vec3 color2 = vec3(1., 1., 1.);

  float mixValue = smoothstep(sin(time + index * (2. * M_PI / number)) / 2. + 0.5, 1., vUv.y);

  gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
}