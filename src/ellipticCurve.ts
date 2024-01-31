import { FieldElement, PrimeGaloisField } from "./galoisFields";

interface EllipticCurveInterface {
    a: FieldElement;
    b: FieldElement;
    field : PrimeGaloisField;
}

interface PointInterface {
    x: FieldElement;
    y: FieldElement;
    curve: EllipticCurve;
};

class EllipticCurve implements EllipticCurveInterface {
    a: FieldElement;
    b: FieldElement;
    field : PrimeGaloisField;

    constructor(a: number, b: number, prime: number) {
        this.field = new PrimeGaloisField(prime);
        this.a = new FieldElement(a, this.field);
        this.b = new FieldElement(b, this.field);

        if ( this.field.isContained(this.a) === false || this.field.isContained(this.b) === false ) {
            throw new Error(`(${a}, ${b}) is not in fields`);
        }
    }

    isContained(point: Point): boolean {
        return point.y.pow(2).value == point.x.pow(3).add(this.a.mul(point.x)).add(this.b).value;
    }
}


class Point implements PointInterface {
    x: FieldElement;
    y: FieldElement;
    curve: EllipticCurve;

    constructor(x: number, y: number, curve: EllipticCurve) {
        this.curve = curve;
        this.x = new FieldElement(x, this.curve.field);
        this.y = new FieldElement(y, this.curve.field);

        if ( (x != 0 || y != 0) && this.curve.isContained(this) === false ) {
            throw new Error(`(${x}, ${y}) is not on curve`);
        }
    }

    isIdentity(): boolean {
        return this.x.value == 0 && this.y.value == 0;
    }

    add(other: Point): Point | undefined {
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
        if (this.x.value == other.x.value && this.y.value == other.y.scalarMul(-1).value) {
            return new Point(0, 0, this.curve);
        }

        // general case
        if (this.x.value != other.x.value) {
            let s: FieldElement = other.y.sub(this.y).mul(other.x.sub(this.x).inv());
            let x3: FieldElement = s.pow(2).sub(this.x).sub(other.x);
            let y3: FieldElement = s.mul(this.x.sub(x3)).sub(this.y);

            console.log(s, x3, y3);

            return new Point(x3.value, y3.value, this.curve);
        }

        // self == other        
        if ( this.x.value == other.x.value && this.y.value == other.y.value ) {
            // self.y == Infinity -> I
            if ( this.y.value == 0 ) {
                return new Point(0, 0, this.curve);
            }

            let s: FieldElement = this.x.pow(2).scalarMul(3).add(this.curve.a).mul(this.y.scalarMul(2).inv());
            let x3: FieldElement = s.pow(2).sub(this.x.scalarMul(2));
            let y3: FieldElement = s.mul(this.x.sub(x3)).sub(this.y);

            return new Point(x3.value, y3.value, this.curve);
        }
    }
}

export { EllipticCurve, Point };
