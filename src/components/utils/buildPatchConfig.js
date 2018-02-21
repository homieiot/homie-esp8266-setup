import { KEEP } from '../../constants'

// if has current config:
// if in new = KEEP -> remove prop
// if in current but not in new -> add prop as null to remove it from config
// if in new but not in currnt -> add new prop to be set in the config
// if in both -> overite config value eg ^
const buildPatchConfig = (currentObj = {}, newObj = {}) => {
    let keys = [...new Set(Object.keys(currentObj).concat(Object.keys(newObj)))];
    let obj = {};
    for (let key of keys) {
        if (typeof currentObj[key] === "object" || typeof newObj[key] === "object") {
            const result = buildPatchConfig(currentObj[key], newObj[key]);
            if (result) obj[key] = result;
        }
        else if (newObj[key] === KEEP) continue;
        else if (currentObj[key] !== undefined && newObj[key] === undefined) obj[key] = null;
        else if (currentObj[key] === undefined && newObj[key] !== undefined) obj[key] = newObj[key];
        else if (currentObj[key] !== undefined && newObj[key] !== undefined && currentObj[key] != newObj[key]) obj[key] = newObj[key];
    }
    return Object.keys(obj).length != 0 ? obj : undefined;
};

export default buildPatchConfig;
