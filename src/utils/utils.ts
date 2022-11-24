import {idUtils} from "utils/id.utils";
import {colorUtils} from "utils/color.utils";
import {textureUtils} from "./texture.utils";
import {positionUtils} from "./position.utils";

export const Utils = (() => {

    return {
        position: positionUtils(),
        id: idUtils(),
        color: colorUtils(),
        texture: textureUtils(),
    }
})();