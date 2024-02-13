import { EllipticCurve, Point } from "./ellipticCurve";
import { FieldElement } from "./galoisFields";

interface MultiScalarMultiplicationInterface {
  scalars: FieldElement[];
  points: Point[];
  curve: EllipticCurve;
}

type bigintPair = {
  x: bigint;
  y: bigint;
};

class MultiScalarMultiplication implements MultiScalarMultiplicationInterface {
  scalars: FieldElement[] = [];
  points: Point[] = [] ;
  curve: EllipticCurve;
  totalBits: number = 256; // 64 characters in hexadecimal
  chunkSize: number = 8; // 2 characters in hexadecimal
  bucketCounts: number = 2 ** this.chunkSize - 1;

  constructor(a: bigint, b: bigint, p: bigint) {
    this.curve = new EllipticCurve(a, b, p);
  }

  loadData(scalarData: bigint[], baseData: bigintPair[]): void {
    for ( const point of baseData) {
      this.points.push(new Point(point.x, point.y, this.curve));
    }

    for (const scalar of scalarData) {
      this.scalars.push(new FieldElement(scalar, this.curve.field));
    }
  }

  calculate(): Point {
    let chunkPoints: Point[] = [];
    for (
      let chunkIdx = 0;
      chunkIdx < this.totalBits / this.chunkSize;
      chunkIdx++
    ) {
      // [startIdx, endIdx)
      let startIdx: number = (chunkIdx * this.chunkSize) / 4;
      let endIdx: number = startIdx + this.chunkSize / 4;

      chunkPoints[chunkIdx] = this.calculateChunk(startIdx, endIdx);
    }

    let g: Point = new Point(0n, 0n, this.curve);
    for (let i = 0; i < chunkPoints.length; i++) {
      g = g.scalarMul(2n ** BigInt(this.chunkSize));
      g = g.add(chunkPoints[i]);
    }

    return g;
  }

  calculateChunk(startIdx: number, endIdx: number): Point {
    let bucket: Point[] = [];

    // initialize bucket
    for (let i = 0; i <= this.bucketCounts; i++) {
      bucket[i] = new Point(0n, 0n, this.curve);
    }

    // stack point to bucket
    for (let i = 0; i < this.scalars.length; i++) {
      let coefficient: number = this.hexToDec(
        this.scalars[i].valueOf().slice(2 + startIdx, 2 + endIdx)
      );

      bucket[Number(coefficient)] = bucket[Number(coefficient)].add(
        this.points[i]
      );
    }

    // sum up bucket
    let ret: Point = new Point(0n, 0n, this.curve);
    let base: Point = new Point(0n, 0n, this.curve);
    for (let i = this.bucketCounts; i >= 1; i--) {
      base = base.add(bucket[i]);
      ret = ret.add(base);
    }

    return ret;
  }

  hexToDec(hex: string): number {
    return parseInt(hex, 16);
  }
}

export { MultiScalarMultiplication, bigintPair };
