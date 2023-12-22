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
    terrain = new Terrain(forest_size + 20, 0.4, 120, 40);
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
        let scene = this.engine.scene;

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 300, 0 );
        scene.add( hemiLight );

        const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
        scene.add( hemiLightHelper );

        //

        const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 50, 75, 40 );
        dirLight.position.multiplyScalar( 30 );
        scene.add( dirLight );

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 1000;

        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;

        dirLight.shadow.camera.far = 6000;
        dirLight.shadow.bias = - 0.0001;

        const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
        scene.add( dirLightHelper );

        // Generate the forest
        this.generateTrees(100);

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
