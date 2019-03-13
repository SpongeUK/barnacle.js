export interface IStore<T> {
    get( key: string ): T;

    set( key: string, value: T ): T;

    has( key: string ): boolean;

    filter( predicate: (key: string) => boolean ) : Array<KeyValuePair<T>>;
}

export class KeyValuePair<T> {
    constructor( readonly key: string, readonly value: T ) {}
}