import { Dictionary } from "./Dictionary";

export type KeyValueOperation = ( key: string, value: any ) => void;

export class DictionaryBulkOperation {
    constructor (readonly dictionary: Dictionary<any>) {
    }

    performForAll( operation: KeyValueOperation) {
        for ( let key in this.dictionary ) {
            if ( this.dictionary.hasOwnProperty( key ) ) {
                operation( key, this.dictionary[ key ] );
            }
        }
    }
}