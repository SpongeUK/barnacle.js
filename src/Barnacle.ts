import { Scorm12Signature, Scorm12Wrapper } from "./Scorm12";
import { Scorm2004Signature, Scorm2004Wrapper } from "./Scorm2004";
import { UnifiedScorm, UnifiedScormSignature } from "./UnifiedScorm";
import { BarnacleOptions } from "./barnacleOptions";

interface Scorm12 {
    API: Scorm12Signature | undefined
}

interface Scorm2004 {
    API_1484_11: Scorm2004Signature | undefined
}

type ScormFactory = (options: BarnacleOptions) => UnifiedScormSignature;

export class Barnacle implements Scorm12, Scorm2004 {

    constructor( readonly options: BarnacleOptions = BarnacleOptions.Empty,
                 scorm12Factory: ScormFactory = Barnacle.defaultImplementationFactory,
                 scorm2004Factory: ScormFactory = Barnacle.defaultImplementationFactory ) {

        let scorm12Implementation = scorm12Factory( options );
        this.API = new Scorm12Wrapper( scorm12Implementation );

        let scorm2004Implementation  = scorm2004Factory( options );
        this.API_1484_11 = new Scorm2004Wrapper( scorm2004Implementation );
    }

    API: Scorm12Signature;
    API_1484_11: Scorm2004Signature;

    attach( win: any ) {
        if ( !win ) return;
        win.API = this.API;
        win.API_1484_11 = this.API_1484_11;
    }

    static defaultImplementationFactory( options: BarnacleOptions = BarnacleOptions.Empty ) : UnifiedScormSignature {
        let implementation = new UnifiedScorm();
        implementation.onCommit = options.onCommit;
        return implementation;
    }

}