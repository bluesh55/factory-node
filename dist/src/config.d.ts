declare class Configuration {
    fileName: string;
    configTemplate: string;
    modelsDir: string;
    constructor();
    initialize(): string;
    load(basePath?: string[]): boolean | undefined;
}
declare const config: Configuration;
export default config;
