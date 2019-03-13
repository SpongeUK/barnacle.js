import { IStore, KeyValuePair } from "./IStore";
import { Dictionary } from "../Dictionary";

export class ObjectStore implements IStore<string> {

    constructor( readonly store: Dictionary = {} ) {}

    get( key: string ): string {
        return this.store[key];
    }

    has( key: string ): boolean {
        return this.store.hasOwnProperty(key);
    }

    set( key: string, value: string ): string {
        this.store[key] = value;
        return value;
    }

    filter( predicate: ( key: string ) => boolean ): Array<KeyValuePair<string>> {

        let keys = Object.keys( this.store );

        return keys.map( key => new KeyValuePair( key, this.store[key] ) );
    }




}