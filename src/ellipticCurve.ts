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
        return point.y.pow(2).valueOf() == point.x.pow(3).add(this.a.mul(point.x)).add(this.b).valueOf();
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

        if ( this.curve.isContained(this) === false ) {
            throw new Error(`(${x}, ${y}) is not on curve`);
        }
    }
}

export { EllipticCurve, Point };
