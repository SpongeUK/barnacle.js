import { Scorm12Signature, Scorm12Wrapper } from "./Scorm12";
import { Scorm2004Signature, Scorm2004Wrapper } from "./Scorm2004";
import { UnifiedScorm, UnifiedScormSignature } from "./UnifiedScorm";
import { BarnacleOptions } from "./BarnacleOptions";
import { ScormVersions } from "./ScormVersions";
import { Dictionary } from "./Dictionary";
import { DictionaryBulkOperation } from "./DictionaryBulkOperation";
import { ScormLauncher } from "./ScormLauncher";
import { IOpener } from "./Opener/IOpener";
import { WindowOpener } from "./Opener/WindowOpener";

interface Scorm12 {
    API: Scorm12Signature | undefined
}

interface Scorm2004 {
    API_1484_11: Scorm2004Signature | undefined
}

type ScormFactory = ( options: BarnacleOptions ) => UnifiedScormSignature;

export class ScormDriver implements Scorm12, Scorm2004 {

    constructor( readonly options: BarnacleOptions = BarnacleOptions.Empty,
                 scorm12Factory: ScormFactory = ScormDriver.defaultImplementationFactory,
                 scorm2004Factory: ScormFactory = ScormDriver.defaultImplementationFactory,
                 opener: IOpener ) {

        let scorm12Implementation = scorm12Factory( options );
        this.API = new Scorm12Wrapper( scorm12Implementation );

        let scorm2004Implementation = scorm2004Factory( options );
        this.API_1484_11 = new Scorm2004Wrapper( scorm2004Implementation );

        this.opener = opener || new WindowOpener();
    }

    API: Scorm12Signature;
    API_1484_11: Scorm2004Signature;

    private opener: IOpener;

    attach( win: any = window ) {
        if ( !win ) return;
        this.opener = new WindowOpener( win );
        win.API = this.API;
        win.API_1484_11 = this.API_1484_11;
    }

    launch ( url: string, name: string = "course", win: Window) {
        return ScormLauncher.launch( url, name, win || this.opener );
    }

    static launch( url: string, name: string = "course", win: Window = window ) {
        return ScormLauncher.launch( url, name, new WindowOpener( win ) );
    }

    load( state: Dictionary<any>, version: ScormVersions ) {
        let loadOperation = new DictionaryBulkOperation( state );

        if ( version === ScormVersions.v12 ) {
            loadOperation.performForAll( ( key: string, value: any ) => this.API.LMSSetValue( key, value ) );
        } else if ( version === ScormVersions.v2004 ) {
            loadOperation.performForAll( ( key: string, value: any ) => this.API_1484_11.SetValue( key, value ));
        } else {
            throw new Error("Unsupported version");
        }
    }

    static defaultImplementationFactory( options: BarnacleOptions = BarnacleOptions.Empty ): UnifiedScormSignature {
        let implementation = new UnifiedScorm();
        implementation.onCommit = options.onCommit;
        return implementation;
    }

}