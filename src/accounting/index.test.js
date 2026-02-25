const accounting = require('./index');

beforeEach(() => {
  // Reset balance to default before each test
  accounting.writeBalance(1000.0);
});

describe('Accounting business logic', () => {
  test('TC-01: view current balance', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    accounting.viewBalance();
    expect(spy).toHaveBeenCalledWith('Current balance: 1000.00');
    spy.mockRestore();
  });

  test('TC-02: credit account with positive amount', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    accounting.creditAccount(250);
    expect(accounting.readBalance()).toBeCloseTo(1250.0);
    expect(spy).toHaveBeenCalledWith('Amount credited. New balance: 1250.00');
    spy.mockRestore();
  });

  test('TC-03: debit less than balance', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    accounting.debitAccount(400);
    expect(accounting.readBalance()).toBeCloseTo(600.0);
    expect(spy).toHaveBeenCalledWith('Amount debited. New balance: 600.00');
    spy.mockRestore();
  });

  test('TC-04: debit equal to balance', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    accounting.debitAccount(1000);
    expect(accounting.readBalance()).toBeCloseTo(0.0);
    expect(spy).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
    spy.mockRestore();
  });

  test('TC-05: debit greater than balance', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    accounting.debitAccount(1200);
    expect(accounting.readBalance()).toBeCloseTo(1000.0);
    expect(spy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    spy.mockRestore();
  });

  test('TC-06: invalid menu choice', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const cont = accounting.handleChoice('5');
    expect(cont).toBe(true);
    expect(spy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    spy.mockRestore();
  });

  test('TC-07: exit application via menu', () => {
    const cont = accounting.handleChoice('4');
    expect(cont).toBe(false);
  });

  test('TC-08: credit then debit sequence', () => {
    accounting.creditAccount(500);
    accounting.debitAccount(300);
    expect(accounting.readBalance()).toBeCloseTo(1200.0);
  });

  test('TC-09: multiple reads without modifications', () => {
    expect(accounting.readBalance()).toBeCloseTo(1000.0);
    expect(accounting.readBalance()).toBeCloseTo(1000.0);
  });

  test('TC-10: balance persists during runtime after credits', () => {
    accounting.creditAccount(100);
    expect(accounting.readBalance()).toBeCloseTo(1100.0);
    accounting.viewBalance();
    expect(accounting.readBalance()).toBeCloseTo(1100.0);
  });
});
