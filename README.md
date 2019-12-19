# Factory

[![NPM version](https://img.shields.io/npm/v/@bluesh55/factory)](https://www.npmjs.com/package/@bluesh55/factory)

Factory is the library for creating data from pre-configured model definition.
It is good to use for testing purposes.

This library is inspired by [FactoryBot](https://github.com/thoughtbot/factory_bot).

## Installation

Node.js:

```bash
npm install --save @bluesh55/factory
```

## Getting Started

##### Create configuration file

First of all, you must run `init` command for creating a configuration file.

```bash
npx factory init
```

This command will create `.factoryrc.json` file at the directory where you run the command.

```js
// .factoryrc.json

{
  "modelsDir": "./mytest/factories/",
  "loaderDir": "./tests/helpers"
}
```

##### Create loader file

And then, you have to run `init:loader` command for creating loader file that loads all models at runtime.
If you want to writing model using typescript, you can use `--typescript` option.

```bash
# Create loader file (default: Javascript)
npx factory init:loader

# Create loader file (Typescript)
npx factory init:loader --typescript
```

##### Create test model

Create your test model at the directory you configured above.

```js
// `./mytest/factories/person.js`
const { Person } = require('../../db/models') // use Sequelize

module.exports = {
  name: 'person',
  specification: {
    id: {
      type: Number,
    },
    name: {
      type: String,
      defaultValue: async seq => {
        return `name{seq}`
      },
    },
    tel: {
      type: String,
      defaultValue: '010-1234-4321',
    },
  },
  creator: attributes => {
    return Person.create(attributes)
  },
}
```

##### Use factory at your test file

```js
// example of jest

const { factory } = require('@bluesh55/factory')

describe('Person', () => {
  beforeEach(async done => {
    await factory.create('person')
    await factory.create('person', { name: 'Andrew' })
    /*
       This will create the person in the database like this

       {
          id: 1,
          name: 'name0',
          tel: '010-1234-4321'
       },
       {
          id: 2,
          name: 'Andrew',
          tel: '010-1234-4321'
       }
     */
  })

  it('the test case what you want', done => {
    // ...
  })
})
```

## Configuration

```js
// .factoryrc.json

{
  "modelsDir": "./mytest/factories/",
  "loaderDir": "./tests/helpers"
}
```

- modelsDir: The directory path that includes all test models.
- loaderDir: The directory path that will be created loader file when you run the command `npx factory init:loader`

## Test model

The test model is a definition of what you want to build and how to create to the database(or whatever).  
It has some options which be able to create data dynamically from static definition.

### name

The test model's name for creating.

```js
// Define mymodel

module.exports = {
  name: 'mymodelname',
  specification: {
    ...
  },
  creator: async (attributes) => {
    ...
  }
}
```

```js
// Create mymodel

factory.create('mymodelname')
```

### specification

`specification` is a complicated option that has some sub-options. See below example.

```js
const { encryptPassword } = require('../utils/crypto'); // use custom crypto util to encrypt password

module.exports = {
  name: 'user',
  specification: {
    id: {
      type: Number,
    },
    email: {
      type: String,
      defaultValue: async (seq) => {
        return `email${seq}@gmail.com`
      }
    },
    password: {
      type: String,
      attributeName: 'encrypted_password',
      transform: async (password) => {
        const encryptedPassword = await encryptPassword(password);
        return encryptedPassword;
      },
      defaultValue: 'password',
    },
    username: {
      type: String,
      defaultValue: async (seq) => {
        return `username${seq}`
      }
    },
    tel: {
      type: String,
      defaultValue: '010-1234-4321'
    },
    isAdmin: {
      type: Boolean,
      defaultValue: false,
      attributeName: 'user_type',
      transform: (value) => {
        const newValue = value ? 1: 0;
        return newValue;
      }
    }
  },
  creator: async (attributes) => {
    ...
  }
}
```

- **type**: The type of data. There is nothing using this option yet. Just specification.
- **defaultValue**: This is used as a default value if you don't specify attribute when call `create` method.  
  If function or async function is given, defaultValue would be the value of the function returns and get the `seq` parameter.
  The `seq` parameter is sequential number start from 0. This is good to use for uniqueness data.
- **attributeName**: This is used if the name of attribute is different between specification key and database column name.
- **transform**: In some cases, maybe you want to transform value to something different.
  In the above example, the `password` attribute has the `transform` option to encrypt input value.
  It can be function or async function that gets old value as parameter. It have to return the transformed data.

### creator

The **Factory** delegates the data creation part to you. You can use Sequelize, Mongoose, whatever to save the data in database.  
What you have to do is just defining `creator` function. If you define creator function, the Factory uses that when you call `create` method.  
The `creator` function gets an `attributes` parameter that is derived from `specification`.

```js
// Define creator function uses sequelize

const { MyModel } = require('../../db/models'); // require Sequelize instance

module.exports = {
  name: 'mymodel',
  specification: {
    ...
  },
  creator: async (attributes) => {
    return await MyModel.create(attributes);
  }
}
```

And it must return created data if you want to use that in the test.

```js
// And use in the test
describe('...', () => {
  let mymodel;

  beforeEach(async (done) => {
    mymodel = await factory.create('mymodel');
    done();
  });

  ...
})
```

## License

Factory is licensed under the MIT License.
