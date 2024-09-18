/*const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it('has a timestamp, lastHash, hash, data, nonce, and difficulty property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
    
        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
    
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined-data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the lastHash to be the hash of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the data', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a timestamp', () => {
            expect(minedBlock.timestamp).not.toBeUndefined();
        });

        it('creates a hash based on the proper inputs', () => {
            expect(minedBlock.hash).toEqual(
                cryptoHash(minedBlock.timestamp, minedBlock.lastHash, minedBlock.data, minedBlock.nonce, minedBlock.difficulty)
            );
        });

        it('sets a nonce value', () => {
            expect(minedBlock.nonce).not.toBeUndefined();
        });

        it('sets a difficulty value', () => {
            expect(minedBlock.difficulty).not.toBeUndefined();
        });

        it('sets a hash that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(Math.max(block.difficulty - 1, 1)); // Ensure difficulty does not drop below 1
        });
    });
}); 

*/
const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it('has a timestamp, lastHash, hash, data, nonce, and difficulty property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
    
        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
    
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(new Block(GENESIS_DATA));
        });

        // Alternatively, test individual properties of the genesis block.
        it('has the correct genesis block properties', () => {
            expect(genesisBlock.timestamp).toEqual(GENESIS_DATA.timestamp);
            expect(genesisBlock.lastHash).toEqual(GENESIS_DATA.lastHash);
            expect(genesisBlock.hash).toEqual(GENESIS_DATA.hash);
            expect(genesisBlock.data).toEqual(GENESIS_DATA.data);
            expect(genesisBlock.nonce).toEqual(GENESIS_DATA.nonce);
            expect(genesisBlock.difficulty).toEqual(GENESIS_DATA.difficulty);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined-data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the lastHash to be the hash of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the data', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a timestamp', () => {
            expect(minedBlock.timestamp).not.toBeUndefined();
        });

        it('creates a hash based on the proper inputs', () => {
            expect(minedBlock.hash).toEqual(
                cryptoHash(minedBlock.timestamp, minedBlock.lastHash, minedBlock.data, minedBlock.nonce, minedBlock.difficulty)
            );
        });

        it('sets a nonce value greater than 0', () => {
            expect(minedBlock.nonce).toBeGreaterThan(0);
        });

        it('sets a difficulty value', () => {
            expect(minedBlock.difficulty).not.toBeUndefined();
        });

        it('sets a hash that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(Math.max(block.difficulty - 1, 1));
        });

        it('has a lower limit of 1 for difficulty', () => {
            block.difficulty = 0;
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(1);
        });
    });
});
