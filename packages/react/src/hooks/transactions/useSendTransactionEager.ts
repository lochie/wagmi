import * as React from 'react'
import {
  SendTransactionEagerArgs,
  SendTransactionEagerResult,
  sendTransactionEager,
} from '@wagmi/core'
import { useMutation } from 'react-query'

import { MutationConfig } from '../../types'
import { useBuildTransactionEager } from './useBuildTransactionEager'

export type UseSendTransactionEagerArgs = {
  request: Partial<SendTransactionEagerArgs['request']> & {
    to: NonNullable<SendTransactionEagerArgs['request']['to']>
    value: NonNullable<SendTransactionEagerArgs['request']['value']>
  }
}

export type UseSendTransactionEagerConfig = MutationConfig<
  SendTransactionEagerResult,
  Error,
  UseSendTransactionEagerArgs
>

export const mutationKey = (args: UseSendTransactionEagerArgs) =>
  [{ entity: 'sendTransaction', ...args }] as const

const mutationFn = (args: SendTransactionEagerArgs) => {
  const { request } = args
  return sendTransactionEager({ request })
}

export function useSendTransactionEager({
  request: request_,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSendTransactionEagerArgs & UseSendTransactionEagerConfig) {
  const { data: eagerRequest } = useBuildTransactionEager({ request: request_ })

  const request = { ...request_, ...eagerRequest }

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(mutationKey({ request }), mutationFn, {
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const sendTransaction = React.useCallback(
    () => mutate({ request }),
    [mutate, request],
  )

  const sendTransactionAsync = React.useCallback(
    () => mutateAsync({ request }),
    [mutateAsync, request],
  )

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    sendTransaction,
    sendTransactionAsync,
    status,
    variables,
  }
}
