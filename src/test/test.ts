import {Canvas} from "canvas/canvas";
import {World} from "world/world";
import * as P2 from "p2";
import {Car} from "test/car";

export const Test = (() => {
    
    const start = () => {
        
        const { stage } = Canvas.getApp();
        const world = World.getWorld();
    
        Car(world, stage);
    
        
    
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