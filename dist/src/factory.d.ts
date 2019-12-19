import { ModelStorage, Specification } from './model';
declare type AnyObject = {
    [index: string]: any;
};
declare class Factory {
    static get ASYNC_FUNCTION_NAME(): string;
    static get PLAIN_FUNCTION_NAME(): string;
    models: ModelStorage;
    constructor();
    addModel(name: string, specification: Specification, creator: Function): void;
    create(modelName: string, attrs?: AnyObject): Promise<any>;
    _doAsyncOrPlainFunction(func: Function, ...params: any[]): Promise<any>;
    _isFunction(param: any): boolean;
}
export declare const factory: Factory;
export {};
