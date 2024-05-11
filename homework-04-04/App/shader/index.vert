attribute float aRandom;

varying float vRandom;

uniform float uVelocity;
uniform float uTime;
uniform int uMovementType;

void main() {
  vec3 newPosition = position;

  if (uMovementType == 1) {
    newPosition.x += aRandom * cos(uTime * uVelocity);
  } else if (uMovementType == 2) {
    newPosition.z += aRandom * tan(uTime * uVelocity);
  } else if (uMovementType == 3) {
    newPosition.y += aRandom * tan(uTime * uVelocity) / cos(uTime * uVelocity);
  } else {
    newPosition.x += aRandom * cos(uTime * uVelocity) / tan(uTime * uVelocity);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vRandom = aRandom;
}