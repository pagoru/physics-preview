import * as P2 from "p2";
import {Canvas} from "canvas/canvas";

export const World = (() => {
    
    let world: P2.World;
    
    const load = () => {
        world = new P2.World();
        world.gravity = [0, 0];
        world.sleepMode = P2.World.BODY_SLEEPING;
    
        Canvas.getApp().ticker.add((delta) => {
            world?.step(1 / 60, delta, 10);
        });
    }
    
    const getWorld = (): P2.World => world;
    
    return {
        load,
        getWorld,
    }
})();