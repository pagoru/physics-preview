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

        testCar()
        // testCar()

        // const carContainer = new PIXI.Container();
        //
        // const carBodySprite = SpriteSheet.getSpriteSheet(SpriteSheetEnum.CAR_GOLF_GTI_MK1_BODY);
        // const carTiresSprite = SpriteSheet.getSpriteSheet(SpriteSheetEnum.CAR_GOLF_GTI_MK1_TIRES);
        //
        // const animation = '50';
        //
        // const animatedSpriteBody = new PIXI.AnimatedSprite(carBodySprite.animations[animation]);
        // const animatedSpriteTires = new PIXI.AnimatedSprite(carTiresSprite.animations[animation]);
        // // animatedSpriteTires.play()
        //
        // carContainer.addChild(animatedSpriteBody, animatedSpriteTires);
        // carContainer.pivot.set(196 / 2, 196 / 2)
        //
        // const { stage } = Canvas.getApp();
        // stage.addChild(carContainer)
        //
        //
        // let azimuth = 0;
        // const getAnimation = (): number => {
        //     const correctedAzimuth = Math.round(azimuth / 5) * 5 + 5;
        //     return correctedAzimuth === 365 ? 5 : correctedAzimuth;
        // }
        //
        // Canvas.getApp().ticker.add((delta) => {
        //
        //     azimuth += delta * 2;
        //     if(azimuth >= 360) azimuth = 0;
        //
        //     animatedSpriteBody.textures = carBodySprite.animations[getAnimation()]
        //     animatedSpriteTires.textures = carTiresSprite.animations[getAnimation()]
        // });
    }
    
    return {
        start
    }
})();