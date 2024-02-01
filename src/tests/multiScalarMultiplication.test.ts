import { MultiScalarMultiplication, Point } from "..";

describe('MultiScalarMultiplication class tests', () => {
    it('test', () => {
        let msm: MultiScalarMultiplication = new MultiScalarMultiplication();

        let point: Point = msm.calculate();
        console.log(point.x, point.y);

        expect(true).toBeFalsy(); // for test
    });
});