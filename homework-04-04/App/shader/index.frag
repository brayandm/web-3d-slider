varying float vRandom;
varying vec3 vColor;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main(){
  vec3 color = vColor;
  float alpha = 1.0;

  vec3 finalColor = mix(uColor1, uColor2, vRandom);
  
  gl_FragColor = vec4(finalColor, alpha);
}