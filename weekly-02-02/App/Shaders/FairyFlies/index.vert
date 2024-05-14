uniform float uTime;
uniform float uVelocity;
varying vec3 vColor;

void main() {
    vec3 newPosition = position;
    newPosition.x += sin(uTime * uVelocity + position.y * 10.0) * 3.0;
    newPosition.y += sin(uTime * uVelocity + position.x * 10.0) * 3.0;
    newPosition.z += sin(uTime * uVelocity + position.z * 10.0) * 3.0;
    
    vColor = color;

    gl_PointSize = 8.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}