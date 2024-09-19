/*const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        // Start the chain with the genesis block
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer.');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain is invalid.');
            return;
        }

        console.log('Replacing the chain with', chain);
        this.chain = chain;
    }

    static isValidChain(chain) {
        // Ensure the chain starts with the genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        // Validate every block in the chain
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data } = block;

            // Ensure the block's lastHash matches the previous block's hash
            if (lastHash !== actualLastHash) return false;

            // Ensure the hash is correctly computed
            const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);
            if (hash !== validatedHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;*/
const Block = require('./block');
const {cryptoHash} = require('../util');

class Blockchain {
    constructor() {
        // Start the chain with the genesis block
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer.');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain is invalid.');
            return;
        }

        console.log('Replacing the chain with the new chain...');
        if (onSuccess) onSuccess();
        this.chain = chain;
    }

    static isValidChain(chain) {
        // Ensure the chain starts with the genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        // Validate every block in the chain
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data } = block;

            // Ensure the block's lastHash matches the previous block's hash
            if (lastHash !== actualLastHash) return false;

            // Ensure the hash is correctly computed
            const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);
            if (hash !== validatedHash) return false;

            // Check that the difficulty hasn't jumped too far
            if (Math.abs(chain[i - 1].difficulty - block.difficulty) > 1) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;
