import { Colors } from "../../Colors";
import * as THREE from "three";
import { Tree } from "../Tree";

/**
 * Liriodendron tulipifera
 */

export class LiriodendronTulipifera extends Tree {

    constructor(radius: number = 30, height: number = 50) 
    {
        super(radius, height);
    }

    public buildMesh(): THREE.Mesh
    {
        let upper_canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius_, 0),
            new THREE.MeshToonMaterial({ color: Colors.YELLOW600 })
        );

        let middle_canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius_, 0),
            new THREE.MeshToonMaterial({ color: Colors.YELLOW600 })
        );

        let lower_canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius_, 0),
            new THREE.MeshToonMaterial({ color: Colors.YELLOW600 })
        );

        const TRUNK_RADIUS = 4;

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(TRUNK_RADIUS, TRUNK_RADIUS, this.height_),
            new THREE.MeshToonMaterial({ color: Colors.BROWN })
        );
        this.mesh.castShadow = true;
        this.mesh.add(upper_canopy)
        upper_canopy.position.set(0, this.height_ * .9, 0)
        upper_canopy.castShadow = true;

        this.mesh.add(middle_canopy)
        middle_canopy.position.set(0, this.height_ * .7, 0)
        middle_canopy.castShadow = true;

        this.mesh.add(lower_canopy)
        lower_canopy.position.set(0, this.height_ * .5, 0)
        lower_canopy.castShadow = true;

        this.mesh.castShadow = true;
        return this.mesh;
    }
}