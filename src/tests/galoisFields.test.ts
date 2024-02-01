import { FieldElement, PrimeGaloisField } from "..";

describe('PrimeGaloisField class tests', () => {
    it('isContained method test', () => {
        let field = new PrimeGaloisField(2n);
        let element = new FieldElement(1n, field);
        let notContainElement = new FieldElement(5n, field);

        expect(field.isContained(element)).toEqual(true);
        expect(field.isContained(notContainElement)).toEqual(false);
    });
});

describe('FieldElement class tests', () => {
    it('valueOf and P method test', () => {
        let field = new PrimeGaloisField(2n);
        let element = new FieldElement(1n, field);
        let notContainElement = new FieldElement(5n, field);

        expect(element.valueOf()).toEqual('0x0000000000000000000000000000000000000000000000000000000000000001');
        expect(element.P()).toEqual(2n);
    });

    it('Closure test', () => {
        let field = new PrimeGaloisField(5n);
        let element1 = new FieldElement(3n, field);
        let element2 = new FieldElement(4n, field);

        expect(field.isContained(element1)).toEqual(true);
        expect(field.isContained(element2)).toEqual(true);
        expect(field.isContained(element1.add(element2))).toEqual(true);
    });

    it('Associativity test', () => {
        let field = new PrimeGaloisField(5n);
        let element1 = new FieldElement(3n, field);
        let element2 = new FieldElement(4n, field);
        let element3 = new FieldElement(2n, field);

        expect(element1.add(element2).add(element3)).toEqual(element2.add(element3).add(element1));
    });

    it('Identity test', () => {
        let field = new PrimeGaloisField(5n);
        let element1 = new FieldElement(3n, field);
        let identity = new FieldElement(0n, field);

        expect(element1.add(identity)).toEqual(element1);
    });

    it('Invertibility test', () => {
        let field = new PrimeGaloisField(5n);
        let element1 = new FieldElement(3n, field);
        let identity = new FieldElement(0n, field);

        expect(element1.sub(element1)).toEqual(identity);
    });
    

    it('Operation test', () => {
        let field = new PrimeGaloisField(5n);
        let element1 = new FieldElement(4n, field);
        let element2 = new FieldElement(2n, field);

        expect(element1.add(element2)).toEqual(new FieldElement(1n, field));
        expect(element1.sub(element2)).toEqual(new FieldElement(2n, field));
        expect(element1.mul(element2)).toEqual(new FieldElement(3n, field));
        expect(element1.scalarMul(3n)).toEqual(new FieldElement(2n, field));
        expect(element1.pow(3n)).toEqual(new FieldElement(4n, field));
        expect(element1.pow(-2n)).toEqual(new FieldElement(1n, field));
        expect(element1.inv()).toEqual(new FieldElement(4n, field));
        expect(element1.mul(element2.inv())).toEqual(new FieldElement(2n, field));
    });
});