interface PrimeGaloisFieldInterface {
  prime: bigint;
  isContained(fieldElement: FieldElement): boolean;
}

interface FieldElementInterface {
  value: bigint;
  field: PrimeGaloisField;
  valueOf(): string;
  P(): bigint;
  add(other: FieldElement): FieldElement;
  sub(other: FieldElement): FieldElement;
  mul(other: FieldElement): FieldElement;
  scalarMul(n: bigint): FieldElement;
  pow(exponent: bigint): FieldElement;
  inv(): FieldElement;
}

class PrimeGaloisField implements PrimeGaloisFieldInterface {
  prime: bigint;

  constructor(prime: bigint) {
    this.prime = prime;
  }

  isContained(fieldElement: FieldElement): boolean {
    return 0n <= fieldElement.value && fieldElement.value < this.prime;
  }
}

class FieldElement implements FieldElementInterface {
  value: bigint;
  field: PrimeGaloisField;

  constructor(value: bigint, field: PrimeGaloisField) {
    this.value = value;
    this.field = field;
  }

  valueOf(): string {
    return "0x" + this.value.toString(16).padStart(64, "0");
  }

  P(): bigint {
    return this.field.prime;
  }

  mod(value: bigint): bigint {
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

  scalarMul(n: bigint): FieldElement {
    return new FieldElement(this.mod(this.value * n), this.field);
  }

  pow(exponent: bigint): FieldElement {
    if (exponent < 0n) {
      return this.inv().pow(-exponent);
    }

    let result: FieldElement = new FieldElement(1n, this.field);
    let base: FieldElement = new FieldElement(this.value, this.field);
    while (exponent > 0n) {
      // if the last bit is 1, then multiply
      if (exponent % 2n == 1n) {
        result = result.mul(base);
      }

      exponent = exponent / 2n;
      base = base.mul(base);
    }

    return result;
  }

  inv(): FieldElement {
    // extended euclidean algorithm
    let sp: bigint = 1n;
    let sc: bigint = 0n;
    let tp: bigint = 0n;
    let tc: bigint = 1n;
    let rp: bigint = this.value;
    let rc: bigint = this.P();
    let q: bigint;

    while (true) {
      let sn: bigint;
      let tn: bigint;
      let rn: bigint;

      q = rp / rc;
      rn = rp % rc;
      rp = rc;
      rc = rn;

      if (rn == 0n) {
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
