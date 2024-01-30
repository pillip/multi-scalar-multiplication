import { FieldElement, PrimeGaloisField } from "./galoisFields";

interface EllipticCurveInterface {
    a: FieldElement;
    b: FieldElement;
    field : PrimeGaloisField;
}

class EllipticCurve implements EllipticCurveInterface {
    a: FieldElement;
    b: FieldElement;
    field : PrimeGaloisField;

    constructor(a: number, b: number, prime: number) {
        this.field = new PrimeGaloisField(prime);
        this.a = new FieldElement(a, this.field);
        this.b = new FieldElement(b, this.field);

        if ( this.field.isContain(this.a) === false || this.field.isContain(this.b) === false ) {
            throw new Error(`(${a}, ${b}) is not in fields`);
        }
    }
}

export { EllipticCurve };
