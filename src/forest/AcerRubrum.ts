import { Colors } from "../Colors";
import * as THREE from "three";
import { Tree } from "./Tree";

/**
 * Acer rubrum (red maple)
 */

export class AcerRubrum extends Tree {
    // private height_: number;
    // private radius_: number;
    // private x_: number;
    // private y_: number;
    constructor(radius: number = 25, height: number = 35) 
    {
        super(radius, height);
        
        // this.mesh = 

        // make cylinder stand up
        // this.mesh.setRotationFromAxisAngle(
        //     new THREE.Vector3(1,0,0), Math.PI/2
        // )
    }

    public buildMesh(scene: THREE.Scene): void
    {
        let canopy = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius_, this.height_ - this.radius_),
            new THREE.MeshToonMaterial({ color: Colors.ROSE800 })
        );

        const TRUNK_RADIUS = 4;

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(TRUNK_RADIUS, TRUNK_RADIUS, this.height_),
            new THREE.MeshToonMaterial({ color: Colors.BROWN })
        );
        this.mesh.add(canopy)
        canopy.position.set(0, this.height_/2, 0)

        // this.mesh.add()

        scene.add(this.mesh);
    }
}