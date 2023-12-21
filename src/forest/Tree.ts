import { Colors } from "../Colors";
import * as THREE from "three";

export class Tree {
    public mesh: THREE.Mesh;
    protected height_: number;
    protected radius_: number;
    protected x_: number;
    protected y_: number;
    constructor(radius: number = 1, height: number = 1) 
    {
        this.height_ = height;
        this.radius_ = radius;
        this.x_ = 0;
        this.y_ = 0;
        


        // make cylinder stand up
        // this.mesh.setRotationFromAxisAngle(
        //     new THREE.Vector3(1,0,0), Math.PI/2
        // )

        // scene.add(this.mesh);

    }

    public buildMesh(scene: THREE.Scene): void
    {
        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius_, this.radius_, this.height_),
            new THREE.MeshStandardMaterial({ color: Colors.GREEN600 })
        );
        scene.add(this.mesh);
    }

    public setPosition(x: number, y: number, origin_x: number = 50, origin_y: number = 50): void 
    {
        this.mesh.position.set(x - origin_x, this.height_/2, y - origin_y);
    }
}