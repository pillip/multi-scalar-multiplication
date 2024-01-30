import { EllipticCurve } from "..";

describe('EllipticCurve class tests', () => {
    it('constructor test', () => {
        let curve = new EllipticCurve(2, 3, 5);

        expect(() => {
            let invalidCurve = new EllipticCurve(6, 3, 5);
        }).toThrow(new Error("(6, 3) is not in fields"));
    });
});