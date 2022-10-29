import * as P2 from "p2";
import {Utils} from "utils/utils";
import * as PIXI from "pixi.mjs";

export const AchermanSteer = (stage, world) => {
    
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
            mass: 1,
        });
        body.id = Utils.id.getUID();
        body.allowSleep = false;
        body.sleepSpeedLimit = 1;
        body.sleepTimeLimit = 1;
        
        const graphics = new PIXI.Graphics();
        graphics.name = `body::${body.id}`
        graphics.beginFill(Utils.color.getRandomColor());
        graphics.drawPolygon([-2, -5, 2, -5, 2, 5, -2, 5]);
        graphics.endFill();
        
        stage.addChild(graphics);
        
        world.addBody(body);
        return body;
    }
    
    const wheel1 = newBody();
    wheel1.position = [-10, 20]
    
    const wheel2 = newBody();
    wheel2.position = [10, 20];
    
    const wheel3 = newBody();
    wheel3.position = [-10, -20]
    
    const wheel4 = newBody();
    wheel4.position = [10, -20];
    
    
    const degree = 45;
    
    const achernamRadians = getRadiansFromDegree(getAchermanDegree(
        degree,
        wheel1.position,
        wheel2.position,
        wheel3.position,
        wheel4.position
    ));
    const radians = getRadiansFromDegree(degree);
    
    wheel1.angle = degree > 0 ? radians : achernamRadians
    wheel2.angle = degree > 0 ? achernamRadians : radians;
}