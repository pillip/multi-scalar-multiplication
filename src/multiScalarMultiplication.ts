import * as fs from 'fs';
import { EllipticCurve, Point } from './ellipticCurve';
import { FieldElement, PrimeGaloisField } from './galoisFields';

interface MultiScalarMultiplicationInterface {
  scalars: FieldElement[];
  points: Point[];
  curve: EllipticCurve;
};

class MultiScalarMultiplication implements MultiScalarMultiplicationInterface {
  scalars: FieldElement[];
  points: Point[];
  curve: EllipticCurve;
  totalBits: number = 256; // 64 characters in hexadecimal
  chunkSize: number = 8; // 2 characters in hexadecimal
  bucketCounts: number = 2 ** this.chunkSize - 1;
  
  constructor() {
    const scalarData = fs.readFileSync('data/scalars.txt', 'utf8');
    const scalarDataArray = scalarData.split('\n');

    const baseData = fs.readFileSync('data/bases.txt', 'utf8');
    const baseDataArray = baseData.split('\n');

    // Define Curve
    const a: bigint = 0n;
    const b: bigint = 3n;
    const p: bigint = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;
    this.curve = new EllipticCurve(a, b, p);

    this.scalars = [];
    let field: PrimeGaloisField = new PrimeGaloisField(p);
    for ( const scalar of scalarDataArray ) {
      this.scalars.push(new FieldElement(BigInt(scalar), field));
    }

    this.points = [];
    for ( const point of baseDataArray ) {
      const pointArray = point.slice(1,-1).replace(' ','').split(',');
      this.points.push(new Point(BigInt(pointArray[0]), BigInt(pointArray[1]), this.curve));
    }
  }

  calculate(): Point {
    let chunkPoints: Point[] = [];
    for ( let chunkIdx = 0; chunkIdx < this.totalBits / this.chunkSize; chunkIdx++ ) {
      // [startIdx, endIdx)
      let startIdx: number = chunkIdx * this.chunkSize / 4;
      let endIdx: number = startIdx + this.chunkSize / 4;

      chunkPoints[chunkIdx] = this.calculateChunk(startIdx, endIdx);     
    }
    
    let g: Point = new Point(0n, 0n, this.curve);
    for ( let i = 0; i < chunkPoints.length; i++ ) {
      g = g.scalarMul(2n ** BigInt(this.chunkSize));
      g = g.add(chunkPoints[i]);
    }

    return g;
  }

  calculateChunk(startIdx: number, endIdx: number): Point {
    let bucket: Point[] = [];

    // initialize bucket
    for ( let i = 0; i <= this.bucketCounts; i++ ) {
      bucket[i] = new Point(0n, 0n, this.curve);
    }

    // stack point to bucket
    for ( let i = 0; i < this.scalars.length; i++ ) {
      let coefficient: number = this.hexToDec(this.scalars[i].valueOf().slice(2 + startIdx, 2 + endIdx));

      bucket[Number(coefficient)] = bucket[Number(coefficient)].add(this.points[i]);
    }

    // sum up bucket
    let ret: Point = new Point(0n, 0n, this.curve);
    let base: Point = new Point(0n, 0n, this.curve);
    for ( let i = this.bucketCounts; i >= 1; i-- ) {
      base = base.add(bucket[i]);
      ret = ret.add(base); 
    }

    return ret;
  }

  hexToDec(hex: string): number {
    return parseInt(hex, 16);
  }
}

  export { MultiScalarMultiplication };

