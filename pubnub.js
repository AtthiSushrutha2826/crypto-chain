const PubNub = require('pubnub')
const credentials = {
  publishKey: 'pub-c-6c896813-47e3-4ae9-95e2-0e1a48d81521',
  subscribeKey: 'sub-c-d6293324-30cc-49d4-8555-3a1fba90276b',
  secretKey: 'sec-c-MTNjMGU1MmYtZGNlOS00MGNhLThiYmEtNzRiNjZmYWFkMGU4'
}

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
}
class PubSub {
  constructor ({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet

    this.pubnub = new PubNub(credentials)

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })

    this.pubnub.addListener(this.listener())
  }

  broadcastChain () {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    })
  }

  broadcastTransaction (transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    })
  }

  subscribeToChannels () {
    this.pubnub.subscribe({
      channels: [Object.values(CHANNELS)]
    })
  }

  listener () {
    return {
      message: messageObject => {
        const { channel, message } = messageObject

        console.log(`Message received. Channel: ${channel}. Message: ${message}`)
        const parsedMessage = JSON.parse(message)

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage, true, () => {
              this.transactionPool.clearBlockchainTransactions(
                { chain: parsedMessage.chain }
              )
            })
            break
          case CHANNELS.TRANSACTION:
            if (!this.transactionPool.existingTransaction({
              inputAddress: this.wallet.publicKey
            })) {
              this.transactionPool.setTransaction(parsedMessage)
            }
            break
          default:
        }
      }
    }
  }

  publish ({ channel, message }) {
    // there is an unsubscribe function in pubnub
    // but it doesn't have a callback that fires after success
    // therefore, redundant publishes to the same local subscriber will be accepted as noisy no-ops
    this.pubnub.publish({ message, channel })
  }
}

module.exports = PubSub
