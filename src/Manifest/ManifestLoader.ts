import "promise/polyfill"
import "whatwg-fetch"
import { Manifest } from "./Manifest";
import { Resource } from "./Resource";

export type ManifestParser = ( content: string ) => Manifest;

export class ManifestLoader {

    constructor( readonly parser: ManifestParser = DefaultManifestParser ) {
    }

    async load( url: string ): Promise<Manifest> {
        let response = await fetch( url );
        let content = await response.text();
        return this.parser( content );
    }
}

export function DefaultManifestParser( content: string ): Manifest {
    let document = new DOMParser().parseFromString( content, "application/xml" );
    document.querySelector("resources" )
    return new Manifest( new Resource( "index_lms.html" ) );
}