// ovld.test.js
require('../src/ovld');
const ovld = window.ovld;
const { find, attr, val, addClass, remClass, append, empty } = ovld.core;

describe('ovld functions', () => {
  
  // Mock document object for tests
  const mockDocument = {
    querySelectorAll: jest.fn().mockReturnValue(['input1', 'input2']),
    
    createElement: jest.fn().mockImplementation(tag => ({
      setAttribute: jest.fn(),
      getAttribute: jest.fn().mockReturnValue('testValue'),
      value: 'testValue',
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      },
      insertAdjacentHTML: jest.fn(),
      innerHTML: ''
    })),
  };
  
  // Mock input object for tests
  const mockInput = {
    getAttribute: jest.fn().mockReturnValue('testName'),
    value: 'testValue'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('find function', () => {
    const result = find(mockDocument, '[name])');
    expect(result).toEqual(['input1', 'input2']);
  });

  test('attr function', () => {
    const result = attr(mockInput, 'name');
    expect(result).toBe('testName');
  });

  test('val function', () => {
    const result = val(mockInput);
    expect(result).toBe('testValue');
  });  
});
