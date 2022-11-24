import {SpriteSheetEnum} from "./sprite-sheets.enum";
import * as PIXI from "../pixi.mjs";
import {Utils} from "../utils/utils";

export const SpriteSheet = (() => {

    const spriteSheetMap: Record<SpriteSheetEnum, PIXI.Spritesheet> = {}

    const load = async () => {

        const list = Object.values(SpriteSheetEnum).map(async (spriteSheetValue) => {
            try {
                const texture = PIXI.Texture.from(spriteSheetValue + '.png');
                const jsonAsset = await (await fetch(spriteSheetValue + '.json')).json()
                texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

                const spriteSheet = new PIXI.Spritesheet(texture, jsonAsset);

                const processSpriteSheet = async () => {
                    const textureKeyList = Object.keys(spriteSheet.textures);
                    const targetTextureValueList = textureKeyList.map(textureName =>
                        Utils.texture.getClonedTexture(spriteSheet.textures[textureName])
                    );
                    const textureValueList = await Promise.all(targetTextureValueList);

                    spriteSheet.textures = textureKeyList.reduce(
                        (a, b, c) => ({
                            ...a,
                            [b]: textureValueList[c],
                        }),
                        {}
                    );

                    spriteSheetMap[spriteSheetValue] = spriteSheet;
                };

                await processSpriteSheet()
                await spriteSheet.parse();
            } catch (e) {
                console.error(e)
            }
        });

        await Promise.all(list)
    }

    const getSpriteSheet = (spriteSheet: SpriteSheetEnum): PIXI.Spritesheet => spriteSheetMap[spriteSheet];

    return {
        load,
        getSpriteSheet
    }
})();