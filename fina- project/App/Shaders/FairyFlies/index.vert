uniform float uTime;
uniform float uVelocity;
uniform float uPointSize;
varying vec3 vColor;

void main() {
    vec3 newPosition = position;
    newPosition.x += sin(uTime * uVelocity / 2.0 + position.y * 10.0) * 10.0;
    newPosition.y += sin(uTime * uVelocity / 2.0 + position.x * 10.0) * 10.0;
    newPosition.z += sin(uTime * uVelocity / 2.0 + position.z * 10.0) * 10.0;
    
    vColor = color;

    gl_PointSize = uPointSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}