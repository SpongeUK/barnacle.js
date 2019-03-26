import "promise/polyfill"
import "whatwg-fetch"
import { Manifest } from "./Manifest";
import { Resource } from "./Resource";

export type ManifestParser = ( content: string ) => Manifest;

export class ManifestLoader {

    constructor( readonly parser: ManifestParser = ManifestDOMParser ) {
    }

    async load( url: string ): Promise<Manifest> {
        let response = await fetch( url );
        let content = await response.text();
        return this.parser( content );
    }
}

export function ManifestDOMParser( content: string ): Manifest {
    const selector = 'resources resource[type="webcontent"]';
    const defaultPage = "/";

    let document = new DOMParser().parseFromString( content, "application/xml" );
    let resource = document.querySelector( selector );
    let startPage = resource ? resource.getAttribute( "href" ) || defaultPage : defaultPage;
    return new Manifest( new Resource( startPage ) );
}