interface PrimeGaloisFieldInterface {
    prime: number;
    isContained(fieldElement: FieldElement): boolean;
}

interface FieldElementInterface {
    value: number;
    field: PrimeGaloisField;
    valueOf(): string;
    P(): number;
    add(other: FieldElement): FieldElement;
    sub(other: FieldElement): FieldElement;
    mul(other: FieldElement): FieldElement;
    pow(exponent: number): FieldElement;
    trueDiv(other: FieldElement): FieldElement;
}

class PrimeGaloisField implements PrimeGaloisFieldInterface {
    prime: number;

    constructor(prime: number) {
        this.prime = prime;
    }

    isContained(fieldElement: FieldElement): boolean {
        return 0 <= fieldElement.value && fieldElement.value < this.prime;
    }
}

class FieldElement implements FieldElementInterface {
    value: number;
    field: PrimeGaloisField;

    constructor(value: number, field: PrimeGaloisField) {
        this.value = value;
        this.field = field;
    }

    valueOf(): string {
        return "0x" + this.value.toString(16).padStart(64, "0");
    }

    P(): number {
        return this.field.prime;
    }

    add(other: FieldElement): FieldElement {
        if (!this.field.isContained(other)) {
            throw new Error(`Cannot add ${other} to ${this} in ${this.field}`);
        }
        return new FieldElement((this.value + other.value) % this.P(), this.field);
    }

    sub(other: FieldElement): FieldElement {
        if (!this.field.isContained(other)) {
            throw new Error(`Cannot sub ${other} to ${this} in ${this.field}`);
        }
        return new FieldElement((this.value - other.value) % this.P(), this.field);
    }

    mul(other: FieldElement): FieldElement {
        if (!this.field.isContained(other)) {
            throw new Error(`Cannot mul ${other} to ${this} in ${this.field}`);
        }
        return new FieldElement((this.value * other.value) % this.P(), this.field);
    }

    pow(exponent: number): FieldElement {
        return new FieldElement((this.value ** exponent) % this.P(), this.field);
    }

    trueDiv(other: FieldElement): FieldElement {
        if (!this.field.isContained(other)) {
            throw new Error(`Cannot trueDiv ${other} to ${this} in ${this.field}`);
        }
        return this.mul(other.pow(-1));
    }
}

export { FieldElement, PrimeGaloisField };
