uniform float time;
uniform vec2 resolution;
uniform float velocity;
uniform float spread;
uniform vec3 uBackgroundColor;

// Function to generate noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // Get the position of the fragment
    vec2 st = gl_FragCoord.xy / resolution.xy;

    // Get the brightness of the fragment
    float brightness = random(st + time * 0.00000005 * velocity);
    brightness = step(0.9991, brightness * spread);

    // Set the color of the fragment
    vec3 starColor = vec3(brightness);
    vec3 backgroundColor = uBackgroundColor;
    gl_FragColor = vec4(mix(backgroundColor, starColor, brightness), 1.0);
}