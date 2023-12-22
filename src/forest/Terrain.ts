import { Colors } from "../Colors";
import * as THREE from "three";
import { Noise } from "../Perlin";

export class Terrain {
    mesh: THREE.Mesh;
    gradients = {};
    constructor(size: number = 100, cellSize = 0.4) {
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
            const y = i * segmentSize - halfSize;

            for (let j = 0; j <= segments; j++) {
                // let height = Math.random() * 10;
                
                
                const x = j * segmentSize - halfSize;
                let noise = new Noise();
                let freq = 0.04;
                let height = noise.perlin2(x * freq,y * freq) * 10 + 10;

                vertices.push(x, height, -y);
                normals.push(0, 0, 1);

                const r = x / size + 1.0;
                const g = y / size + 1.0;

                // _color.setRGB(0.5, 1, 0.7, THREE.SRGBColorSpace);
                _color.setHex(Colors.GREEN200);
                _color.multiplyScalar(height / 5)

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

        //

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

    public buildMesh(scene: THREE.Scene): void {
        // this.mesh = new THREE.Mesh(
        //     new THREE.CylinderGeometry(
        //         this.radius_,
        //         this.radius_,
        //         this.height_
        //     ),
        //     new THREE.MeshStandardMaterial({ color: Colors.GREEN600 })
        // );
        // scene.add(this.mesh);
    }

    public setPosition(
        x: number,
        y: number,
        origin_x: number = 50,
        origin_y: number = 50
    ): void {
        this.mesh.position.set(x - origin_x, this.height_ / 2, y - origin_y);
    }

    private getRandomUnitVector() {
        let theta = Math.random() * 2 * Math.PI;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }

    private getDotProductGrid(x: number, y: number, vx: number, vy: number)
    {
        let gVect;
        let dVect = {x: x-vx, y: y-vy};
        if (this.gradients[[vx, vy]])
        {
            gVect = this.gradients[[vx, vy]];
        } else {
            gVect = this.getRandomUnitVector();
            this.gradients[[vx, vy]] = gVect;
        }
        return dVect.x * gVect.x + dVect.y * gVect.y;
    }

    private getHeight(x: number, y: number)
    {
        let xf = Math.floor(x);
        let yf = Math.floor(y);

        let noise = new Noise();
        let height = noise.perlin2(x,y);
        console.log(height)
    }

    // Thanks, Joe Iddon!
    // https://joeiddon.github.io/projects/javascript/perlin.html
    private getHeightmap(size: number) {
        let grid = [];

        // Populate the grid
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                let height = parseInt(getHeight(i, j));
                row.push(height);
            }
            grid.push(row);
        }
    }
}
