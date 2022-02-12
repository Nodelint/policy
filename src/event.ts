// Import third-party dependencies
import oop from "@slimio/oop";
import changeCase from "change-case";

// Import internal dependencies
import { Events, EventSymbol } from "./constants.js";

// CONSTANTS
const kEventSymSet = new Set(Object.values(Events));
const kDefaultOptions = { type: Events.Warning, parameters: {}, enabled: true };

export interface EventMessage {
  /** Unique id of the event */
  id: symbol;
  /** Any data attached to the message */
  data: any;
}

export interface ResolutionOptions {
  /** Description of the resolution */
  description: string | null;
  /** Assertion (verification) of the resolution */
  assertion?: () => boolean | (() => Promise<boolean>);
  /** Main executor to resolve the issue */
  main: any;
}
export type EventResolution = Readonly<ResolutionOptions> | null;

export interface EventOptions {
  name: string;
  /** Path to i18n key. For example `path.to.key` (like lodash.get or lodash.set) */
  i18n: string;
  /**
   * Events severity (Log, Information, Warning or Error).
   *
   * @default Warning
   */
  type?: symbol;
  /**
   * Enable the event
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * JSON Schema for event parameters. This will be used to validate the configuration within the core.
   */
  parameters?: object;
}

export default class Event {
  public name: string;
  public id: symbol;
  public enabled: boolean;
  public type: symbol;
  public i18n: string;
  public parametersJSONSchema: any;

  /** Note: when `null` it mean the event has not automatic resolution */
  #resolution: EventResolution = null;

  static sanitizeName(name: string): string {
    return changeCase.paramCase(oop.toString(name, { allowEmptyString: false }));
  }

  constructor(options: EventOptions) {
    const finalOptions = Object.assign({}, kDefaultOptions, options);
    if (!kEventSymSet.has(finalOptions.type)) {
      throw new TypeError("options.type must be a valid Event type!");
    }

    this.name = Event.sanitizeName(finalOptions.name);
    this.id = Symbol(this.name);
    this.enabled = finalOptions.enabled ?? true;
    this.type = finalOptions.type;
    this.i18n = oop.toString(finalOptions.i18n);
    this.parametersJSONSchema = oop.toPlainObject(options.parameters);

    Reflect.defineProperty(this, EventSymbol, { value: true, enumerable: false });
  }

  set resolution(options: ResolutionOptions) {
    // TODO: validate function entry
    const description = oop.toNullableString(options.description);
    const assertion = options.assertion ?? (() => true);
    const main = options.main;

    this.#resolution = Object.freeze({ description, assertion, main });
  }

  get resolutionDescription(): string | null {
    return this.#resolution?.description ?? null;
  }
}
