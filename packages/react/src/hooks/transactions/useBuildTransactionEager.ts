import {
  buildTransactionEager,
  BuildTransactionEagerArgs,
  BuildTransactionEagerResult,
} from '@wagmi/core'
import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useSigner } from '../accounts'
import { useProvider } from '../providers'
import { useChainId, useQuery } from '../utils'

export type UseBuildTransactionEagerArgs = BuildTransactionEagerArgs

export type UseBuildTransactionEagerConfig = QueryConfig<
  BuildTransactionEagerResult,
  Error
>

export const queryKey = ({
  chainId,
  request,
}: UseBuildTransactionEagerArgs & {
  chainId?: number
}) => [{ entity: 'buildTransactionEager', chainId, request }] as const

const queryFn = ({
  queryKey: [{ request }],
}: QueryFunctionArgs<typeof queryKey>) => {
  return buildTransactionEager({ request })
}

export function useBuildTransactionEager({
  request,
  cacheTime,
  enabled = true,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseBuildTransactionEagerArgs & UseBuildTransactionEagerConfig) {
  const chainId = useChainId()
  const provider = useProvider()
  return useQuery(queryKey({ request, chainId }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && provider),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
