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
  enabled: any;
  type: any;
  i18n: string;
  parametersJSONSchema: object;
  static sanitizeName(name: any): string;
  constructor(options?: any);
  set resolution(options?: any);
  get resolution(): any;
}

export default class Policy {
  name: string;
  mode: any;
  defaultLang: string;
  scope: Set<any>;
  eventsMap: Map<any, any>;
  events: any[];
  i18n: any;
  main: any;
  static loadi18n(i18nDir: any): Promise<any>;
  static dataEvent(id: any, data: any): {
      id: symbol;
      data: any;
  };
  constructor(options?: any);
}
