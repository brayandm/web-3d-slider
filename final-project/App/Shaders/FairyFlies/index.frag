varying vec3 vColor;

void main() {
    // Distance to the center of the point
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));

    // Discard fragments outside the circle
    if (distanceToCenter > 0.5) {
        discard;
    }

    // Set the brightness of the fragment
    float brightness = sin(vColor.r * 10.0) * 0.5 + 2.5;

    // Set the color of the fragment
    gl_FragColor = vec4(vColor * brightness, 1.0);
}