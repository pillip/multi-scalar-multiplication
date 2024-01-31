import { EllipticCurve, Point } from "..";

describe('EllipticCurve class tests', () => {
    let curve: EllipticCurve;

    beforeEach(() => {
        curve = new EllipticCurve(2, 3, 7);
    });

    it('constructor test', () => {
        expect(() => {
            let invalidCurve: EllipticCurve = new EllipticCurve(6, 3, 5);
        }).toThrow(new Error("(6, 3) is not in fields"));
    });

    it('isContained method test', () => {
        let point: Point = new Point(3, 6, curve);
        
        expect(curve.isContained(point)).toEqual(true);
    });
});

describe('Point class tests', () => {
    let curve: EllipticCurve;

    beforeEach(() => {
        curve = new EllipticCurve(2, 3, 7);
    });

    it('constructor test', () => {
        let point: Point = new Point(3, 6, curve);

        expect(() => {
            let invalidPoint: Point = new Point(3, 3, curve);
        }).toThrow(new Error("(3, 3) is not on curve"));
    });

    it('should return true if the point is identity', () => {
        const point: Point = new Point(0, 0, curve);
        
        expect(point.isIdentity()).toBe(true);
    });

    it('should throw an error when adding points on different curves', () => {
        const curve2: EllipticCurve = new EllipticCurve(6, 4, 11);
        const point1: Point = new Point(3, 6, curve);
        const point2: Point = new Point(3, 7, curve2);
        
        expect(() => {
            point1.add(point2);
        }).toThrow(new Error('Two points are not on the same curve'));
    });

    it('identity + P test', () => {
        let point: Point = new Point(3, 6, curve);
        let identity: Point = new Point(0, 0, curve);

        expect(identity.add(point)).toEqual(point);
        expect(point.add(identity)).toEqual(point);
    });

    it('P + (-P) test', () => {
        let point: Point = new Point(3, 6, curve);
        let negativePoint: Point = new Point(3, 1, curve);
        let identity: Point = new Point(0, 0, curve);

        expect(point.add(negativePoint)).toEqual(identity);
        expect(negativePoint.add(point)).toEqual(identity); 
    });

    it('general case', () => {
        const point1 = new Point(3, 6, curve);
        const point2 = new Point(6, 0, curve);
        
        const expected = new Point(2, 6, curve);
        const result = point1.add(point2);

        expect(result).toEqual(expected);
    });
});