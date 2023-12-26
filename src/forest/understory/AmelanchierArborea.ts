import { Colors } from "../../Colors";
import * as THREE from "three";
import { Tree } from "../Tree";

/**
 * Amelanchier arborea (common serviceberry)
 */

export class AmelanchierArborea extends Tree {
    // private height_: number;
    // private radius_: number;
    // private x_: number;
    // private y_: number;
    constructor(radius: number = 5, height: number = 10) 
    {
        super(radius, height);
    }

    public buildMesh(): THREE.Mesh
    {
        let canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius_, this.height_ - this.radius_),
            new THREE.MeshToonMaterial({ color: Colors.EMERALD500 })
        );

        const TRUNK_RADIUS = 0.5;

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(TRUNK_RADIUS, TRUNK_RADIUS, this.height_),
            new THREE.MeshToonMaterial({ color: Colors.BROWN })
        );
        this.mesh.add(canopy)
        canopy.position.set(0, this.height_/2, 0)
        
        canopy.castShadow = true;
        this.mesh.castShadow = true;
        // this.mesh.add()

        return this.mesh
    }
}