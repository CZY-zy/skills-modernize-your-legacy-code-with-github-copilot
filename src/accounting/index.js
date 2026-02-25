#!/usr/bin/env node

// Simple Node.js rewrite of the COBOL account management system.
// This single file contains the menu logic, business operations, and
// a tiny in-memory data layer mirroring the original DataProgram.

const prompt = require('prompt-sync')({ sigint: true });

let storageBalance = 1000.0; // initial balance matches COBOL default

function readBalance() {
  return storageBalance;
}

function writeBalance(newBalance) {
  storageBalance = newBalance;
}

function showMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function viewBalance() {
  const bal = readBalance();
  console.log('Current balance: ' + bal.toFixed(2));
}

function creditAccount(amount) {
  // if amount not provided, ask the user
  let amt = amount;
  if (amt === undefined) {
    const amtStr = prompt('Enter credit amount: ');
    amt = parseFloat(amtStr);
  }
  if (isNaN(amt) || amt < 0) {
    console.log('Invalid amount.');
    return;
  }
  let bal = readBalance();
  bal += amt;
  writeBalance(bal);
  console.log('Amount credited. New balance: ' + bal.toFixed(2));
}

function debitAccount(amount) {
  let amt = amount;
  if (amt === undefined) {
    const amtStr = prompt('Enter debit amount: ');
    amt = parseFloat(amtStr);
  }
  if (isNaN(amt) || amt < 0) {
    console.log('Invalid amount.');
    return;
  }
  let bal = readBalance();
  if (bal >= amt) {
    bal -= amt;
    writeBalance(bal);
    console.log('Amount debited. New balance: ' + bal.toFixed(2));
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

function handleChoice(choice) {
  switch (choice) {
    case '1':
      viewBalance();
      return true;
    case '2':
      creditAccount();
      return true;
    case '3':
      debitAccount();
      return true;
    case '4':
      return false;
    default:
      console.log('Invalid choice, please select 1-4.');
      return true;
  }
}

function main() {
  let continueFlag = true;
  while (continueFlag) {
    showMenu();
    const choice = prompt('Enter your choice (1-4): ');
    continueFlag = handleChoice(choice);
  }
  console.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  main();
}

module.exports = {
  readBalance,
  writeBalance,
  viewBalance,
  creditAccount,
  debitAccount,
  handleChoice,
};
