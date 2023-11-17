const web3 = require("@solana/web3.js");
const bs58 = require('bs58');
let secretKey = bs58.decode("5bRiabRNwmJPaj9YmDuGtDg4f1k7VbcNnGjeAFxbzd66J8wCbfgPiE17TRRnt9hp5CB9FpqmgWb7GJ5qtiXchJTH");
console.log(`[${web3.Keypair.fromSecretKey(secretKey).secretKey}]`);