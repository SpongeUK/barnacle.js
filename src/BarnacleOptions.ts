import { CommitHandler, IHandleCommits } from "./IHandleCommits";

export class BarnacleOptions implements IHandleCommits {
    constructor( onCommit: CommitHandler ) {
        this.onCommit = onCommit;
    }

    onCommit: CommitHandler;

    static Empty = new BarnacleOptions( () => {
    } )
}