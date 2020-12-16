#define M_PI 3.1415926535897932384626433832795
varying vec2 vUv;
uniform float time;

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
  float hue = mod(time + vUv.x, 1.);

  vec3 color = hsb2rgb(vec3(hue,vUv.y,1.0));

  gl_FragColor = vec4(color, 1.);
}