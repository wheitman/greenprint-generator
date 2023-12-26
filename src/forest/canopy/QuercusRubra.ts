import { Colors } from "../../Colors";
import * as THREE from "three";
import { Tree } from "../Tree";

export class QuercusRubra extends Tree {
    constructor(radius: number = 15, height: number = 25) {
        super(radius, height);
    }

    public buildMesh(): THREE.Mesh {
        let canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                this.radius_,
                this.height_ - this.radius_
            ),
            new THREE.MeshToonMaterial({ color: Colors.RED800 })
        );

        const TRUNK_RADIUS = 4;

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                TRUNK_RADIUS,
                TRUNK_RADIUS,
                this.height_
            ),
            new THREE.MeshToonMaterial({ color: Colors.BROWN })
        );
        this.mesh.add(canopy);
        canopy.position.set(0, this.height_ / 2, 0);
        canopy.castShadow = true;

        this.mesh.castShadow = true;
        return this.mesh;
    }
}
