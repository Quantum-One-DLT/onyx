import { SiweMessage } from 'siwe'
import { createSIWEConfig } from '@web3modal/siwe'
import type { SIWECreateMessageArgs, SIWEVerifyMessageArgs } from '@web3modal/siwe'

/* Function that creates a SIWE message */
function createMessage({ nonce, address, chainId }: SIWECreateMessageArgs){
  const message = new SiweMessage({
    version: '1',
    domain: window.location.host,
    uri: window.location.origin,
    address,
    chainId,
    nonce,
    statement: 'Sign in With Ethereum.'
  })

  return message.prepareMessage()
}

/* Function that returns the user's session */
async function getSession({ address, chainId }: SIWECreatMessageArgs){
  const session = await getSession()
  if (!session) throw new Error('Failed to get session!')

  const { address, chainId } = session

  return { address, chainId }
}

/* Use your SIWE server to verify if the message and the signature are valid */
async function verifyMessage({ message, signature }: SIWEVerifyMessageArgs){
  try {
    const isValid = await validateMessage({ message, signature })

    return isValid
  } catch (error) {
    return false
  }
},

/* Create a SIWE configuration object */
const siweConfig = createSIWEConfig({
  createMessage,
  getNonce,
  getSession,
  verifyMessage,
  signOut
})