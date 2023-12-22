import { Colors } from "../Colors";
import * as THREE from "three";
import { Tree } from "./Tree";

/**
 * Liriodendron tulipifera
 */

export class LiriodendronTulipifera extends Tree {

    constructor(radius: number = 30, height: number = 50) 
    {
        super(radius, height);
    }

    public buildMesh(scene: THREE.Scene): void
    {
        let canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius_, this.height_ - this.radius_),
            new THREE.MeshToonMaterial({ color: Colors.YELLOW600 })
        );

        const TRUNK_RADIUS = 4;

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(TRUNK_RADIUS, TRUNK_RADIUS, this.height_),
            new THREE.MeshToonMaterial({ color: Colors.BROWN })
        );
        this.mesh.castShadow = true;
        this.mesh.add(canopy)
        canopy.position.set(0, this.height_/2, 0)
        canopy.castShadow = true;

        this.mesh.castShadow = true;
        scene.add(this.mesh);
    }
}