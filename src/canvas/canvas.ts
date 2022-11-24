import * as PIXI from 'pixi.mjs'
import {Test} from "test/test";
import {World} from "world/world";
import {SpriteSheet} from "../sprite-sheets/sprite-sheet";

export const Canvas = (() => {
    
    let app: PIXI.Application;
    const scale = 2;
    
    const load = async () => {
        
        const { width, height } = getBounds();
        app = new PIXI.Application({
            width,
            height,
            backgroundColor: 0x1e1e1e,
            antialias: true,
            autoDensity: true,
        });
        app.stage.sortableChildren = true;
        app.stage.interactive = true;
        
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
        
        window.addEventListener('resize', _onResize);
        _onResize();

        await SpriteSheet.load();

        World.load();
        document.body.appendChild(app.view);
    
        Test.start();
    }
    
    const getBounds = (): PIXI.ISize => {
        const { innerWidth, innerHeight } = window;
        
        return {
            width: (Math.round(innerWidth / scale)),
            height: (Math.round(innerHeight / scale)),
        };
    };
    
    const getApp = (): PIXI.Application => app;
    
    const _onResize = () => {
        const { devicePixelRatio } = window;
        const { width, height } = getBounds();

        app.renderer.resolution = scale * Math.round(devicePixelRatio);
        // app.renderer.events.resolution = scale * Math.round(devicePixelRatio);
        // Stage resolution adjustment
        app.renderer.plugins.interaction.resolution = app.renderer.resolution;
        // PIXI.settings.RENDER_OPTIONS.height = height;
        // PIXI.settings.RENDER_OPTIONS.width = width;
        // PIXI.settings.RESOLUTION = scale * Math.round(devicePixelRatio);
        // PIXI.settings.FILTER_RESOLUTION = scale * Math.round(devicePixelRatio);
        // PIXI.settings.RENDER_OPTIONS.width = Math.round(width * scale);
        // PIXI.settings.RENDER_OPTIONS.height = Math.round(height * scale);
        app.renderer.resize(width, height);
        
        app.view.style.width = `${Math.round(width * scale)}px`;
        app.view.style.height = `${Math.round(height * scale)}px`;
        
        app.stage.position.set(Math.round(width / 2), Math.round(height / 2));
    };
    
    return {
        load,
        getApp,
        getBounds
    }
})();