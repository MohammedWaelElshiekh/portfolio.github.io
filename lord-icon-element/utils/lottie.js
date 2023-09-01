import { parseColor } from './colors.js';
import { set } from './helpers.js';
/**
 * Convert to hexadecimal value.
 * @param c
 * @returns
 */
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}
/**
 * Convert from color object to hex value.
 * @param value
 * @returns
 */
function rgbToHex(value) {
    return ('#' +
        componentToHex(value.r) +
        componentToHex(value.g) +
        componentToHex(value.b));
}
/**
 * Conver from hex to color object.
 * @param hex
 * @returns
 */
function hexToRgb(hex) {
    let data = parseInt(hex[0] != '#' ? hex : hex.substring(1), 16);
    return {
        r: (data >> 16) & 255,
        g: (data >> 8) & 255,
        b: data & 255,
    };
}
/**
 * Helper method for scale value.
 * @param n
 * @returns
 */
function toUnitVector(n) {
    return Math.round((n / 255) * 1000) / 1000;
}
/**
 * Helper method for scale value.
 * @param n
 * @returns
 */
function fromUnitVector(n) {
    return Math.round(n * 255);
}
/**
 * Convert hex color to lottie representation.
 * @param hex
 * @returns
 */
export function hexToLottieColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    return [toUnitVector(r), toUnitVector(g), toUnitVector(b)];
}
/**
 * Conver lottie color representation to hex.
 * @param value
 * @returns
 */
export function lottieColorToHex(value) {
    const color = {
        r: fromUnitVector(value[0]),
        g: fromUnitVector(value[1]),
        b: fromUnitVector(value[2]),
    };
    return rgbToHex(color);
}
/**
 * Return all supported customizable properties.
 * @param data Icon data.
 * @param options Options.
 * @returns
 */
export function properties(data, options = {}) {
    const result = [];
    const { lottieInstance } = options;
    if (!data || !data.layers) {
        return result;
    }
    data.layers.forEach((layer, layerIndex) => {
        if (!layer.nm || !layer.ef || !layer.nm.toLowerCase().includes('change')) {
            return;
        }
        layer.ef.forEach((field, fieldIndex) => {
            const value = field?.ef?.[0]?.v?.k;
            if (value === undefined) {
                return;
            }
            let path;
            if (lottieInstance) {
                path = `renderer.elements.${layerIndex}.effectsManager.effectElements.${fieldIndex}.effectElements.0.p.v`;
            }
            else {
                path = `layers.${layerIndex}.ef.${fieldIndex}.ef.0.v.k`;
            }
            let type;
            if (field.mn === 'ADBE Color Control') {
                type = 'color';
            }
            else if (field.mn === 'ADBE Slider Control') {
                type = 'slider';
            }
            else if (field.mn === 'ADBE Point Control') {
                type = 'point';
            }
            else if (field.mn === 'ADBE Checkbox Control') {
                type = 'checkbox';
            }
            if (!type) {
                return;
            }
            const name = field.nm.toLowerCase();
            result.push({
                name,
                path,
                value,
                type,
            });
        });
    });
    return result;
}
/**
 * Reset data by indicated properties.
 * @param data
 * @param properties
 */
export function resetProperties(data, properties) {
    for (const property of properties) {
        set(data, property.path, property.value);
    }
}
/**
 * Update data to value by indicated properties.
 * @param data
 * @param properties
 * @param value
 * @param param3
 */
export function updateProperties(data, properties, value, { scale } = {}) {
    for (const property of properties) {
        if (property.type === 'color') {
            if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
                set(data, property.path, [toUnitVector(value.r), toUnitVector(value.g), toUnitVector(value.b)]);
            }
            else if (Array.isArray(value)) {
                set(data, property.path, value);
            }
            else if (typeof value === 'string') {
                set(data, property.path, hexToLottieColor(parseColor(value)));
            }
        }
        else if (property.type === 'point') {
            let ratio = 1;
            if (scale) {
                ratio = ((property.value[0] + property.value[1]) / 2) / scale;
            }
            if (typeof value === 'object' && 'x' in value && 'y' in value) {
                set(data, property.path + '.0', value.x * ratio);
                set(data, property.path + '.1', value.y * ratio);
            }
            else if (Array.isArray(value)) {
                set(data, property.path + '.0', value[0] * ratio);
                set(data, property.path + '.1', value[1] * ratio);
            }
        }
        else {
            let ratio = 1;
            if (scale) {
                ratio = property.value / scale;
            }
            set(data, property.path, value * ratio);
        }
    }
}
//# sourceMappingURL=lottie.js.map