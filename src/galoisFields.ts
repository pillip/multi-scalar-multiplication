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
  scalarMul(n: number): FieldElement;
  pow(exponent: number): FieldElement;
  inv(): FieldElement;
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

  mod(value: number): number {
    return value >= 0
      ? value % this.P()
      : ((value % this.P()) + this.P()) % this.P();
  }

  add(other: FieldElement): FieldElement {
    if (!this.field.isContained(other)) {
      throw new Error(`Cannot add ${other} to ${this} in ${this.field}`);
    }

    return new FieldElement(this.mod(this.value + other.value), this.field);
  }

  sub(other: FieldElement): FieldElement {
    if (!this.field.isContained(other)) {
      throw new Error(`Cannot sub ${other} to ${this} in ${this.field}`);
    }

    return new FieldElement(this.mod(this.value - other.value), this.field);
  }

  mul(other: FieldElement): FieldElement {
    if (!this.field.isContained(other)) {
      throw new Error(`Cannot mul ${other} to ${this} in ${this.field}`);
    }

    return new FieldElement(this.mod(this.value * other.value), this.field);
  }

  scalarMul(n: number): FieldElement {
    return new FieldElement(this.mod(this.value * n), this.field);
  }

  pow(exponent: number): FieldElement {
    if (exponent < 0) {
      return this.inv().pow(-exponent);
    }

    let result: FieldElement = new FieldElement(1, this.field);
    let base: FieldElement = new FieldElement(this.value, this.field);
    while (exponent > 0) {
      // if the last bit is 1, then multiply
      if (exponent % 2 == 1) {
        result = result.mul(base);
      }

      exponent = Math.floor(exponent / 2);
      base = base.mul(base);
    }

    return result;
  }

  inv(): FieldElement {
    // extended euclidean algorithm
    let sp: number = 1;
    let sc: number = 0;
    let tp: number = 0;
    let tc: number = 1;
    let rp: number = this.value;
    let rc: number = this.P();
    let q: number;

    while (true) {
      let sn: number;
      let tn: number;
      let rn: number;

      q = Math.floor(rp / rc);
      rn = rp % rc;
      rp = rc;
      rc = rn;

      if (rn == 0) {
        return new FieldElement(this.mod(sc), this.field);
      }

      sn = sp - q * sc;
      sp = sc;
      sc = sn;

      tn = tp - q * tc;
      tp = tc;
      tc = tn;
    }

    return new FieldElement(this.mod(sc), this.field);
  }
}

export { FieldElement, PrimeGaloisField };
