import { CMIBool, CMIElement, CMIErrorCode, CMIList } from "./CMITypes";
import { CommitHandler, IHandleCommits } from "./IHandleCommits";
import { IStore } from "./Storage/IStore";
import { ObjectStore } from "./Storage/ObjectStore";
import { Dictionary } from "./Dictionary";
import { List } from "./List";

export interface UnifiedScormSignature extends IHandleCommits {
    version            : ScormVersions,

    initialize         : ( empty: "" ) => CMIBool,
    terminate          : ( empty: "" ) => CMIBool,
    getValue           : ( element: CMIElement ) => string | CMIList,
    setValue           : ( element: CMIElement, value: string ) => string,
    commit   	       : ( empty: "" ) => CMIBool,
    getLastError       : ( empty: "" ) => CMIErrorCode,
    getErrorString     : ( errorCode: CMIErrorCode ) => string,
    getDiagnostic      : ( errorCode: CMIErrorCode ) => string
}

export enum ScormVersions {
    v12,
    v2004
}

export class UnifiedScorm implements UnifiedScormSignature {

    constructor () {
        this.onCommit = () => {};
        this.store = new ObjectStore();
        this.lastError = "0";
    }

    private _version: ScormVersions = ScormVersions.v12;
    private canCommit: boolean = true;
    private lastError: CMIErrorCode;
    private store: IStore<string>;

    private ok ( value: any ) : CMIBool {
        this.lastError = "0";
        return "true";
    }

    private getFromStore ( key: string ) : any {
        if( key === "cmi.interactions._count" ) {
            let list = new List( "cmi.interactions", this.store );
            return list.count.toString();
        }
        if( key === "cmi.interactions._children" ) {
            let list = new List( "cmi.interactions", this.store );
            return list.children;
        }

        return this.store.get( key );
    }

    private setInStore ( key: string, value: string ) : string {

        return this.store.set( key, value )
                        ? "true"
                        : "";
    }

    public onCommit : CommitHandler;

    get version () {
        return this._version || ScormVersions.v12;
    }

    set version (value: ScormVersions) {
        this._version = value;
    }

    getValue ( element: CMIElement ) : string | CMIList {
        return this.getFromStore( element ) || "";
    };

    setValue (element: CMIElement, value: string) : string {
        this.canCommit = true;
        return this.ok( this.setInStore( element, value ) );
    };

    commit ( empty: "" ) : CMIBool {
        if( !this.canCommit ) return "false";

        this.onCommit( this.store );
        this.canCommit = false;
        return this.ok( true );
    };

    getDiagnostic ( errorCode: CMIErrorCode ) : string {
        let diagnostics: Dictionary = {
            "0" : "No Error",
            "101" : "General Exception",
            "102" : "General Initialization Failure",
            "103" : "Already Initialized",
            "104" : "Content Instance Terminated",
            "111" : "General Termination Failure",
            "112" : "Termination Before Initialization",
            "113" : "Termination After Termination",
            "123" : "Retrieve Data Before Initialization",
            "132" : "Store Data Before Initialization",
            "133" : "Store Data After Termination",
            "142" : "Commit Before Initialization",
            "201" : "General Argument Error",
            "301" : "General Get Failure",
            "351" : "General Set Failure",
            "391" : "General Commit Failure",
            "401" : "Undefined Data Model Element",
            "402" : "Unimplemented Data Model Element",
            "403" : "Data Model Element Value Not Initialized",
            "404" : "Data Model Element Is Read Only ",
            "405" : "Data Model Element Is Write Only",
            "406" : "Data Model Element Type Mismatch",
            "407" : "Data Model Element Value Out Of Range",
            "408" : "Data Model Dependency Not Established"
        };

        return diagnostics[ errorCode ] || "";
    };

    getErrorString ( errorCode: CMIErrorCode ) : string {
        return errorCode;
    }

    getLastError ( empty: "" ) : CMIErrorCode {
        return this.lastError;
    };

    initialize (empty: "") : CMIBool {
        this.store = new ObjectStore();

        return this.ok( true );
    };

    terminate (empty: "") : CMIBool {
        return this.ok( true );
    };
}