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

export interface EventData {
    id: symbol;
    data: any;
}

export interface EventOptions {
    name: string;
    i18n: string;
    type: symbol;
    enabled?: boolean;
    mode?: symbol;
    parameters?: object;
}

export interface ResolutionOptions {
    description: string;
    assertion?: () => boolean | (() => Promise<boolean>);
    main: any;
}

export class Event {
    #private;
    name: string;
    id: symbol;
    enabled: boolean;
    type: symbol;
    i18n: string;
    parametersJSONSchema: object;
    static sanitizeName(name: string): string;
    constructor(options?: EventOptions);
    set resolution(options: ResolutionOptions);
    get resolution(): any;
}

export interface PolicyOptions<T> {
    name: string;
    mode?: symbol;
    defaultLang?: string;
    scope: Iterable<string>;
    i18n: Rosetta<T>;
    main: IterableIterator<PolicyEvent> | AsyncIterableIterator<PolicyEvent>;
}

export type PolicyEvent = symbol | EventData;

export default class Policy<T>{
    name: string;
    mode: symbol;
    defaultLang: string;
    scope: Set<string>;
    eventsMap: Map<string, Event>;
    events: Event[];
    i18n: Rosetta<T>;
    main: IterableIterator<PolicyEvent> | AsyncIterableIterator<PolicyEvent>;
    static loadi18n<T>(i18nDir: string): Promise<Rosetta<T>>;
    static dataEvent(id: symbol, data: any): EventData;
    constructor(options?: PolicyOptions<T>);
}
