import { providers } from 'ethers'

import { fetchEnsAddress } from '../ens'
import { getProvider } from '../providers'

export type BuildTransactionEagerArgs = {
  request: Partial<providers.TransactionRequest> & {
    to: NonNullable<providers.TransactionRequest['to']>
  }
}

export type BuildTransactionEagerResult = providers.TransactionRequest

export async function buildTransactionEager({
  request,
}: BuildTransactionEagerArgs): Promise<BuildTransactionEagerResult> {
  const provider = getProvider()

  const [toResult, gasLimitResult] = await Promise.allSettled([
    fetchEnsAddress({ name: request.to }),
    request.gasLimit
      ? Promise.resolve(request.gasLimit)
      : provider.estimateGas(request),
  ])

  const gasLimit =
    gasLimitResult.status === 'fulfilled' ? gasLimitResult.value : undefined
  const to =
    toResult.status === 'fulfilled' ? toResult.value || undefined : undefined

  return { ...request, gasLimit, to }
}
