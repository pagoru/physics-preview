import * as P2 from "p2";

export type CarBodyType = {
    mass: number;
    centerOfMass: number;
    
    width: number;
    height: number;
    
    maxSteerDegree: number;
    
    frontWheelAxle: number;
    rearWheelAxle: number;
    
    ackermannAxle: number;

    wheelSideFriction: [number, number, number, number]
}

export const carBody = (
    {
        mass,
        centerOfMass,
        
        width,
        height,
    
        maxSteerDegree,
    
        frontWheelAxle,
        rearWheelAxle,
        
        ackermannAxle,
        wheelSideFriction
    }: CarBodyType
) => {

    const body = new P2.Body({
        mass,
        position: [0, 0]
    });
    
    const boxShape = new P2.Box({ width, height });
    boxShape.centerOfMass = [0, centerOfMass];
    
    body.addShape(boxShape);
    
    const vehicle = new P2.TopDownVehicle(body);
    
    const frontLeftWheel = vehicle.addWheel({
        localPosition: [-(width / 2), frontWheelAxle],
        sideFriction: wheelSideFriction[0],
    });
    const frontRightWheel = vehicle.addWheel({
        localPosition: [width / 2, frontWheelAxle],
        sideFriction: wheelSideFriction[1],
    });
    
    const rearLeftWheel = vehicle.addWheel({
        localPosition: [-(width / 2), rearWheelAxle],
        sideFriction: wheelSideFriction[2],
    });
    const rearRightWheel = vehicle.addWheel({
        localPosition: [width / 2, rearWheelAxle],
        sideFriction: wheelSideFriction[3],
    });
    
    const getWheels = () => [
        frontLeftWheel, frontRightWheel,
        rearLeftWheel, rearRightWheel
    ];
    
    const getFrontWheels = () => [
        frontLeftWheel, frontRightWheel,
    ];
    
    const getRearWheels = () => [
        rearLeftWheel, rearRightWheel
    ];
    
    let steerDegree = 0;
    
    const getSteerRadians = () => Math.abs(steerDegree) * (Math.PI / 180);
    
    const getAckermannSteerRadians = () => {
        const axleDistance = Math.abs(frontWheelAxle - ackermannAxle)
        const steerRadians = getSteerRadians()
        
        const ackermanSide = (axleDistance / Math.atan(steerRadians)) + width;
        
        return Math.atan(axleDistance / ackermanSide);
    }
    
    const steerFrontWheels = (degree: number, ) => {
        steerDegree += degree;
        
        if(steerDegree > maxSteerDegree) steerDegree = maxSteerDegree;
        if(steerDegree < - maxSteerDegree) steerDegree = - maxSteerDegree;
    
        // console.log('steerDegree', steerDegree)
        const ackermanRadians = getAckermannSteerRadians();
        const radians = getSteerRadians();
    
        frontLeftWheel.steerValue = steerDegree > 0 ? radians : - ackermanRadians
        frontRightWheel.steerValue = steerDegree > 0 ? ackermanRadians : - radians;
    }

    const getSteerDegree = (): number => steerDegree;
    
    const getBody = () => body;
    const getVehicle = () => vehicle;
    
    return {
        getWheels,
        getFrontWheels,
        getRearWheels,

        getSteerDegree,
    
        steerFrontWheels,
    
        getBody,
        getVehicle
    }
}