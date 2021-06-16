import { Rosetta } from "rosetta";

export declare const EventSymbol: unique symbol;
export declare const DataEventSymbol: unique symbol;
export declare const Events: Readonly<{
    Log: symbol;
    Information: symbol;
    Warning: symbol;
    Error: symbol;
}>;
export declare const Mode: Readonly<{
    Asynchronous: symbol;
    Synchronous: symbol;
}>;

export class Event {
  #private;
  name: string;
  id: symbol;
  enabled: boolean;
  type: Symbol;
  i18n: string;
  parametersJSONSchema: object;
  static sanitizeName(name: string): string;
  constructor(options?: object);
  set resolution(options?: object);
  get resolution(): any;
}

export default class Policy {
  name: string;
  mode: Symbol;
  defaultLang: string;
  scope: Set<string>;
  eventsMap: Map<string, Event>;
  events: Event[];
  i18n: Rosetta<T>;
  main: any;
  static loadi18n<T>(i18nDir: string): Promise<Rosetta<T>>;
  static dataEvent(id: symbol, data: any): {
      id: symbol;
      data: any;
  };
  constructor(options?: object);
}
