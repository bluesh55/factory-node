# Factory

[![NPM version](https://img.shields.io/npm/v/@bluesh55/factory)](https://www.npmjs.com/package/@bluesh55/factory)

Factory is the library for creating data from pre-configured attribute specs.
It is good to use for testing purpose.

This library is inspired by [FactoryBot](https://github.com/thoughtbot/factory_bot).


## Installation

Node.js:

```bash
npm install --save @bluesh55/factory
```

## Usage

First of all, you must run `init` command for creating config file.  
This command will create `.factoryrc.json` file.

```bash
npx factory init
```

You can customize the config file if you want.

##### Example
```json
// .factoryrc.json

{
   factoriesDir: './mytest/factories/'
}
```

## License

Factory is licensed under the MIT License.
