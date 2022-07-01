import { JsonRpcSigner } from '@ethersproject/providers'

import { getClient } from '../../client'

export type FetchSignerResult = JsonRpcSigner | null

export async function fetchSigner(): Promise<FetchSignerResult> {
  const client = getClient()
  const signer = (await client.connector?.getSigner?.()) || null
  return signer
}
