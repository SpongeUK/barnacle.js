import { CMIBool, CMIElement, CMIErrorCode, CMIList } from "./CMITypes";
import { UnifiedScormSignature } from "./UnifiedScorm";
import { ScormVersions } from "./ScormVersions";

export interface Scorm2004Signature {
    Initialize         : ( empty: "" ) => CMIBool,
    Terminate          : ( empty: "" ) => CMIBool,
    GetValue           : ( element: CMIElement ) => string | CMIList,
    SetValue           : ( element: CMIElement, value: string ) => string,
    Commit   	       : ( empty: "" ) => CMIBool,
    GetLastError       : ( empty: "" ) => CMIErrorCode,
    GetErrorString     : ( errorCode: CMIErrorCode ) => string,
    GetDiagnostic      : ( errorCode: CMIErrorCode ) => string
}

export class Scorm2004Wrapper implements Scorm2004Signature {

    constructor(readonly engine: UnifiedScormSignature) {
    };

    Initialize(empty: ""): CMIBool {
        this.engine.version = ScormVersions.v2004;
        return this.engine.initialize(empty);
    }

    Terminate(empty: ""): CMIBool {
        return this.engine.terminate(empty);
    }

    GetValue(element: CMIElement): string | CMIList {
        return this.engine.getValue(element);
    }

    SetValue(element: CMIElement, value: string): string {
        return this.engine.setValue(element, value);
    }

    Commit(empty: ""): CMIBool {
        return this.engine.commit(empty);
    }

    GetDiagnostic(errorCode: CMIErrorCode): string {
        return this.engine.getDiagnostic(errorCode);
    }

    GetErrorString(errorCode: CMIErrorCode): string {
        return this.engine.getErrorString(errorCode);
    }

    GetLastError(empty: ""): CMIErrorCode {
        return this.engine.getLastError(empty);
    }
}