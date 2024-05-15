varying vec3 vColor;

void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) {
        discard;
    }

    float brightness = sin(vColor.r * 10.0) * 0.5 + 0.5 + 2.0;
    gl_FragColor = vec4(vColor * brightness, 1.0);
}