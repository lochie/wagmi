import { providers } from 'ethers'

import {
  ConnectorNotFoundError,
  ProviderRpcError,
  UserRejectedRequestError,
} from '../../errors'
import { fetchSigner } from '../accounts'
import { getProvider } from '../providers'

export type SendTransactionEagerArgs = {
  /** Object to use when creating transaction */
  request: providers.TransactionRequest
}

export type SendTransactionEagerResult = providers.TransactionResponse

export async function sendTransactionEager({
  request,
}: SendTransactionEagerArgs): Promise<SendTransactionEagerResult> {
  try {
    /********************************************************/
    /** START: Deep link cautious code.                     */
    /** Do not perform any async operations in this block.  */
    /********************************************************/

    const provider = getProvider()

    // `fetchSigner` isn't really "asynchronous" as we have already
    // initialized the provider upon user connection, so it will return
    // immediately.
    const signer = await fetchSigner()
    if (!signer) throw new ConnectorNotFoundError()

    // We want to connect to the unchecked signer as that
    // has the "lightweight" `sendTransaction` method which
    // does not estimate gas lazily.
    const uncheckedSigner = signer.connectUnchecked()

    // This is where the end-user will be prompted.
    const { hash } = await uncheckedSigner.sendTransaction(request)

    /********************************************************/
    /** END: Deep link cautious code.                       */
    /** Go nuts!                                            */
    /********************************************************/

    // The unchecked `sendTransaction` only returns a hash, so we want to use
    // it to retrieve the full transaction once it has been mined.
    const transaction = await provider.getTransaction(hash)
    return transaction
  } catch (error) {
    if ((<ProviderRpcError>error).code === 4001)
      throw new UserRejectedRequestError(error)
    throw error
  }
}
