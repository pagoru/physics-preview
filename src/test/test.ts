import {Canvas} from "canvas/canvas";
import {World} from "world/world";
import * as P2 from "p2";
import {carBody} from "test/car-body";
import * as PIXI from "pixi.mjs";
import {Utils} from "utils/utils";
import {SpriteSheetEnum} from "../sprite-sheets/sprite-sheets.enum";
import {SpriteSheet} from "../sprite-sheets/sprite-sheet";

export const Test = (() => {

    const testCar = () => {

        const { stage } = Canvas.getApp();
        const world = World.getWorld();

        const {
            getBody,
            getVehicle,
            getFrontWheels,
            getWheels,
            steerFrontWheels
        } = carBody({
            mass: 850,
            centerOfMass: 10,

            width: 20,
            height: 40,

            maxSteerDegree: 45,

            frontWheelAxle: 2,
            rearWheelAxle: -17,
            ackermannAxle: -17
        });

        getVehicle().addToWorld(world);
        const body = getBody();
        body.allowSleep = false;
        body.sleepSpeedLimit = 1;
        body.sleepTimeLimit = 1;
        world.addBody(body);

        const vehicleGraph = new PIXI.Graphics();
        vehicleGraph.name = `body::${body.id}`
        vehicleGraph.beginFill(Utils.color.getRandomColor());
        vehicleGraph.drawPolygon([
            [-6, -20],
            [6, -20],
            [6, 5],
            [-6, 5],
        ].flat(1));
        vehicleGraph.endFill();


        const wheelPolygon = [-1, -2, 1, -2, 1, 2, -1, 2];

        const frontLeftWheel = new PIXI.Graphics();
        frontLeftWheel.beginFill(Utils.color.getRandomColor());
        frontLeftWheel.drawPolygon(wheelPolygon);
        frontLeftWheel.endFill();
        frontLeftWheel.position.set(-6, 2)

        const frontRightWheel = new PIXI.Graphics();
        frontRightWheel.beginFill(Utils.color.getRandomColor());
        frontRightWheel.drawPolygon(wheelPolygon);
        frontRightWheel.endFill();
        frontRightWheel.position.set(6, 2)

        vehicleGraph.addChild(frontLeftWheel, frontRightWheel);

        stage.addChild(vehicleGraph);

        getWheels().forEach(wheel => {
            wheel.setSideFriction(200)
        })

        const keyCodeDown = {};
        window.addEventListener('keydown', ({ code }) => {
            keyCodeDown[code] = true;
        }, false);
        window.addEventListener('keyup', ({ code }) => {
            keyCodeDown[code] = false;
        }, false);

        Canvas.getApp().ticker.add((delta) => {
            if(keyCodeDown['KeyW']) {
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce((wheel.engineForce < 0) ? 100 : 0);
                })
                getFrontWheels().forEach(wheel => {
                    wheel.engineForce += (wheel.engineForce < 0) ? 6 : 2;
                });
            }

            if(keyCodeDown['KeyS']) {
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce((wheel.engineForce > 0) ? 100 : 0);
                })
                getFrontWheels().forEach(wheel => {
                    wheel.engineForce -= (wheel.engineForce > 0) ? 6 : 2;
                });
            }

            if (!keyCodeDown['KeyW'] && !keyCodeDown['KeyS']) {
                getFrontWheels().forEach(wheel => {
                    if(wheel.engineForce > 0)
                        wheel.engineForce -= 1;
                    if(wheel.engineForce < 0)
                        wheel.engineForce += 1;
                });
            }

            if(keyCodeDown['KeyD']) {
                steerFrontWheels(1)
                const [leftWheel, rightWheel] = getFrontWheels();
                frontLeftWheel.rotation = leftWheel.steerValue;
                frontRightWheel.rotation = rightWheel.steerValue;
            }

            if(keyCodeDown['KeyA']) {
                steerFrontWheels(-1)
                const [leftWheel, rightWheel] = getFrontWheels();
                frontLeftWheel.rotation = leftWheel.steerValue;
                frontRightWheel.rotation = rightWheel.steerValue;
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

    const start = async () => {



        const { stage } = Canvas.getApp();
        const world = World.getWorld();

        const {
            getBody,
            getVehicle,
            getFrontWheels,
            getWheels,
            steerFrontWheels,
            getSteerDegree
        } = carBody({
            mass: 850,
            centerOfMass: 10,

            // centerOfMass: 10,


            width: 20,
            height: 40,

            maxSteerDegree: 15,

            frontWheelAxle: 19,
            rearWheelAxle: 1,
            ackermannAxle: 1

            // frontWheelAxle: 2,
            // rearWheelAxle: -17,
            // ackermannAxle: -17
        });

        getVehicle().addToWorld(world);
        const body = getBody();
        body.allowSleep = false;
        body.sleepSpeedLimit = 1;
        body.sleepTimeLimit = 1;
        world.addBody(body);

        const vehicleGraph = new PIXI.Graphics();
        vehicleGraph.name = `body::${body.id}`
        vehicleGraph.beginFill(Utils.color.getRandomColor());
        vehicleGraph.drawPolygon([
            // [-6, -20],
            // [6, -20],
            // [6, 5],
            // [-6, 5],
            [-6, -2],
            [6, -2],
            [6, 23],
            [-6, 23],
        ].flat(1));
        vehicleGraph.endFill();


        const wheelPolygon = [-1, -2, 1, -2, 1, 2, -1, 2];

        const frontLeftWheel = new PIXI.Graphics();
        frontLeftWheel.beginFill(Utils.color.getRandomColor());
        frontLeftWheel.drawPolygon(wheelPolygon);
        frontLeftWheel.endFill();
        frontLeftWheel.position.set(-6, 19)

        const frontRightWheel = new PIXI.Graphics();
        frontRightWheel.beginFill(Utils.color.getRandomColor());
        frontRightWheel.drawPolygon(wheelPolygon);
        frontRightWheel.endFill();
        frontRightWheel.position.set(6, 19)

        vehicleGraph.addChild(frontLeftWheel, frontRightWheel);

        vehicleGraph.visible = false;
        stage.addChild(vehicleGraph);

        getWheels().forEach(wheel => {
            wheel.setSideFriction(200)
        })

        const keyCodeDown = {};
        window.addEventListener('keydown', ({ code }) => {
            keyCodeDown[code] = true;
        }, false);
        window.addEventListener('keyup', ({ code }) => {
            keyCodeDown[code] = false;
        }, false);

        Canvas.getApp().ticker.add((delta) => {
            if(keyCodeDown['KeyW']) {
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce((wheel.engineForce < 0) ? 100 : 0);
                })
                getFrontWheels().forEach(wheel => {
                    wheel.engineForce += 1;
                });
            }

            if(keyCodeDown['KeyS']) {
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce((wheel.engineForce > 0) ? 100 : 0);
                })
                getFrontWheels().forEach(wheel => {
                    wheel.engineForce -= 1;
                });
            }

            if (!keyCodeDown['KeyW'] && !keyCodeDown['KeyS']) {
                getFrontWheels().forEach(wheel => {
                    if(wheel.engineForce > 0)
                        wheel.engineForce -= 1;
                    if(wheel.engineForce < 0)
                        wheel.engineForce += 1;
                });
            }

            if(keyCodeDown['KeyD']) {
                steerFrontWheels(1)
                const [leftWheel, rightWheel] = getFrontWheels();
                frontLeftWheel.rotation = leftWheel.steerValue;
                frontRightWheel.rotation = rightWheel.steerValue;
            }

            if(keyCodeDown['KeyA']) {
                steerFrontWheels(-1)
                const [leftWheel, rightWheel] = getFrontWheels();
                frontLeftWheel.rotation = leftWheel.steerValue;
                frontRightWheel.rotation = rightWheel.steerValue;
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

        /**
         * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
         */

        const carContainer = new PIXI.Container();

        const carBodySprite = SpriteSheet.getSpriteSheet(SpriteSheetEnum.CAR_GOLF_GTI_MK1_BODY);
        const carTiresSprite = SpriteSheet.getSpriteSheet(SpriteSheetEnum.CAR_GOLF_GTI_MK1_TIRES);

        const animation = '5';

        const animatedSpriteBody = new PIXI.AnimatedSprite(carBodySprite.animations[animation]);
        const animatedSpriteTires = new PIXI.AnimatedSprite(carTiresSprite.animations[animation]);
        // animatedSpriteTires.play()

        carContainer.addChild(animatedSpriteBody, animatedSpriteTires);
        carContainer.pivot.set(196 / 2, 196 / 2)

        stage.addChild(carContainer)

        const getAnimation = (azimuth: number): number => {
            const correctedAzimuth = Math.round(azimuth / 5) * 5 + 5;
            console.log('correctedAzimuth', azimuth, correctedAzimuth)
            return correctedAzimuth >= 365 ? 5 : correctedAzimuth;
        }

        const setCarAzimuth = (azimuth: number) => {
            const animation = getAnimation(azimuth);
            animatedSpriteBody.textures = carBodySprite.animations[animation]
            animatedSpriteTires.textures = carTiresSprite.animations[animation]
        }


        Canvas.getApp().ticker.add((delta) => {

            const a = Utils.position.getIsometricFromPosition({ x: body.position[0], y: body.position[1] });
            carContainer.position.set(-a.x, -a.z)

            let b = (body.angle * (180 / Math.PI));
            while(0 > b) b += 360;
            while(b > 360) b -= 360;

            setCarAzimuth(b)
            // carContainer.rotation = body.angle;

            const wheelPosition = ((getSteerDegree() + 15) * (15/30));
            animatedSpriteTires.gotoAndStop(wheelPosition);
        });
    }
    
    return {
        start
    }
})();