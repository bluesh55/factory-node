const Factory = require('../../src/factory');

describe('Factory', () => {
  let sut;

  beforeEach(() => {
    sut = new Factory();
  });

  describe('#addModel', () => {
    it('add new model', () => {
      sut.addModel('mymodel', {}, () => {})
      expect(Object.keys(sut.models).length).toEqual(1);
    });
  });

  describe('#create', () => {

    // Start of creator
    describe('creator', () => {
      describe('async creator', () => {
        beforeEach(() => {
          sut = new Factory();
          sut.addModel('mymodel', {}, async () => {
            return 100;
          });
        });

        it('gets creator return value', async () => {
          const result = await sut.create('mymodel');
          expect(result).toEqual(100);
        });
      });

      describe('sync creator', () => {
        beforeEach(() => {
          sut = new Factory();
          sut.addModel('mymodel', {}, () => {
            return 200;
          });
        });

        it('gets creator return value', async () => {
          const result = await sut.create('mymodel');
          expect(result).toEqual(200);
        });
      });
    });
    // End of creator


    // Start of specification
    describe('specification', () => {
      describe('attributeName', () => {
        beforeEach(() => {
          sut = new Factory();
          sut.addModel('mymodel', {
            attr: {
              type: Number,
              attributeName: 'attr_name',
              defaultValue: 150
            }
          }, (attributes) => {
            return attributes;
          });
        });

        it('assigns attribute name from `attributeName`', async () => {
          const result = await sut.create('mymodel');
          expect(result.attr_name).toEqual(150);
          expect(result.attr).toEqual(undefined);
        });
      });

      describe('transform', () => {
        describe('assigning async function', () => {
          beforeEach(() => {
            sut = new Factory();
            sut.addModel('mymodel', {
              attr: {
                type: Number,
                defaultValue: 150,
                transform: async (value) => {
                  return value * 2;
                }
              }
            }, (attributes) => {
              return attributes;
            });
          });

          it('assigns transformed value', async () => {
            const result = await sut.create('mymodel');
            expect(result.attr).toEqual(300);
          });
        });

        describe('assigning function', () => {
          beforeEach(() => {
            sut = new Factory();
            sut.addModel('mymodel', {
              attr: {
                type: Number,
                defaultValue: 150,
                transform: (value) => {
                  return value * 2;
                }
              }
            }, (attributes) => {
              return attributes;
            });
          });

          it('assigns transformed value', async () => {
            const result = await sut.create('mymodel');
            expect(result.attr).toEqual(300);
          });
        });
      });

      describe('defaultValue', () => {
        describe('assigning plain value', () => {
          beforeEach(() => {
            sut = new Factory();
            sut.addModel('mymodel', {
              attr: {
                type: Number,
                defaultValue: 150
              }
            }, (attributes) => {
              return attributes;
            });
          });

          it('assigns default value', async () => {
            const result = await sut.create('mymodel');
            expect(result.attr).toEqual(150);
          });
        });

        describe('assigning function', () => {
          beforeEach(() => {
            sut = new Factory();
            sut.addModel('mymodel', {
              attr: {
                type: Number,
                defaultValue: (seq) => {
                  return 'default';
                }
              }
            }, (attributes) => {
              return attributes;
            });
          });

          it('assigns default value', async () => {
            const result = await sut.create('mymodel');
            expect(result.attr).toEqual('default');
          });
        });

        describe('assigning async function', () => {
          beforeEach(() => {
            sut = new Factory();
            sut.addModel('mymodel', {
              attr: {
                type: Number,
                defaultValue: async (seq) => {
                  return 'default';
                }
              }
            }, (attributes) => {
              return attributes;
            });
          });

          it('assigns default value', async () => {
            const result = await sut.create('mymodel');
            expect(result.attr).toEqual('default');
          });
        });

      });
    });
    // End of specification
  });
});
