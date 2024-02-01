import { FieldElement, PrimeGaloisField } from "./galoisFields";

interface EllipticCurveInterface {
  a: FieldElement;
  b: FieldElement;
  field: PrimeGaloisField;
  isContained(point: Point): boolean;
}

interface PointInterface {
  x: FieldElement;
  y: FieldElement;
  curve: EllipticCurve;
  isIdentity(): boolean;
  add(other: Point): Point;
  scalarMul(scalar: bigint): Point;
}

class EllipticCurve implements EllipticCurveInterface {
  a: FieldElement;
  b: FieldElement;
  field: PrimeGaloisField;

  constructor(a: bigint, b: bigint, prime: bigint) {
    this.field = new PrimeGaloisField(prime);
    this.a = new FieldElement(a, this.field);
    this.b = new FieldElement(b, this.field);

    if (
      this.field.isContained(this.a) === false ||
      this.field.isContained(this.b) === false
    ) {
      throw new Error(`(${a}, ${b}) is not in fields`);
    }
  }

  isContained(point: Point): boolean {
    return (
      point.y.pow(2n).value ==
      point.x.pow(3n).add(this.a.mul(point.x)).add(this.b).value
    );
  }
}

class Point implements PointInterface {
  x: FieldElement;
  y: FieldElement;
  curve: EllipticCurve;

  constructor(x: bigint, y: bigint, curve: EllipticCurve) {
    this.curve = curve;
    this.x = new FieldElement(x, this.curve.field);
    this.y = new FieldElement(y, this.curve.field);

    if ((x != 0n || y != 0n) && this.curve.isContained(this) === false) {
      throw new Error(`(${x}, ${y}) is not on curve`);
    }
  }

  isIdentity(): boolean {
    return this.x.value == 0n && this.y.value == 0n;
  }

  add(other: Point): Point {
    if (this.curve != other.curve) {
      throw new Error(`Two points are not on the same curve`);
    }

    // I + P = P
    if (this.isIdentity()) {
      return other;
    }

    // P + I = P
    if (other.isIdentity()) {
      return this;
    }

    // P + (-P) = I
    if (
      this.x.value == other.x.value &&
      this.y.value == other.y.scalarMul(-1n).value
    ) {
      return new Point(0n, 0n, this.curve);
    }

    // self == other
    if (this.x.value == other.x.value && this.y.value == other.y.value) {
      // self.y == Infinity -> I
      if (this.y.value == 0n) {
        return new Point(0n, 0n, this.curve);
      }

      let s: FieldElement = this.x
        .pow(2n)
        .scalarMul(3n)
        .add(this.curve.a)
        .mul(this.y.scalarMul(2n).inv());
      let x3: FieldElement = s.pow(2n).sub(this.x.scalarMul(2n));
      let y3: FieldElement = s.mul(this.x.sub(x3)).sub(this.y);

      return new Point(x3.value, y3.value, this.curve);
    }

    // general case (this.x.value != other.x.value)
    let s: FieldElement = other.y.sub(this.y).mul(other.x.sub(this.x).inv());
    let x3: FieldElement = s.pow(2n).sub(this.x).sub(other.x);
    let y3: FieldElement = s.mul(this.x.sub(x3)).sub(this.y);

    return new Point(x3.value, y3.value, this.curve);
  }

  scalarMul(scalar: bigint): Point {
    if (scalar < 0n) {
      return new Point(
        this.x.value,
        this.y.scalarMul(-1n).value,
        this.curve,
      ).scalarMul(-scalar);
    }

    let result: Point = new Point(0n, 0n, this.curve);
    let base: Point = new Point(this.x.value, this.y.value, this.curve);

    while (scalar > 0n) {
      // if the last bit is 1, then add
      if (scalar % 2n == 1n) {
        result = result.add(base);
      }

      scalar = scalar / 2n;
      base = base.add(base);
    }

    return result;
  }
}

export { EllipticCurve, Point };
