import {Canvas} from "canvas/canvas";
import * as P2 from "p2";
import {World} from "world/world";
import {Utils} from "utils/utils";
import * as PIXI from "pixi.mjs";
import {Bike} from "test/bike";

export const Test = (() => {

    const start = () => {
        
        const { stage } = Canvas.getApp();
        const world = World.getWorld();
    
        const newBody = (vertices: number[][], position: [number, number] = [0, 0], mass = 10) => {
            const body = new P2.Body({
                mass,
                damping: 0.95,
                angularDamping: 0.95,
                position: position,
            });
            body.id = Utils.id.getUID();
            body.allowSleep = false;
            body.sleepSpeedLimit = 1;
            body.sleepTimeLimit = 1;
        
            const shape = new P2.Convex({ vertices })
            shape.id = Utils.id.getUID();
            shape.material = new P2.Material();
        
            const graphics = new PIXI.Graphics();
            graphics.name = `body::${body.id}`
            graphics.beginFill(Utils.color.getRandomColor());
            graphics.drawPolygon(vertices.flat(1));
            graphics.endFill();
        
            stage.addChild(graphics);
        
            body.addShape(shape, [0, 0]);
            world.addBody(body);
            return body;
        }
    
        const wheelVertices = [[-15, -5], [15, -5], [15, 5], [-15, 5]];
        const wheel1 = newBody(wheelVertices, [-60, 30], 20);
        const wheel2 = newBody(wheelVertices, [-60, -30], 20);
        
        const wheel3 = newBody(wheelVertices, [60, 30], 20);
        const wheel4 = newBody(wheelVertices, [60, -30], 20);
        
        const carVertices = [
            [-40, -35],
            [40, -35],
            
            [40, -25],
            [80, -25],
            [80, 25],
            [40, 25],
            
            [40, 35],
            [-40, 35],
            
            [-40, 25],
            [-80, 25],
            [-80, -25],
            [-40, -25],
        ]
        const body = newBody(carVertices, [0, 0], 200);
    
        const wheel1Spring = new P2.LinearSpring(wheel1, body, { damping: 1, restLength: 1, localAnchorB: [-55, 30] });
        world.addSpring(wheel1Spring);
        
        const wheel2Spring = new P2.LinearSpring(wheel2, body, { damping: 1, restLength: 1, localAnchorB: [-55, -30] });
        world.addSpring(wheel2Spring);
        
        const wheel3Spring = new P2.LinearSpring(wheel3, body, { damping: 1, restLength: 1, localAnchorB: [55, 30] });
        world.addSpring(wheel3Spring);
    
        const wheel4Spring = new P2.LinearSpring(wheel4, body, { damping: 1, restLength: 1, localAnchorB: [55, -30] });
        world.addSpring(wheel4Spring);
        
        const bike = Bike();
        
        world.on('postStep', event => {
            const awakeBodies = world.bodies.filter(
                body =>
                    body.type !== P2.Body.STATIC && body.sleepState !== P2.Body.SLEEPING
            );
            if(awakeBodies.length === 0) return;
    
            awakeBodies.forEach((body) => {
    
                const graphics = stage.getChildByName(`body::${body.id}`);
                graphics.position.set(body.position[0], body.position[1])
                graphics.rotation = body.angle;
                
            });
    
            bike.postStep()
            
            const force = 20;
    
            wheel1.applyImpulse([-force * Math.cos(wheel1.angle), -force * Math.sin(wheel1.angle)])
            wheel1.angularVelocity = .02;
    
            wheel2.applyImpulse([-force * Math.cos(wheel2.angle), -force * Math.sin(wheel2.angle)])
            wheel2.angularVelocity = .02;
            
            wheel3.angle = body.angle;
            wheel4.angle = body.angle;
        });
    }
    
    return {
        start
    }
})();