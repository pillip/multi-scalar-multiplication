import { Point } from "./ellipticCurve";
import { MultiScalarMultiplication, bigintPair } from "./multiScalarMultiplication"; // for giving example

export { EllipticCurve, Point } from "./ellipticCurve";
export { FieldElement, PrimeGaloisField } from "./galoisFields";
export { MultiScalarMultiplication, bigintPair } from "./multiScalarMultiplication";

export const hello = (): void => {
    // for giving example
    const a: bigint = 0n;
    const b: bigint = 3n;
    const p: bigint =
      21888242871839275222246405745257275088696311157297823662689037894645226208583n;
    
    const baseData: bigintPair[] = [];
    const scalarData: bigint[] = [];

    baseData.push({ x: 1257898558217152544817239837800032861115782841062496583507128321921261179065n, y: 19056556272371186377288805945980947637802298812434490949873163194090938150867n });
    baseData.push({ x: 8517630352547944874841104362933558791515114501614167574243799566499010806068n, y: 13626812643013250559720587012249578343127614464183158314880608419477324467538n });

    scalarData.push(15004755199009710112284631964986966556476336056333019315030628511687640687855n);
    scalarData.push(15318266778559804796161468693805934699816248964181771373202677263788356091966n);

    const msm = new MultiScalarMultiplication(a, b, p);
    msm.loadData(scalarData, baseData);

    const result: Point = msm.calculate();

    console.log(result.x, result.y);
};