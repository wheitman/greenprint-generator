import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";
import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Colors } from "../Colors";
import { Tree } from "./Tree";
import { QuercusRubra } from "./canopy/QuercusRubra";
import { QuercusMontana } from "./canopy/QuercusMontana";
import { CaryaOvata } from "./canopy/CaryaOvata";
import { AcerRubrum } from "./canopy/AcerRubrum";
import { LiriodendronTulipifera } from "./emergent/LiriodendronTulipifera";
import { Terrain } from "./Terrain";
import { AmelanchierArborea } from "./understory/AmelanchierArborea";
import { NyssaSylvatica } from "./understory/NyssaSylvatica";
import GUI from "lil-gui";

let meshes: THREE.Mesh[] = [];

enum ForestLayer {
    UNDERSTORY = 1,
    CANOPY = 2,
    EMERGENT = 3,
}

declare global {
    var tree_count: number;
    var percent_of_target: number;
}

class TreePosition {
    constructor(
        public x: number,
        public z: number,
        public crown_spacing: number,
        public trunk_spacing: number,
        public layer: ForestLayer
    ) {}
}

export class Forest implements Experience {
    forest_size: number = 350; // meters
    resources: Resource[] = [];
    tree_positions: TreePosition[] = [];

    gui = new GUI();

    target_tree_count = 300;
    hill_height = 60;
    hill_spacing = 200;
    terrain = new Terrain(
        this.forest_size + 20,
        0.4,
        this.hill_spacing,
        this.hill_height
    );

    constructor(private engine: Engine) {}

    init() {
        this.addLighting();

        // Generate the forest
        this.addTrees(this.target_tree_count);

        // Add the terrain
        this.engine.scene.add(this.terrain.mesh);

        // Axes helpher ;)
        const axesHelper = new THREE.AxesHelper(3);
        // this.engine.scene.add(axesHelper);
        axesHelper.scale.set(10, 10, 10);

        // GUI setup
        this.gui.add(this, "target_tree_count", 50, 3000, 50).onFinishChange(() => {
            this.clearForest();
            this.addTrees(this.target_tree_count);
            this.updateInfoUI();
        });

        this.gui.add(this, "forest_size", 100, 500, 100).onFinishChange(() => {
            this.engine.scene.remove(this.terrain.mesh);
            this.terrain = new Terrain(this.forest_size + 20, 0.4, 200, 60);
            this.engine.scene.add(this.terrain.mesh);
            this.clearForest();
            this.addTrees(this.target_tree_count);
            this.updateInfoUI();
        });

        this.gui.add(this, "hill_height", 0, 200, 10).onFinishChange(() => {
            this.engine.scene.remove(this.terrain.mesh);
            this.terrain = new Terrain(
                this.forest_size + 20,
                0.4,
                200,
                this.hill_height
            );
            this.engine.scene.add(this.terrain.mesh);
            this.clearForest();
            this.addTrees(this.target_tree_count);
            this.updateInfoUI();
        });

        this.updateInfoUI();
    }

    addLighting() {
        let scene = this.engine.scene;

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 300, 0);
        scene.add(hemiLight);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
        // scene.add(hemiLightHelper);

        //

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-50, 75, 40);
        dirLight.position.multiplyScalar(30);
        scene.add(dirLight);

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 1000;

        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;

        dirLight.shadow.camera.far = 6000;
        dirLight.shadow.bias = -0.0001;

        const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
        // scene.add(dirLightHelper);
    }

    updateInfoUI(): void {
        const collection = document.getElementsByClassName("info-container");

        let info_ui: Element = collection[0];

        info_ui.innerHTML = `${meshes.length} trees. About ${10*meshes.length} kg CO2/year (conservatively). \n
        Use Shift (or two fingers) to rotate.`;
    }

    treeHasSpace(tree_pos: TreePosition): boolean {
        let has_space = true;
        this.tree_positions.forEach((other_pos: TreePosition) => {
            let min_distance = -1;
            let distance = Math.sqrt(
                (other_pos.x - tree_pos.x) ** 2 +
                    (other_pos.z - tree_pos.z) ** 2
            );

            // If our tree is above the other tree...
            if (tree_pos.layer > other_pos.layer)
                min_distance = tree_pos.trunk_spacing + other_pos.crown_spacing;
            else if (tree_pos.layer == other_pos.layer)
                min_distance = tree_pos.crown_spacing + other_pos.crown_spacing;
            else if (tree_pos.layer < other_pos.layer)
                min_distance = tree_pos.crown_spacing + other_pos.trunk_spacing;
            else console.error("Unhandled case in treeHasSpace.");

            if (min_distance > distance) {
                has_space = false;
            }
        });

        return has_space;
    }

    clearForest(): void {
        meshes.forEach((mesh: THREE.Mesh) => {
            this.engine.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh = undefined;
        });
        this.tree_positions = [];
        meshes = [];
    }

    async addTrees(tree_count: number = 100) {
        let failed_spawns = 0;

        let emergent_proportion = 0.1; // 10% of all trees
        let desired_emergent_count = Math.ceil(
            tree_count * emergent_proportion
        );
        let current_emergent_count = 0;

        let canopy_proportion = 0.2;
        let desired_canopy_count = Math.ceil(tree_count * canopy_proportion);
        let current_canopy_count = 0;

        let understory_proportion = 1 - emergent_proportion - canopy_proportion; // 10% of all trees
        let desired_understory_count = Math.ceil(
            tree_count * understory_proportion
        );
        let current_understory_count = 0;

        // Start with emergent trees -- the tallest ones
        while (current_emergent_count < desired_emergent_count) {
            let pos_x = Math.random() * this.forest_size - this.forest_size / 2;
            let pos_z = Math.random() * this.forest_size - this.forest_size / 2;
            let elev = this.terrain.getElevation(pos_x, pos_z);

            let tree = new LiriodendronTulipifera();
            let tree_pos = new TreePosition(
                pos_x,
                pos_z,
                50,
                5,
                ForestLayer.EMERGENT
            );

            if (this.treeHasSpace(tree_pos)) {
                this.tree_positions.push(tree_pos);
                let mesh = tree.buildMesh();
                this.engine.scene.add(mesh);
                meshes.push(mesh);
                tree.setPosition(pos_x, pos_z, elev);
                current_emergent_count++;
            } else {
                failed_spawns++;
            }

            if (failed_spawns > tree_count * 100) {
                // console.error(
                //     "Max spawn attempts exceeded. Is your target tree count too high for the provided space?"
                // );
                break;
            }
        }

        // Continue with canopy layer
        failed_spawns = 0;

        while (current_canopy_count < desired_canopy_count) {
            let pos_x = Math.random() * this.forest_size - this.forest_size / 2;
            let pos_z = Math.random() * this.forest_size - this.forest_size / 2;
            let elev = this.terrain.getElevation(pos_x, pos_z);

            let pick = Math.random();
            let tree;
            if (pick < 0.25) tree = new QuercusRubra();
            else if (pick < 0.5) tree = new QuercusMontana();
            else if (pick < 0.75) tree = new CaryaOvata();
            else tree = new AcerRubrum();

            let tree_pos = new TreePosition(
                pos_x,
                pos_z,
                10,
                3,
                ForestLayer.CANOPY
            );

            if (this.treeHasSpace(tree_pos)) {
                this.tree_positions.push(tree_pos);
                let mesh = tree.buildMesh();
                this.engine.scene.add(mesh);
                meshes.push(mesh);
                tree.setPosition(pos_x, pos_z, elev);
                current_canopy_count++;
            } else {
                failed_spawns++;
            }

            if (failed_spawns > tree_count * 100) {
                break;
            }
        }

        failed_spawns = 0;

        // End with understory layer
        while (current_understory_count < desired_understory_count) {
            let pos_x = Math.random() * this.forest_size - this.forest_size / 2;
            let pos_z = Math.random() * this.forest_size - this.forest_size / 2;
            let elev = this.terrain.getElevation(pos_x, pos_z);

            let pick = Math.random();
            let tree;
            if (pick < 0.5) tree = new AmelanchierArborea();
            else tree = new NyssaSylvatica();

            let tree_pos = new TreePosition(
                pos_x,
                pos_z,
                1,
                0.5,
                ForestLayer.UNDERSTORY
            );

            if (this.treeHasSpace(tree_pos)) {
                this.tree_positions.push(tree_pos);
                let mesh = tree.buildMesh();
                this.engine.scene.add(mesh);
                meshes.push(mesh);
                tree.setPosition(pos_x, pos_z, elev);
                current_understory_count++;
            } else {
                failed_spawns++;
            }

            if (failed_spawns > tree_count * 100) {
                break;
            }
        }

        globalThis.tree_count = meshes.length;
        globalThis.percent_of_target = meshes.length / this.target_tree_count;
    }

    resize(): void {}

    update(delta: number): void {}
}
