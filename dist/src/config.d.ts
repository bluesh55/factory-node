declare class Configuration {
    configFileName: string;
    configTemplate: string;
    modelsDir: string;
    tsConfig: any;
    constructor();
    initializeConfigFile(): string;
    initializeLoader(isTypescript: boolean): string;
    load(): boolean;
    loadModelsDir(basePath?: string[]): boolean | undefined;
}
export declare const config: Configuration;
export {};
