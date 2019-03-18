import { IStore, KeyValuePair } from "./IStore";

export class List<T> implements IStore<T> {

    constructor( readonly name: string, readonly store: IStore<T>, readonly requiredItemPropertyName = "id" ) {
    }

    get( key: string ): T {
        return this.store.get( key );
    }

    has( key: string ): boolean {
        return this.store.has( key );
    }

    set( key: string, value: T ): T {
        return this.store.set( key, value );
    }

    get count(): number {

        let index = 0;

        while ( this.store.has( `${this.name}.${index}.${this.requiredItemPropertyName}` ) ) {
            index++;
        }
        return index;
    }

    get children(): Array<any> {

        const EmptyResult = [ undefined, undefined, undefined ];
        const listItemPattern = /(\d*)\.(\w*)$/;

        let objectBuilder = (aggregation: Array<any>,  current: KeyValuePair<T>) : Array<any> => {

            let [ isMatch, idx, property ] = listItemPattern.exec(current.key) || EmptyResult;

            if( isMatch === undefined || idx === undefined || property === undefined ) return aggregation;

            let index = parseInt(idx, 10);

            if( !aggregation[ index ] ) aggregation[ index ] = {};

            let obj = aggregation[index];

            obj[property] = current.value;

            return aggregation;
        };

        return this.store.filter( key =>  key.indexOf( this.name ) === 0 )
                         .reduce( objectBuilder, [] )
                         .filter( item => item !== undefined );

    }

    filter ( predicate: ( key: string ) => boolean ): Array<KeyValuePair<T>> {
        return this.store.filter( predicate );
    }

    contents(): {} {
        return this.store;
    }

}