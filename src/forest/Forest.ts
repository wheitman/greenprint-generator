import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";
import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Colors } from "../Colors";
import { Tree } from "./Tree";
import { QuercusRubra } from "./QuercusRubra";
import { QuercusMontana } from "./QuercusMontana";
import { CaryaOvata } from "./CaryaOvata";
import { AcerRubrum } from "./AcerRubrum";
import { LiriodendronTulipifera } from "./LiriodendronTulipifera";
import { Terrain } from "./Terrain";

const footprint_width: number = 500; // meters
const footprint_height: number = 500; // meters

export class Forest implements Experience 
{
    resources: Resource[] = [];

    constructor(private engine: Engine) {}

    init () {
        let trees = [];

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(footprint_width, footprint_height),
            new THREE.MeshStandardMaterial({ color: Colors.STONE100 })
        );

        plane.receiveShadow = true;
        // this.engine.scene.add(plane);
        plane.position.set(0, 0, 0)
        plane.setRotationFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 2)

        // Lighting
        const dirLight1 = new THREE.DirectionalLight( 0xffffff, 2 );
        dirLight1.position.set( 1, 1, 1 );
        this.engine.scene.add( dirLight1 );

        // const dirLight2 = new THREE.DirectionalLight( 0x002288, 1 );
        // dirLight2.position.set( - 1, - 1, - 1 );
        // this.engine.scene.add( dirLight2 );

        const dirLight3 = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight3.position.set( -10, 10, -10 );
        this.engine.scene.add( dirLight3 );

        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.engine.scene.add( ambientLight );

        // Generate the forest
        // this.generateTrees();

        // Add the terrain
        let terrain = new Terrain();
        this.engine.scene.add(terrain.mesh);

        // Axes helpher ;)
        const axesHelper = new THREE.AxesHelper( 3 );
        this.engine.scene.add( axesHelper );
    }

    generateTrees() {
        let treeCount = 100;
        for (let i = 0; i < treeCount; i++)
        {
            let pos = [, Math.random() * footprint_height];
            // console.log(pos);
            
            let radius = 1; // meters
            let height = 2; // meters

            let pick = Math.random();
            
            let tree = new QuercusRubra();
            if (pick < 0.2)
                tree = new QuercusRubra();
            else if (pick < 0.5)
                tree = new QuercusMontana();
            else if (pick < 0.6)
                tree = new CaryaOvata();
            else if (pick < 0.8)
                tree = new AcerRubrum();
            else
                tree = new LiriodendronTulipifera();

            tree.buildMesh(this.engine.scene);

            tree.setPosition(Math.random() * footprint_width, Math.random() * footprint_height, footprint_width/2, footprint_height/2);
        }
    }

    resize(): void {
        
    }

    update(delta: number): void {
        
    }
}