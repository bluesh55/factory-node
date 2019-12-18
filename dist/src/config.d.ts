declare class Configuration {
    configFileName: string;
    configTemplate: string;
    modelsDir: string;
    tsConfig: any;
    constructor();
    initialize(): string;
    load(): boolean;
    loadModelsDir(basePath?: string[]): boolean | undefined;
}
declare const config: Configuration;
export default config;
