/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 * Converted to Typescript by Will Heitman.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

class Grad {
    constructor(private x: number, private y: number, private z: number) {}

    private dot2(x: number, y: number): number {
        return this.x * x + this.y * y;
    }

    private dot3(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
}

var grad3 = [
    new Grad(1, 1, 0),
    new Grad(-1, 1, 0),
    new Grad(1, -1, 0),
    new Grad(-1, -1, 0),
    new Grad(1, 0, 1),
    new Grad(-1, 0, 1),
    new Grad(1, 0, -1),
    new Grad(-1, 0, -1),
    new Grad(0, 1, 1),
    new Grad(0, -1, 1),
    new Grad(0, 1, -1),
    new Grad(0, -1, -1),
];

var p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
];

// To remove the need for index wrapping, double the permutation table length
var perm = new Array(512);
var gradP = new Array(512);

export class Noise {
    constructor() {
        this.seed(0);
    }

    public seed(seedValue: number) {
        if (seedValue > 0 && seedValue < 1) {
            // Scale the seedValue out
            seedValue *= 65536;
        }

        seedValue = Math.floor(seedValue);
        if (seedValue < 256) {
            seedValue |= seedValue << 8;
        }

        for (var i = 0; i < 256; i++) {
            var v;
            if (i & 1) {
                v = p[i] ^ (seedValue & 255);
            } else {
                v = p[i] ^ ((seedValue >> 8) & 255);
            }

            perm[i] = perm[i + 256] = v;
            gradP[i] = gradP[i + 256] = grad3[v % 12];
        }
    }

    private lerp(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
    }

    private fade(t: number) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    public perlin2(x: number, y: number) {
        // Find unit grid cell containing point
        let X = Math.floor(x),
            Y = Math.floor(y);
        // Get relative xy coordinates of point within that cell
        x = x - X;
        y = y - Y;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;

        // Calculate noise contributions from each of the four corners
        let n00 = gradP[X + perm[Y]].dot2(x, y);
        let n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
        let n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
        let n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);

        // Compute the fade curve value for x
        let u = this.fade(x);

        // Interpolate the four results
        return this.lerp(
            this.lerp(n00, n10, u),
            this.lerp(n01, n11, u),
            this.fade(y)
        );
    }

    public perlin3(x: number, y: number, z: number) {
        // Find unit grid cell containing point
        let X = Math.floor(x),
            Y = Math.floor(y),
            Z = Math.floor(z);
        // Get relative xyz coordinates of point within that cell
        x = x - X;
        y = y - Y;
        z = z - Z;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;

        // Calculate noise contributions from each of the eight corners
        let n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
        let n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
        let n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
        let n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
        let n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
        let n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
        let n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
        let n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(
            x - 1,
            y - 1,
            z - 1
        );

        // Compute the fade curve value for x, y, z
        let u = this.fade(x);
        let v = this.fade(y);
        let w = this.fade(z);

        // Interpolate
        return this.lerp(
            this.lerp(this.lerp(n000, n100, u), this.lerp(n001, n101, u), w),
            this.lerp(this.lerp(n010, n110, u), this.lerp(n011, n111, u), w),
            v
        );
    }
}
