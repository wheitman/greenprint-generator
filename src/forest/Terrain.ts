import { Colors } from "../Colors";
import * as THREE from "three";
import { Noise } from "../Perlin";

// Adapted from: https://threejs.org/examples/#webgl_buffergeometry_indexed

export class Terrain {
    mesh: THREE.Mesh;
    gradients = {};
    noise_generator = new Noise();

    constructor(
        size: number = 100,
        cellSize = 0.4,
        private hill_multiplier: number = 10
    ) {
        const geometry = new THREE.BufferGeometry();

        const indices = [];

        const vertices = [];
        const normals = [];
        const colors = [];
        this.gradients = {};

        const segments = Math.ceil(size / cellSize);

        const halfSize = size / 2;
        const segmentSize = size / segments;

        const _color = new THREE.Color();

        // generate vertices, normals and color data for a simple grid geometry
        for (let i = 0; i <= segments; i++) {
            const z = i * segmentSize - halfSize;

            for (let j = 0; j <= segments; j++) {
                const x = j * segmentSize - halfSize;
                let elevation = this.getElevation(x, z);

                vertices.push(x, elevation, z);
                normals.push(0, 0, 1);

                _color.setHex(Colors.GREEN200);
                _color.multiplyScalar(elevation / 5);

                colors.push(_color.r, _color.g, _color.b);
            }
        }

        // generate indices (data for element array buffer)

        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + (j + 1);
                const b = i * (segments + 1) + j;
                const c = (i + 1) * (segments + 1) + j;
                const d = (i + 1) * (segments + 1) + (j + 1);

                // generate two faces (triangles) per iteration
                indices.push(a, b, d); // face one
                indices.push(b, c, d); // face two
            }
        }

        geometry.setIndex(indices);
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute(
            "normal",
            new THREE.Float32BufferAttribute(normals, 3)
        );
        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
        );

        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            vertexColors: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    public getElevation(x: number, y: number): number {
        let freq = 1 / this.hill_multiplier;
        let height = this.noise_generator.perlin2(x * freq, y * freq) * 20 + 15;
        return height;
    }
}
