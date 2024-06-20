void main() {
    // Set the position of the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}