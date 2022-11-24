import {idUtils} from "utils/id.utils";
import {colorUtils} from "utils/color.utils";
import {textureUtils} from "./texture.utils";

export const Utils = (() => {

    return {
        id: idUtils(),
        color: colorUtils(),
        texture: textureUtils(),
    }
})();