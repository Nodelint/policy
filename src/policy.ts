// Import Node.js Dependencies
import { pathToFileURL } from "url";
import fs from "fs/promises";
import path from "path";

// Import third-party dependencies
import oop from "@slimio/oop";
import rosetta, { Rosetta } from "rosetta";

// Import internal dependencies
import { Mode, DataEventSymbol } from "./constants.js";
import { EventMessage } from "./event.js";

// CONSTANTS
const kModeSymSet = new Set(Object.values(Mode));
const kDefaultOptions = { mode: Mode.Asynchronous, defaultLang: "english" };

export type PolicyEventMessage = symbol | EventMessage;

export interface PolicyOptions<T> {
  /** Name of the policy */
  name: string;
  /**
   * Iteration mode (either Synchronous or Asynchronous). Will influence how the core will execute the policy.
   *
   * @default Asynchronous
   */
  mode?: symbol;
  /**
   * Default language to pick for i18n. Languages must be available under the policy /i18n/ directory and loaded with static loadi18n() method.
   *
   * @default english
   */
  defaultLang?: string;
  /**
   * Scope of execution for the policy. This is a list of files, for example ".eslintrc", ".eslintignore" etc..
   */
  scope: Iterable<string>;
  i18n: Rosetta<T>;
  /**
   * Main executor for the policy (a Synchronous or Asynchronous generator).
   */
  main: Generator<PolicyEventMessage> | AsyncGenerator<PolicyEventMessage>;
  /**
   * List of events attached to the policy.
   */
  events: Record<string, Event>;
}

export type i18nEntry = Record<string, any>;

export default class Policy<T> {
  public name: string;
  public mode: symbol;
  public defaultLang: string | null;
  public scope: Set<string>;
  public events: Map<string, Event>;
  public main: IterableIterator<PolicyEventMessage> | AsyncIterableIterator<PolicyEventMessage>;
  public i18n: Rosetta<T>;

  constructor(options: PolicyOptions<T>) {
    const finalOptions = Object.assign({}, kDefaultOptions, options);
    if (!kModeSymSet.has(finalOptions.mode)) {
      throw new TypeError("options.mode must be a valid Policy mode (either Asynchronous or Synchronous).");
    }

    this.name = oop.toString(finalOptions.name, { allowEmptyString: false });
    this.mode = finalOptions.mode;
    this.defaultLang = oop.toNullableString(finalOptions.defaultLang);
    this.scope = new Set(oop.toIterable(finalOptions.scope));
    this.events = new Map(Object.entries(finalOptions.events));
    this.main = finalOptions.main;

    this.i18n = finalOptions.i18n;
    this.i18n.locale(this.defaultLang);
  }

  static async loadi18n<T>(i18nDir: string): Promise<Rosetta<T>> {
    const filesInDir = (await fs.readdir(i18nDir, { withFileTypes: true }))
      .filter((dirent) => dirent.isFile() && path.extname(dirent.name) === ".js");

    const dictArr: i18nEntry[] = [];
    for (const dirent of filesInDir) {
      const i18nLang = await import(
        pathToFileURL(path.join(i18nDir, dirent.name)).toString()
      );

      dictArr.push({ ...i18nLang });
    }

    // @ts-ignore
    return rosetta(Object.assign(...dictArr));
  }

  static createMessage(id: symbol, data: any): EventMessage {
    if (typeof id !== "symbol") {
      throw new TypeError("id must be a valid Event symbol!");
    }

    const payload = { id, data };
    Object.defineProperty(payload, DataEventSymbol, { value: true, enumerable: false });

    return payload;
  }
}
