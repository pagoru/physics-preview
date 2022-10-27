import {idUtils} from "utils/id.utils";
import {colorUtils} from "utils/color.utils";

export const Utils = (() => {

    return {
        id: idUtils(),
        color: colorUtils()
    }
})();