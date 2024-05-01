async function AmmoPhysics() {
    if ("Ammo" in window === false) {
        console.error("AmmoPhysics: Couldn't find Ammo.js");
        return;
    }

    const Ammo = await AmmoLib(); // eslint-disable-line no-undef

    const frameRate = 60;

    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const broadphase = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    const world = new Ammo.btDiscreteDynamicsWorld(
        dispatcher,
        broadphase,
        solver,
        collisionConfiguration
    );
    world.setGravity(new Ammo.btVector3(0, -9.8, 0));

    const worldTransform = new Ammo.btTransform();

    //

    function getShape(geometry) {
        const vertices = geometry.attributes.position.array;
        const shape = new Ammo.btConvexHullShape();

        for (let i = 0; i < vertices.length; i += 3) {
            const vx = vertices[i];
            const vy = vertices[i + 1];
            const vz = vertices[i + 2];
            const btVec = new Ammo.btVector3(vx, vy, vz);
            shape.addPoint(btVec, true);
        }

        return shape;
    }

    const meshes = [];
    const meshMap = new WeakMap();

    function addScene(scene) {
        scene.traverse(function (child) {
            if (child.isMesh) {
                const physics = child.userData.physics;

                if (physics) {
                    addMesh(child, physics.mass);
                }
            }
        });
    }

    function addMesh(mesh, mass = 0) {
        const shape = getShape(mesh.geometry);

        if (shape !== null) {
            if (mesh.isInstancedMesh) {
                handleInstancedMesh(mesh, mass, shape);
            } else if (mesh.isMesh) {
                handleMesh(mesh, mass, shape);
            }
        }
    }

    function handleMesh(mesh, mass, shape) {
        const position = mesh.position;
        const quaternion = mesh.quaternion;

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(
            new Ammo.btVector3(position.x, position.y, position.z)
        );
        transform.setRotation(
            new Ammo.btQuaternion(
                quaternion.x,
                quaternion.y,
                quaternion.z,
                quaternion.w
            )
        );

        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            shape,
            localInertia
        );

        const body = new Ammo.btRigidBody(rbInfo);
        // body.setFriction( 4 );
        world.addRigidBody(body);

        if (mass > 0) {
            meshes.push(mesh);
            meshMap.set(mesh, body);
        }
    }

    function handleInstancedMesh(mesh, mass, shape) {
        const array = mesh.instanceMatrix.array;

        const bodies = [];

        for (let i = 0; i < mesh.count; i++) {
            const index = i * 16;

            const transform = new Ammo.btTransform();
            transform.setFromOpenGLMatrix(array.slice(index, index + 16));

            const motionState = new Ammo.btDefaultMotionState(transform);

            const localInertia = new Ammo.btVector3(0, 0, 0);
            shape.calculateLocalInertia(mass, localInertia);

            const rbInfo = new Ammo.btRigidBodyConstructionInfo(
                mass,
                motionState,
                shape,
                localInertia
            );

            const body = new Ammo.btRigidBody(rbInfo);
            world.addRigidBody(body);

            bodies.push(body);
        }

        if (mass > 0) {
            meshes.push(mesh);

            meshMap.set(mesh, bodies);
        }
    }

    //

    function setMeshPosition(mesh, position, index = 0) {
        if (mesh.isInstancedMesh) {
            const bodies = meshMap.get(mesh);
            const body = bodies[index];

            body.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
            body.setLinearVelocity(new Ammo.btVector3(0, 0, 0));

            worldTransform.setIdentity();
            worldTransform.setOrigin(
                new Ammo.btVector3(position.x, position.y, position.z)
            );
            body.setWorldTransform(worldTransform);
        } else if (mesh.isMesh) {
            const body = meshMap.get(mesh);

            body.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
            body.setLinearVelocity(new Ammo.btVector3(0, 0, 0));

            worldTransform.setIdentity();
            worldTransform.setOrigin(
                new Ammo.btVector3(position.x, position.y, position.z)
            );
            body.setWorldTransform(worldTransform);
        }
    }

    //

    let lastTime = 0;

    function step() {
        const time = performance.now();

        if (lastTime > 0) {
            const delta = (time - lastTime) / 1000;

            world.stepSimulation(delta, 10);

            //

            for (let i = 0, l = meshes.length; i < l; i++) {
                const mesh = meshes[i];

                if (mesh.isInstancedMesh) {
                    const array = mesh.instanceMatrix.array;
                    const bodies = meshMap.get(mesh);

                    for (let j = 0; j < bodies.length; j++) {
                        const body = bodies[j];

                        const motionState = body.getMotionState();
                        motionState.getWorldTransform(worldTransform);

                        const position = worldTransform.getOrigin();
                        const quaternion = worldTransform.getRotation();

                        compose(position, quaternion, array, j * 16);
                    }

                    mesh.instanceMatrix.needsUpdate = true;
                    mesh.computeBoundingSphere();
                } else if (mesh.isMesh) {
                    const body = meshMap.get(mesh);

                    const motionState = body.getMotionState();
                    motionState.getWorldTransform(worldTransform);

                    const position = worldTransform.getOrigin();
                    const quaternion = worldTransform.getRotation();
                    mesh.position.set(position.x(), position.y(), position.z());
                    mesh.quaternion.set(
                        quaternion.x(),
                        quaternion.y(),
                        quaternion.z(),
                        quaternion.w()
                    );
                }
            }
        }

        lastTime = time;
    }

    // animate

    setInterval(step, 1000 / frameRate);

    return {
        addScene: addScene,
        addMesh: addMesh,
        setMeshPosition: setMeshPosition,
        // addCompoundMesh
    };
}

function compose(position, quaternion, array, index) {
    const x = quaternion.x(),
        y = quaternion.y(),
        z = quaternion.z(),
        w = quaternion.w();
    const x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    const xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    const yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    const wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    array[index + 0] = 1 - (yy + zz);
    array[index + 1] = xy + wz;
    array[index + 2] = xz - wy;
    array[index + 3] = 0;

    array[index + 4] = xy - wz;
    array[index + 5] = 1 - (xx + zz);
    array[index + 6] = yz + wx;
    array[index + 7] = 0;

    array[index + 8] = xz + wy;
    array[index + 9] = yz - wx;
    array[index + 10] = 1 - (xx + yy);
    array[index + 11] = 0;

    array[index + 12] = position.x();
    array[index + 13] = position.y();
    array[index + 14] = position.z();
    array[index + 15] = 1;
}

export { AmmoPhysics };
