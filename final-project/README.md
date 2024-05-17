# Project Overview

The project is a about a Slider that shows some pictures, we can interact with the slider by dragging the mouse over the screen, hovering slides, parallax effect, toggling dev mode and playing with parameters. There is some illumination and post processing effects. Also there are shader materials for background and fairies. By default the slides are animated with a simple animation simulating a floating effect, the same for fairies, and the background uses a noise effect. Also
the slider simulate a circular movement. For the post processing effects there is a blur effect but we need to enable it
in dev mode due to performance issues, and by default we have Chromatic Aberration effect that is more visible when we
drag the mouse.

# Features

## Spot Light

-   Iluminate the center of the slider, the color can be changed in dev mode.

## Interaction

-   Drag the mouse over the screen to move the slider
-   Hover the slides to make them closer to the camera
-   Parallax effect when moving the mouse
-   Dev mode to play with parameters

## Miscellaneous

-   Correct handling of colorspace
-   Correct handling of tone mapping
-   Correct handling of dpr
-   Correct handling of antialiasing
-   Correct handling of resize

## Shader Materials

-   Background: Noise effect to simulate a starry night
-   Fairies: Animation simulating a floating effect for several fairies

## Post Processing Effects

-   Chromatic Aberration effect: a little bit by default, more visible when dragging the mouse
-   Blur effect: need to enable it in dev mode due to performance issues, is visible when dragging the mouse
