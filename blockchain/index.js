const Block = require('./block')
const Transaction = require('../wallet/transaction')
const Wallet = require('../wallet')
const { cryptoHash } = require('../util')
const { REWARD_INPUT, MINING_REWARD } = require('../config')

class Blockchain {
  constructor () {
    this.chain = [Block.genesis()]
  }

  addBlock ({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    })

    this.chain.push(newBlock)
  }

  replaceChain (chain, validateTransation, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer')
      return
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid')
      return
    }

    if (validateTransation && !this.validTransactionData({ chain })) {
      console.error('The incoming chain has invalid data')
      return
    }

    if (onSuccess) onSuccess()
    console.log('Replacing the chain with the new chain...')
    this.chain = chain
  }

  validTransactionData ({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const transactionSet = new Set()
      let rewardTransactionCount = 0

      for (const transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1

          if (rewardTransactionCount > 1) {
            console.error('Miner rewards exceed limit')
            return false
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward amount is invalid')
            return false
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error('Invalid transaction')
            return false
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address
          })

          if (transaction.input.amount !== trueBalance) {
            console.error('Invalid input amount')
            return false
          }

          if (transactionSet.has(transaction)) {
            console.error('An identical transaction appears more than once in the block')
            return false
          } else {
            transactionSet.add(transaction)
          }
        }
      }
    }
    return true
  }

  static isValidChain (chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const actualLastHash = chain[i - 1].hash
      const { timestamp, lastHash, hash, nonce, difficulty, data } = block

      if (lastHash !== actualLastHash) return false

      const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data)

      if (hash !== validatedHash) return false

      if (Math.abs(chain[i - 1].difficulty - block.difficulty) > 1) return false
    }

    return true
  }
}

module.exports = Blockchain
