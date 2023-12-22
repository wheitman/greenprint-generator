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

const forest_size: number = 350; // meters

export class Forest implements Experience {
    terrain = new Terrain(forest_size + 20, 0.4, 80);
    resources: Resource[] = [];

    constructor(private engine: Engine) {}

    init() {
        let trees = [];

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(forest_size, forest_size),
            new THREE.MeshStandardMaterial({ color: Colors.STONE100 })
        );

        plane.receiveShadow = true;
        // this.engine.scene.add(plane);
        plane.position.set(0, 0, 0);
        plane.setRotationFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            -Math.PI / 2
        );

        // Lighting
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
        dirLight1.position.set(1, 1, 1);
        this.engine.scene.add(dirLight1);

        // const dirLight2 = new THREE.DirectionalLight( 0x002288, 1 );
        // dirLight2.position.set( - 1, - 1, - 1 );
        // this.engine.scene.add( dirLight2 );

        const dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
        dirLight3.position.set(-10, 10, -10);
        this.engine.scene.add(dirLight3);

        const ambientLight = new THREE.AmbientLight(0x555555);
        this.engine.scene.add(ambientLight);

        // Generate the forest
        this.generateTrees(10);

        // Add the terrain
        this.engine.scene.add(this.terrain.mesh);

        // Axes helpher ;)
        const axesHelper = new THREE.AxesHelper(3);
        this.engine.scene.add(axesHelper);
        axesHelper.scale.set(10, 10, 10);
    }

    generateTrees(treeCount: number = 100) {
        for (let i = 0; i < treeCount; i++) {
            let pick = Math.random();

            let tree;
            if (pick < 0.2) tree = new QuercusRubra();
            else if (pick < 0.5) tree = new QuercusMontana();
            else if (pick < 0.6) tree = new CaryaOvata();
            else if (pick < 0.8) tree = new AcerRubrum();
            else tree = new LiriodendronTulipifera();

            tree.buildMesh(this.engine.scene);

            let pos_x = Math.random() * forest_size - forest_size / 2;
            let pos_y = Math.random() * forest_size - forest_size / 2;
            let elev = this.terrain.getElevation(pos_x, pos_y);
            console.log(elev);

            tree.setPosition(
                pos_x,
                pos_y,
                elev
            );
        }
    }

    resize(): void {}

    update(delta: number): void {}
}
