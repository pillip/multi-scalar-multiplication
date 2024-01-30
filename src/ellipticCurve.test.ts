import { EllipticCurve, Point } from "..";

describe('EllipticCurve class tests', () => {
    it('constructor test', () => {
        let curve = new EllipticCurve(2, 3, 5);

        expect(() => {
            let invalidCurve = new EllipticCurve(6, 3, 5);
        }).toThrow(new Error("(6, 3) is not in fields"));
    });

    it('isContained method test', () => {
        let curve = new EllipticCurve(6, 4, 11);
        let point = new Point(3, 7, curve);
        
        let another_curve = new EllipticCurve(2, 3, 7);
        let another_point = new Point(3, 6, another_curve);

        expect(curve.isContained(point)).toEqual(true);
        expect(another_curve.isContained(another_point)).toEqual(true);
        expect(another_curve.isContained(point)).toEqual(false);
    });
});

describe('Point class tests', () => {
});