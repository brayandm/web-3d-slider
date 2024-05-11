varying float vRandom;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main(){
  float alpha = 1.0;

  vec3 color = mix(uColor1, uColor2, vRandom);
  
  gl_FragColor = vec4(color, 1);
}