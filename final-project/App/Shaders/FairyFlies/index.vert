uniform float uTime;
uniform float uVelocity;
uniform float uPointSize;
varying vec3 vColor;

void main() {
    // Get the position of the vertex
    vec3 newPosition = position;

    // Move the vertex in a circular motion
    newPosition.x += sin(uTime * uVelocity / 2.0 + position.y * 10.0) * 10.0;
    newPosition.y += sin(uTime * uVelocity / 2.0 + position.x * 10.0) * 10.0;
    newPosition.z += sin(uTime * uVelocity / 2.0 + position.z * 10.0) * 10.0;
    
    // Set the color of the vertex
    vColor = color;

    // Set the size of the point
    gl_PointSize = uPointSize;

    // Set the position of the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}