export interface ModelStorage {
    [index: string]: Model;
}
export interface Model {
    sequences?: Sequences;
    specification: Specification;
    creator: Function;
}
export interface Sequences {
    [index: string]: number;
}
export interface Specification {
    [index: string]: Attribute;
}
export interface Attribute {
    type: any;
    attributeName?: string;
    defaultValue?: any;
    transform?: Function;
}
