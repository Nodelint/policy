// Import third-party dependencies
import oop from "@slimio/oop";
import rosetta from "rosetta";

// Import internal dependencies
import { Mode, DataEventSymbol } from "./Constants.js";

// CONSTANTS
const kModeSymSet = new Set(Object.values(Mode));
const kDefaultOptions = { mode: Mode.Asynchronous, defaultLang: "english" };

export default class Policy {
    static async loadi18n(dir) {
        const i18n = {};
        // TODO: load all i18n files (from dir) and combine them here!
        console.log(dir);

        return rosetta(i18n);
    }

    static dataEvent(id, data) {
        if (typeof id !== "symbol") {
            throw new TypeError("id must be a valid Event symbol!");
        }

        const payload = { id, data };
        Reflect.defineProperty(payload, DataEventSymbol, { value: true, enumerable: false });

        return payload;
    }

    constructor(options = Object.create(null)) {
        options = Object.assign({}, kDefaultOptions, options);
        if (!kModeSymSet.has(options.mode)) {
            throw new TypeError("options.mode must be a valid Policy mode (Asynchronous or Synchronous).");
        }

        this.mode = options.mode;
        this.defaultLang = oop.toString(options.defaultLang);
        this.scope = new Set(oop.toIterable(options.scope));

        const [i18n, events] = asserti18n(options.i18n, options.events);
        this.events = events;
        this.i18n = i18n;
    }
}

function asserti18n(i18n, rawEvents) {
    const events = [...oop.toIterable(rawEvents)];

    return [rosetta(i18n), events];
}

