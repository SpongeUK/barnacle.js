import { IOpener } from "./IOpener";

export class WindowOpener implements IOpener {
    constructor( readonly win: Window = window ) {
    }

    open( url: string, name: string, parameters: string ): void {
        this.win.open( url, name, parameters );
    }
}