# Factory

[![NPM version](https://img.shields.io/npm/v/@bluesh55/factory)](https://www.npmjs.com/package/@bluesh55/factory)

Factory is the library for creating data from pre-configured attribute specs.
It is good to use for testing purposes.

This library is inspired by [FactoryBot](https://github.com/thoughtbot/factory_bot).


## Installation

Node.js:

```bash
npm install --save @bluesh55/factory
```

## Getting Started

##### Initialize config file

First of all, you must run `init` command for creating a configuration file.  

```bash
npx factory init
```

This command will create `.factoryrc.json` file at the directory where you run the command.

```js
// .factoryrc.json

{
   "modelsDir": "./mytest/factories/"
}
```
You can customize the config if you want.

##### Create test model

Create your test model at the directory you specified above.

```js
// `./mytest/factories/user.js`

const { User } = require('../../db/models'); // Using Sequelize
const { encryptPassword } = require('../../src/utils/crypto'); // To encrypt password

module.exports = {
  name: 'user', // You can use this name for `factory.create('user');`
  attributesSpec: {
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
      creator: async (password) => {
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
      creator: async (value) => {
        const newValue = value ? 1: 0;
        return newValue;
      }
    }
  },
  creator: async (attributes) => {
    return await User.create(attributes);
  }
}
```

##### Use factory at your test file

```js
// example of jest

const { factory } = require('@bluesh55/factory');

describe('User', () => {
  beforeEach(async (done) => {
    await factory.create('user', { password: '12345678' });
    await factory.create('user', { username: 'Andrew', isAdmin: true });
    /*
       This will create the user in the database like this

       {
          id: 1,
          email: 'email0@gmail.com',
          encrypted_password: '...(encrypted '12345678')',
          tel: '010-1234-4321',
          username: 'username0',
          user_type: 0,
       },
       {
          id: 2,
          email: 'email1@gmail.com',
          encrypted_password: '...(encrypted 'password')',
          tel: '010-1234-4321',
          username: 'Andrew',
          user_type: 1,
       }
     */
  });

  it('the test case what you want', (done) => {
    // ...
  });
});
```

## Configuration

```js
// .factoryrc.json

{
   "modelsDir": "./mytest/factories/"
}
```

- modelsDir: The directory path that includes all test models.

## Test model

The test model is a definition of what you want to build and how to create to the database(or whatever).  
It has some pre-defined options which be able to create data dynamically from static definition.

### name

The test model's name for creating.

```js
// Define mymodel

module.exports = {
  name: 'mymodel',
  attributesSpec: {
    ...
  },
  creator: async (attributes) => {
    ...
  }
}
```

```js
// create mymodel

factory.create('mymodel');
```

### attributesSpec

`attributesSpec` is a complicated option that has some sub-options. See below example.

```js
module.exports = {
  name: 'mymodel',
  attributesSpec: {
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
      creator: async (password) => {
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
      creator: async (value) => {
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
`seq` parameter is sequential number start from 0. This is good to use for uniqueness data.
- **attributeName**: This is used if the name of attribute is different between spec and database.
- **creator**: In some cases, maybe you want to transform value to something different. 
In the above example, the `password` attribute has the `creator` to encrypt input value.


### creator

The **Factory** delegates the data creation part to you. You can use Sequelize, Mongoose, whatever to save the data in database.  
What you have to do is just defining `creator` function. If you define creator function, the Factory uses that when you call `create` method.

```js
const { MyModel } = require('../../db/models'); // require Sequelize instance

module.exports = {
  name: 'mymodel',
  attributesSpec: {
    ...
  },
  creator: async (attributes) => {
    return await MyModel.create(attributes);
  }
}
```

```js
factory.create('mymodel');
```

The `creator` function gets an `attributes` parameter that is derived from `attributesSpec`.
And it must return created data if you want to use that in the test.

## License

Factory is licensed under the MIT License.
