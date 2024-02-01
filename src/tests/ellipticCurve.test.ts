import { EllipticCurve, Point } from "..";

describe('EllipticCurve class tests', () => {
    let curve: EllipticCurve;

    beforeEach(() => {
        curve = new EllipticCurve(2n, 3n, 7n);
    });

    it('constructor test', () => {
        expect(() => {
            let invalidCurve: EllipticCurve = new EllipticCurve(6n, 3n, 5n);
        }).toThrow(new Error("(6, 3) is not in fields"));
    });

    it('isContained method test', () => {
        let point: Point = new Point(3n, 6n, curve);
        
        expect(curve.isContained(point)).toEqual(true);
    });
});

describe('Point class tests', () => {
    let curve: EllipticCurve;

    beforeEach(() => {
        curve = new EllipticCurve(2n, 3n, 7n);
    });

    it('constructor test', () => {
        let point: Point = new Point(3n, 6n, curve);

        expect(() => {
            let invalidPoint: Point = new Point(3n, 3n, curve);
        }).toThrow(new Error("(3, 3) is not on curve"));
    });

    it('should return true if the point is identity', () => {
        const point: Point = new Point(0n, 0n, curve);
        
        expect(point.isIdentity()).toBe(true);
    });

    it('should throw an error when adding points on different curves', () => {
        const curve2: EllipticCurve = new EllipticCurve(6n, 4n, 11n);
        const point1: Point = new Point(3n, 6n, curve);
        const point2: Point = new Point(3n, 7n, curve2);
        
        expect(() => {
            point1.add(point2);
        }).toThrow(new Error('Two points are not on the same curve'));
    });

    it('identity + P test', () => {
        let point: Point = new Point(3n, 6n, curve);
        let identity: Point = new Point(0n, 0n, curve);

        expect(identity.add(point)).toEqual(point);
        expect(point.add(identity)).toEqual(point);
    });

    it('P + (-P) test', () => {
        let point: Point = new Point(3n, 6n, curve);
        let negativePoint: Point = new Point(3n, 1n, curve);
        let identity: Point = new Point(0n, 0n, curve);

        expect(point.add(negativePoint)).toEqual(identity);
        expect(negativePoint.add(point)).toEqual(identity); 
    });

    it('general case', () => {
        const point1 = new Point(3n, 6n, curve);
        const point2 = new Point(6n, 0n, curve);
        
        const expected = new Point(2n, 6n, curve);
        const result = point1.add(point2);

        expect(result).toEqual(expected);
    });

    it('scalarMul test', () => {
        const point = new Point(3n, 6n, curve);
        const negativePoint = new Point(3n, 1n, curve);
        
        const result = point.scalarMul(2n);
        const result1 = point.scalarMul(6n);
        const result2 = point.scalarMul(-3n);        

        expect(result).toEqual(point.add(point));
        expect(result1).toEqual(point.add(point).add(point).add(point).add(point).add(point));
        expect(result2).toEqual(negativePoint.add(negativePoint).add(negativePoint));
    });
});