import { Scorm12Signature, Scorm12Wrapper } from "./Scorm12";
import { Scorm2004Signature, Scorm2004Wrapper } from "./Scorm2004";
import { UnifiedScorm, UnifiedScormSignature } from "./UnifiedScorm";
import { BarnacleOptions } from "./BarnacleOptions";
import { ScormVersions } from "./ScormVersions";
import { StateLoader } from "./StateLoader";
import { Dictionary } from "./Dictionary";

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
                 scorm2004Factory: ScormFactory = ScormDriver.defaultImplementationFactory ) {

        let scorm12Implementation = scorm12Factory( options );
        this.API = new Scorm12Wrapper( scorm12Implementation );

        let scorm2004Implementation = scorm2004Factory( options );
        this.API_1484_11 = new Scorm2004Wrapper( scorm2004Implementation );
    }

    API: Scorm12Signature;
    API_1484_11: Scorm2004Signature;

    attach( win: any ) {
        if ( !win ) return;
        win.API = this.API;
        win.API_1484_11 = this.API_1484_11;
    }

    load( version: ScormVersions, state: Dictionary<any> ) {
        if ( version === ScormVersions.v12 ) {
            StateLoader.loadKeyValuePairs( ( key: string, value: any ) => this.API.LMSSetValue( key, value ), state );
        } else if ( version === ScormVersions.v2004 ) {
            StateLoader.loadKeyValuePairs( ( key: string, value: any ) => this.API_1484_11.SetValue( key, value ), state );
        }
    }

    static launch( url: string, name: string = "course", win = window ): any {
        let features = [
            'height=' + win.screen.height * 0.90,
            'width=' + win.screen.width * 0.99,
            'top=0',
            'left=0',
            'fullscreen=no',
            'menubar=no',
            'toolbar=no',
            'scrollbars=1'
        ].join( ',' );

        win.open( url, name, features );
    }

    static defaultImplementationFactory( options: BarnacleOptions = BarnacleOptions.Empty ): UnifiedScormSignature {
        let implementation = new UnifiedScorm();
        implementation.onCommit = options.onCommit;
        return implementation;
    }

}