import { IOpener } from "./Opener/IOpener";
import { WindowOpener } from "./Opener/WindowOpener";

export interface Size {
    height: number;
    width: number;
}

export class ScreenRelativeSize {
    constructor (readonly screen: Screen = window.screen, readonly relativeHeight: number = 0.90, readonly relativeWidth = 0.99) {
    }

    get height () : number {
        return this.screen.height * this.relativeHeight;
    }

    get width () : number {
        return this.screen.width * this.relativeWidth;
    }
}

export class FixedSize {
    constructor( readonly height: number, readonly width: number ) {
    }
}

export class LaunchOptions {
    constructor(
        readonly size: Size,
        readonly top: number = 0,
        readonly left: number = 0,
        readonly fullscreen: string = "no",
        readonly menubar: string = "no",
        readonly toolbar: string = "no",
        readonly scrollbars: number = 1 ) {
    }

    toString() {
        return [
            'height=' + this.size.height,
            'width=' + this.size.width,
            'top=' + this.top,
            'left=' + this.left,
            'fullscreen=' + this.fullscreen,
            'menubar=' + this.menubar,
            'toolbar=' + this.toolbar,
            'scrollbars=' + this.scrollbars
        ].join( ',' );
    }
}

export class ScormLauncher {

    static launch( url: string, name: string = "course", opener: IOpener = new WindowOpener(), options: LaunchOptions = new LaunchOptions(new ScreenRelativeSize()) ): any {
        opener.open( url, name, options.toString() );
    }

}