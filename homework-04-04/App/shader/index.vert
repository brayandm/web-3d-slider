attribute float aRandom;

varying float vRandom;

uniform float uVelocity;
uniform float uTime;
uniform int uMovementType;

void main() {
  vec3 newPosition = position;

  if (uMovementType == 1) {
    newPosition.x += aRandom * cos(uTime * uVelocity) * 4.0;
  } else if (uMovementType == 2) {
    newPosition.x += aRandom * tan(uTime * uVelocity);
  } else if (uMovementType == 3) {
    newPosition.x += aRandom * tan(uTime * uVelocity) / cos(uTime * uVelocity);
  } else if (uMovementType == 4) {
    newPosition.x += aRandom * tan(uTime * uVelocity) / cos(uTime * uVelocity);
    newPosition.y += aRandom * tan(uTime * uVelocity) / sin(uTime * uVelocity);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vRandom = aRandom;
}