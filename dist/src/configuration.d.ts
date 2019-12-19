declare class Configuration {
    configFileName: string;
    defaultConfig: {
        modelsDir: string;
        loaderDir: string;
    };
    modelsDir: string;
    loaderDir: string;
    constructor();
    load(): boolean;
    loadConfigFileRecursively(basePath?: string[]): boolean | undefined;
}
export declare const configuration: Configuration;
export {};
