# Description

## Basic Features (required to pass):

-   ~~[ ] IF you use model(s), load a glTF (_.gltf or _.glb model).~~

-   [ ] IF you use model(s), optimize the model and describe in a README what steps you took to optimize it, or why you didn't have to. (Remember that visual quality is also important, not just making it as small as possible). I'll check model filesize, textures filesize / resolution and polygons. If you need to save kbs you might think about using draco (you can compress models on https://gltf.report/, and use draco loader https://threejs.org/docs/#examples/en/loaders/DRACOLoader). Not necessary but maybe useful? Just be aware draco compress ONLY the geometry, not textures.

-   [ ] Light the scene using an HDRI or other lights. But explain you choice and why one over other. Be aware of the filesize.

-   [ ] Add at least one interaction (can be drag, scroll, click, raycaster, arrows) with an item in the scene which triggers something. Camera? Color? Light intensity? Better if animated using gsap (or an engine of your choice).

-   [ ] If you create a 3D env, add one light that casts a shadow in the scene. Meshes should be marked with `castShadow` and `receiveShadow` for this to work. If you don't think you'll need it, explain why you decided to skip.

-   [ ] Correct handling of colorspace, tone mapping, dpr, antialiasing, resize etc.

-   [ ] At least one Shader Material with some logic. Using a shader material without any custom things is useless. Shader Material can be on meshes or as post-processing pass/effect, or both. Up to you.

-   [ ] A README file explaining your project, what decisions you made and any information that will help me understand your thinking. For instance, "I tried adding post-processing but my computer was too slow to handle it, instead I focused on adding more elaborate animations to X and Y" etc.

-   [ ] Another README that explains how to install (if repo) and make run your project. A `.nvmrc` file is obligatory, so we can run the same node. Please please please remember `.nvmrc`

## Advanced features (optional for higher points):

-   [ ] Add one or more post processing effects, but if you do it has to be coherent to the scene, don't add random things without logic. Keep an eye on the performances.

-   [ ] Add some camera movement if not orbit-controls. You might want to drop orbit controls and add a mouse binded/scroll camera on the final version. This is more for the 3d env, if you plan to do a slider might be not necessary. You can add a more subtle animation maybe? Some mouse parallax?

-   [ ] Play with render-target. We haven't covered this topic but here some hints if you want to give it a go. https://blog.maximeheckel.com/posts/beautiful-and-mind-bending-effects-with-webgl-render-targets/.

-   [ ] Performance. You should optimise download size for the entire experience and make compromises to improve the render performance. 3D experiences can be larger than your normal website, but we should still be mindful of the total size and make sure we can hit 60fps on an iPhone or similar.
