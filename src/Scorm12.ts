import { CMIBool, CMIElement, CMIErrorCode, CMIList } from "./CMITypes";
import { ScormVersions, UnifiedScormSignature } from "./UnifiedScorm";

export interface Scorm12Signature {
    LMSInitialize      : ( empty: "" ) => CMIBool,
    LMSFinish          : ( empty: "" ) => CMIBool,
    LMSGetValue        : ( element: CMIElement ) => string | CMIList,
    LMSSetValue        : ( element: CMIElement, value: string ) => string,
    LMSCommit	       : ( empty: "" ) => CMIBool,
    LMSGetLastError    : ( empty: "" ) => CMIErrorCode,
    LMSGetErrorString  : ( errorCode: CMIErrorCode ) => string,
    LMSGetDiagnostic   : ( errorCode: CMIErrorCode ) => string
}

export class Scorm12Wrapper implements Scorm12Signature {

    constructor ( readonly engine: UnifiedScormSignature ) {};

    LMSInitialize ( empty: "" ) : CMIBool {
        this.engine.version = ScormVersions.v12;
        return this.engine.initialize( empty );
    }

    LMSFinish ( empty: "" ) : CMIBool {
        return this.engine.terminate( empty );
    }

    LMSGetValue ( element: CMIElement ) : string | CMIList {
        return this.engine.getValue( element );
    }

    LMSSetValue ( element: CMIElement, value: string ) : string {
        return this.engine.setValue( element, value );
    }

    LMSCommit ( empty: "" ) : CMIBool {
        return this.engine.commit ( empty );
    }

    LMSGetDiagnostic ( errorCode: CMIErrorCode ) : string {
        return this.engine.getDiagnostic( errorCode );
    }

    LMSGetErrorString ( errorCode: CMIErrorCode ) : string {
        return this.engine.getErrorString( errorCode );
    }

    LMSGetLastError (empty: "") : CMIErrorCode {
        return this.engine.getLastError( empty );
    }
}
