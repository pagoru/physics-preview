import * as P2 from "p2";
import {Utils} from "utils/utils";
import * as PIXI from "pixi.mjs";
import {Canvas} from "canvas/canvas";

export const Car = (world, stage) => {
    
    const getRadiansFromDegree = (degree: number) => (degree * Math.PI) / 180.0;
    
    const getAchermanDegree = (
        degree: number,
        [front1X, front1Y]: [number, number],
        [front2X, front2Y]: [number, number],
        [back1X, back1Y]: [number, number],
        [back2X, _1]: [number, number],
    ) => {
        const [_2, lengthY] = [
            back1X - front1X,
            back1Y - front1Y
        ];
        
        const opposite = Math.abs(lengthY);
        const wheelRadians = degree * (Math.PI / 180);
        
        let sideB = opposite / Math.atan(wheelRadians);
        sideB += (back2X - back1X)
        
        const o = Math.atan(opposite / sideB);
        let _degree = o * (180 / Math.PI);
        while (_degree > 360) _degree -= 360;
        
        return _degree;
    }
    
    const newBody = () => {
        const body = new P2.Body({
            mass: 850,
            position: [0, 0],
        });
        body.id = Utils.id.getUID();
        body.allowSleep = false;
        body.sleepSpeedLimit = 1;
        body.sleepTimeLimit = 1;
        
        const graphics = new PIXI.Graphics();
        graphics.name = `body::${body.id}`
        graphics.beginFill(Utils.color.getRandomColor());
        graphics.drawPolygon([-5, -10, 5, -10, 5, 10, -5, 10]);
        graphics.endFill();
        
        stage.addChild(graphics);
        
        world.addBody(body);
        return body;
    }
    
    const chassisBody = newBody();
    
    var boxShape = new P2.Box({ width: 10, height: 20 });
    boxShape.centerOfMass = [0, 5]
    chassisBody.addShape(boxShape);
    // chassisBody.adjustCenterOfMass()
    
    world.addBody(chassisBody);
    
    // Create the vehicle
    var vehicle = new P2.TopDownVehicle(chassisBody);
    
    // Add one front wheel and one back wheel - we don't actually need four :)
    var frontWheel1 = vehicle.addWheel({
        localPosition: [-5, 10] // front
    });
    frontWheel1.setSideFriction(1);
    var frontWheel2 = vehicle.addWheel({
        localPosition: [5, 10] // front
    });
    frontWheel2.setSideFriction(1);
    
    // Back wheel
    var backWheel1 = vehicle.addWheel({
        localPosition: [-5, -10] // back
    });
    backWheel1.setSideFriction(50); // Less side friction on back wheel makes it easier to drift
    var backWheel2 = vehicle.addWheel({
        localPosition: [5, -10] // back
    });
    backWheel2.setSideFriction(50); // Less side friction on back wheel makes it easier to drift
    vehicle.addToWorld(world);
    
    
    // Steer value zero means straight forward. Positive is left and negative right.
    frontWheel1.steerValue = 0;
    frontWheel2.steerValue = 0;
    //-Math.PI / 16
    
    // Engine force forward
    frontWheel1.engineForce = 0;
    frontWheel2.engineForce = 0;
    // backWheel2.setBrakeForce(1);
    
    const MAX_DEGREE = 20;
    let degreeSteer = 0;
    
    const steer = (degree: number) => {
        degreeSteer += degree;
        
        if(degreeSteer > MAX_DEGREE) degreeSteer = MAX_DEGREE;
        if(degreeSteer < - MAX_DEGREE) degreeSteer = - MAX_DEGREE;
        
        const achernamRadians = getRadiansFromDegree(getAchermanDegree(
            degreeSteer,
            frontWheel1.localPosition,
            frontWheel2.localPosition,
            backWheel1.localPosition,
            backWheel2.localPosition
        ));
        const radians = getRadiansFromDegree(degree);
    
        frontWheel1.steerValue = degree > 0 ? radians : achernamRadians
        frontWheel2.steerValue = degree > 0 ? achernamRadians : radians;
    }
    
    const keyCodeDown = {};
    
    window.addEventListener('keydown', ({ code }) => {
        keyCodeDown[code] = true;
    }, false);
    window.addEventListener('keyup', ({ code }) => {
        keyCodeDown[code] = false;
    }, false);
    
    Canvas.getApp().ticker.add((delta) => {
        if(keyCodeDown['KeyW']) {
            frontWheel1.setBrakeForce(0)
            frontWheel2.setBrakeForce(0)
            backWheel1.setBrakeForce(0)
            backWheel2.setBrakeForce(0)
            
            if(frontWheel1.engineForce < 1500) {
    
                frontWheel1.engineForce += 4;
                frontWheel2.engineForce += 4;
            }
        } else {
            if(frontWheel1.engineForce - .25 < 0) {
                frontWheel1.engineForce -= -.25;
                frontWheel2.engineForce -= -.25;
            }
        }
        if(keyCodeDown['KeyS']) {
            frontWheel1.setBrakeForce(300)
            frontWheel2.setBrakeForce(300)
        }
        if(keyCodeDown['KeyD']) {
            steer(5)
        }
        if(keyCodeDown['KeyA']) {
            if(degreeSteer > 0)
                degreeSteer = 0;
            steer(-5)
        }
        
        if(!keyCodeDown['KeyD'] && !keyCodeDown['KeyA']) {
            degreeSteer = 0;
            steer(0)
        }
    });
}