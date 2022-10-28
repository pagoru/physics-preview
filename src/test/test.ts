import {Canvas} from "canvas/canvas";
import * as P2 from "p2";
import {World} from "world/world";
import {Utils} from "utils/utils";
import * as PIXI from "pixi.mjs";

export const Test = (() => {

    const start = () => {
        
        const { stage } = Canvas.getApp();
        const world = World.getWorld();
    
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

            const radians = (degreeSteer * Math.PI) / 180.0;
            frontWheel1.steerValue = radians;
            frontWheel2.steerValue = radians;
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
                if(frontWheel1.engineForce > 1500) return;
                frontWheel1.engineForce += 2;
                frontWheel2.engineForce += 2;
            } else {
                frontWheel1.engineForce = 0;
                frontWheel2.engineForce = 0;
                frontWheel1.setBrakeForce(5)
                frontWheel2.setBrakeForce(5)
                backWheel1.setBrakeForce(3)
                backWheel2.setBrakeForce(3)
            }
            if(keyCodeDown['KeyS']) {
                frontWheel1.engineForce = 0;
                frontWheel2.engineForce = 0;
            }
            if(keyCodeDown['KeyD']) {
                steer(.25)
            }
            if(keyCodeDown['KeyA']) {
                if(degreeSteer > 0)
                    degreeSteer = 0;
                steer(-.25)
            }

            if(!keyCodeDown['KeyD'] && !keyCodeDown['KeyA']) {
                degreeSteer = 0;
                steer(0)
            }
        });
    
        world.on('postStep', event => {
            const awakeBodies = world.bodies.filter(
                body =>
                    body.type !== P2.Body.STATIC && body.sleepState !== P2.Body.SLEEPING
            );
            awakeBodies.forEach((body) => {
    
                const graphics = stage.getChildByName(`body::${body.id}`);
                graphics.position.set(body.position[0], body.position[1])
                graphics.rotation = body.angle;
            });

        });
    }
    
    return {
        start
    }
})();