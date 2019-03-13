export type CommitHandler = (data: any) => void;

export interface IHandleCommits {
    onCommit: CommitHandler;
}