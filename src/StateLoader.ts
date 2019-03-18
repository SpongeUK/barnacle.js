import { Dictionary } from "./Dictionary";

export type KeyValueSetter = ( key: string, value: any ) => void;

export class StateLoader {

    static loadKeyValuePairs( setter: KeyValueSetter, state: Dictionary<any> ) {
        for ( let key in state ) {
            if ( state.hasOwnProperty( key ) ) {
                setter( key, state[ key ] );
            }
        }
    }
}