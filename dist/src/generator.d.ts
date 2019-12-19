declare class Generator {
    loaderFileNameWithoutExtension: string;
    constructor();
    createConfigFile(): string;
    createLoaderFile(loaderDir: string, isTypescript: boolean): string;
    private getLoaderFileName;
}
export declare const generator: Generator;
export {};
