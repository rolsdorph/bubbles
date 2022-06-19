import { randomInRange } from "./util.js";
import { RANDOM, FIXED, DYNAMIC } from './types.js';

const COLORS = ['red', 'green', 'blue', 'purple', 'yellow', 'orange'];

export function buildParsers(newConfig) {
    let parsers = {
        colorMapper: randomColor
    };

    if (newConfig.radiusType === RANDOM) {
        parsers.fieldExtractor = () => randomInRange(newConfig.minRadius, newConfig.maxRadius);
        parsers.radiusMapper = identity;
    } else if (newConfig.radiusType === FIXED) {
        parsers.fieldExtractor = () => newConfig.radius;
        parsers.radiusMapper = identity;
    } else if (newConfig.radiusType === DYNAMIC) {
        const fields = newConfig.jsonField.split('.');
        parsers.fieldExtractor = extractNumericOrDefault(
            nestedFieldExtractor(fields),
            newConfig.minRadius
        );
        parsers.radiusMapper = interpolate(newConfig.minValue, newConfig.maxValue, newConfig.minRadius, newConfig.maxRadius);
    } else {
        console.error(`Unknown radius strategy: ${newConfig.radiusType}`);
    }

    return parsers;
}

export const DEFAULT_PARSERS = {
    fieldExtractor: () => randomInRange(25, 100),
    radiusMapper: r => r,
    colorMapper: randomColor
};

const identity = x => x;

function randomColor() {
    return COLORS[randomInRange(0, COLORS.length - 1)];
}

function extractNumericOrDefault(extractor, defaultValue) {
    return data => {
        const extracted = extractor(data);
        if (typeof extracted == 'number') {
            return extracted;
        } else {
            return defaultValue;
        }
    }
}

function nestedFieldExtractor(fields) {
    return data => {
        let currentNode = data;
        for (let field of fields) {
            currentNode = currentNode[field];
            if (currentNode === undefined) {
                return undefined;
            }
        }
        return currentNode;
    };
}

function interpolate(dataRangeMin, dataRangeMax, valueRangeMin, valueRangeMax) {
    return dataValue => {
        if (dataValue <= dataRangeMin) {
            return valueRangeMin;
        }

        if (dataValue >= dataRangeMax) {
            return valueRangeMax;
        }

        // How many percent of the min-max range do we fill?
        const position = (dataValue - dataRangeMin) / (dataRangeMax - dataRangeMin);

        // Starting at the min radius, fill the same percentage of the value range
        return valueRangeMin + (position * (valueRangeMax - valueRangeMin));
    };
}
