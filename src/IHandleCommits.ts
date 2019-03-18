import { ScormVersions } from "./ScormVersions";

export type CommitHandler = ( data: any, version?: ScormVersions  ) => void;

export interface IHandleCommits {
    onCommit: CommitHandler;
}