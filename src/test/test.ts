import {Canvas} from "canvas/canvas";
import {World} from "world/world";
import * as P2 from "p2";
import {carBody} from "test/car-body";
import * as PIXI from "pixi.mjs";
import {Utils} from "utils/utils";
import {SpriteSheetEnum} from "../sprite-sheets/sprite-sheets.enum";
import {SpriteSheet} from "../sprite-sheets/sprite-sheet";

export const Test = (() => {

    // const testCar = () => {
    //
    //     const { stage } = Canvas.getApp();
    //     const world = World.getWorld();
    //
    //     const {
    //         getBody,
    //         getVehicle,
    //         getFrontWheels,
    //         getWheels,
    //         steerFrontWheels
    //     } = carBody({
    //         mass: 850,
    //         centerOfMass: 10,
    //
    //         width: 20,
    //         height: 40,
    //
    //         maxSteerDegree: 45,
    //
    //         frontWheelAxle: 2,
    //         rearWheelAxle: -17,
    //         ackermannAxle: -17
    //     });
    //
    //     getVehicle().addToWorld(world);
    //     const body = getBody();
    //     body.allowSleep = false;
    //     body.sleepSpeedLimit = 1;
    //     body.sleepTimeLimit = 1;
    //     world.addBody(body);
    //
    //     const vehicleGraph = new PIXI.Graphics();
    //     vehicleGraph.name = `body::${body.id}`
    //     vehicleGraph.beginFill(Utils.color.getRandomColor());
    //     vehicleGraph.drawPolygon([
    //         [-6, -20],
    //         [6, -20],
    //         [6, 5],
    //         [-6, 5],
    //     ].flat(1));
    //     vehicleGraph.endFill();
    //
    //
    //     const wheelPolygon = [-1, -2, 1, -2, 1, 2, -1, 2];
    //
    //     const frontLeftWheel = new PIXI.Graphics();
    //     frontLeftWheel.beginFill(Utils.color.getRandomColor());
    //     frontLeftWheel.drawPolygon(wheelPolygon);
    //     frontLeftWheel.endFill();
    //     frontLeftWheel.position.set(-6, 2)
    //
    //     const frontRightWheel = new PIXI.Graphics();
    //     frontRightWheel.beginFill(Utils.color.getRandomColor());
    //     frontRightWheel.drawPolygon(wheelPolygon);
    //     frontRightWheel.endFill();
    //     frontRightWheel.position.set(6, 2)
    //
    //     vehicleGraph.addChild(frontLeftWheel, frontRightWheel);
    //
    //     stage.addChild(vehicleGraph);
    //
    //     getWheels().forEach(wheel => {
    //         wheel.setSideFriction(200)
    //     })
    //
    //     const keyCodeDown = {};
    //     window.addEventListener('keydown', ({ code }) => {
    //         keyCodeDown[code] = true;
    //     }, false);
    //     window.addEventListener('keyup', ({ code }) => {
    //         keyCodeDown[code] = false;
    //     }, false);
    //
    //     Canvas.getApp().ticker.add((delta) => {
    //         if(keyCodeDown['KeyW']) {
    //             getWheels().forEach(wheel => {
    //                 wheel.setBrakeForce((wheel.engineForce < 0) ? 100 : 0);
    //             })
    //             getFrontWheels().forEach(wheel => {
    //                 wheel.engineForce += (wheel.engineForce < 0) ? 6 : 2;
    //             });
    //         }
    //
    //         if(keyCodeDown['KeyS']) {
    //             getWheels().forEach(wheel => {
    //                 wheel.setBrakeForce((wheel.engineForce > 0) ? 100 : 0);
    //             })
    //             getFrontWheels().forEach(wheel => {
    //                 wheel.engineForce -= (wheel.engineForce > 0) ? 6 : 2;
    //             });
    //         }
    //
    //         if (!keyCodeDown['KeyW'] && !keyCodeDown['KeyS']) {
    //             getFrontWheels().forEach(wheel => {
    //                 if(wheel.engineForce > 0)
    //                     wheel.engineForce -= 1;
    //                 if(wheel.engineForce < 0)
    //                     wheel.engineForce += 1;
    //             });
    //         }
    //
    //         if(keyCodeDown['KeyD']) {
    //             steerFrontWheels(1)
    //             const [leftWheel, rightWheel] = getFrontWheels();
    //             frontLeftWheel.rotation = leftWheel.steerValue;
    //             frontRightWheel.rotation = rightWheel.steerValue;
    //         }
    //
    //         if(keyCodeDown['KeyA']) {
    //             steerFrontWheels(-1)
    //             const [leftWheel, rightWheel] = getFrontWheels();
    //             frontLeftWheel.rotation = leftWheel.steerValue;
    //             frontRightWheel.rotation = rightWheel.steerValue;
    //         }
    //     });
    //
    //     world.on('postStep', event => {
    //         const awakeBodies = world.bodies.filter(
    //             body =>
    //                 body.type !== P2.Body.STATIC && body.sleepState !== P2.Body.SLEEPING
    //         );
    //         awakeBodies.forEach((body) => {
    //             const graphics = stage.getChildByName(`body::${body.id}`);
    //             graphics.position.set(body.position[0], body.position[1])
    //             graphics.rotation = body.angle;
    //         });
    //     });
    // }

    const start = async () => {



        const { stage } = Canvas.getApp();
        const world = World.getWorld();

        const width = 12;
        const height = 28;

        const moveSteeringDegree = .5;
        const powerSteeringDegree = .25;
        const maxSteerDegree = 40;

        const centerOfMass = 12;
        const frontWheelAxle = 22;
        const rearWheelAxle = 6;
        const ackermannAxle = 0;

        const {
            getBody,
            getVehicle,
            getFrontWheels,
            getWheels,
            steerFrontWheels,
            getSteerDegree
        } = carBody({
            mass: 850,
            centerOfMass,

            width,
            height,

            maxSteerDegree,

            frontWheelAxle,
            rearWheelAxle,
            ackermannAxle,

            wheelSideFriction: [50, 50, 50, 50]
        });

        getVehicle().addToWorld(world);
        const body = getBody();
        body.allowSleep = false;
        body.sleepSpeedLimit = 1;
        body.sleepTimeLimit = 1;
        world.addBody(body);

        const vehicleContainer = new PIXI.Container();
        vehicleContainer.name = `body::${body.id}`

        const vehicleGraph = new PIXI.Graphics();
        vehicleGraph.beginFill(Utils.color.getRandomColor());
        vehicleGraph.drawShape(new PIXI.Rectangle(0, 0, width, height))
        vehicleGraph.endFill();
        vehicleGraph.pivot.set(width / 2, ackermannAxle)

        const drawWheel = () => {
            const wheelGraphics = new PIXI.Graphics();
            wheelGraphics.beginFill(Utils.color.getRandomColor());
            wheelGraphics.drawShape(new PIXI.Rectangle(0, 0, 2, 6))
            wheelGraphics.endFill();
            wheelGraphics.pivot.set(1, 3);
            return wheelGraphics;
        }

        const frontLeftWheel = drawWheel();
        frontLeftWheel.position.set(-(width / 2), frontWheelAxle)

        const frontRightWheel = drawWheel();
        frontRightWheel.position.set((width / 2), frontWheelAxle)

        const rearLeftWheel = drawWheel();
        rearLeftWheel.position.set(-(width / 2), rearWheelAxle)

        const rearRightWheel = drawWheel();
        rearRightWheel.position.set((width / 2), rearWheelAxle)


        const gravityCenter = new PIXI.Graphics();
        gravityCenter.beginFill(Utils.color.getRandomColor());
        gravityCenter.drawShape(new PIXI.Circle(0, 0, 4))
        gravityCenter.endFill();
        gravityCenter.position.set(0, centerOfMass)

        vehicleContainer.addChild(vehicleGraph, frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel, gravityCenter);

        // vehicleGraph.visible = false;
        stage.addChild(vehicleContainer);

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

        let brakingForce = 0;
        Canvas.getApp().ticker.add((delta) => {

            console.log('delta', delta)

            if(keyCodeDown['KeyW']) {
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce(0);
                })
                getFrontWheels().forEach(wheel => {
                    wheel.engineForce += 1;
                });
            }

            if(keyCodeDown['KeyS']) {
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce(0);
                })
                getFrontWheels().forEach(wheel => {
                    wheel.engineForce -= 1;
                    console.log('wheel.engineForce', wheel.engineForce)
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
                steerFrontWheels(moveSteeringDegree)
                const [leftWheel, rightWheel] = getFrontWheels();
                frontLeftWheel.rotation = leftWheel.steerValue;
                frontRightWheel.rotation = rightWheel.steerValue;
            }

            if(keyCodeDown['KeyA']) {
                steerFrontWheels(-moveSteeringDegree)
                const [leftWheel, rightWheel] = getFrontWheels();
                frontLeftWheel.rotation = leftWheel.steerValue;
                frontRightWheel.rotation = rightWheel.steerValue;
            }

            if(keyCodeDown['Space']) {
                const isABSReady = Date.now() % 2 === 0;
                getWheels().forEach(wheel => {
                    wheel.setBrakeForce(isABSReady ? brakingForce : 0);
                });
                brakingForce += 1;

                if(body.velocity.find(velocity => Math.round(velocity) === 0)) {
                    getFrontWheels().forEach(wheel => wheel.engineForce = 0);
                }
                if(isABSReady) {
                    getFrontWheels().forEach(wheel => {
                        if(wheel.engineForce > 0)
                            wheel.engineForce -= 1;
                        if(wheel.engineForce < 0)
                            wheel.engineForce += 1;
                    });
                }
            } else {
                brakingForce = 200;
            }

            const steerDegree = getSteerDegree();
            if(powerSteeringDegree > 0 && getFrontWheels().find(wheel => Math.round(wheel.engineForce)) && !keyCodeDown['KeyD'] && !keyCodeDown['KeyA'] && steerDegree !== 0) {
                steerFrontWheels(steerDegree > 0 ? -powerSteeringDegree : powerSteeringDegree)
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
                const container = stage.getChildByName(`body::${body.id}`);
                container.position.set(body.position[0], body.position[1])
                container.rotation = body.angle;
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
        // carContainer.visible = false

        stage.addChild(carContainer)

        const getAnimation = (azimuth: number): number => {
            const correctedAzimuth = (Math.round(azimuth / 5) * 5) + 5;
            if(correctedAzimuth === 0) return 360;
            return correctedAzimuth >= 365 ? 5 : correctedAzimuth;
        }

        const setCarAzimuth = (azimuth: number) => {
            const animation = getAnimation(azimuth);
            animatedSpriteBody.textures = carBodySprite.animations[animation]
            animatedSpriteTires.textures = carTiresSprite.animations[animation]
        }


        Canvas.getApp().ticker.add((delta) => {

            const a = Utils.position.getPositionFromIsometricPosition({ x: body.position[0], y: 0, z: body.position[1] });
            carContainer.position.set(a.x, a.y)

            let b = (body.angle * (180 / Math.PI)) - 90;
            while(0 > b) b += 360;
            while(b > 360) b -= 360;

            setCarAzimuth(b)

            const wheelPosition = Math.floor(((getSteerDegree() + maxSteerDegree) / (maxSteerDegree * 2)) * 15);
            animatedSpriteTires.gotoAndStop(wheelPosition);
        });
    }
    
    return {
        start
    }
})();