import { BigNumber } from 'ethers'
import { useSendTransactionEager } from 'wagmi'

export const SendTransactionEager = () => {
  const { data, isIdle, isLoading, isSuccess, isError, sendTransaction } =
    useSendTransactionEager({
      request: {
        to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        value: BigNumber.from('10000000000000000'), // 0.01 ETH
      },
    })

  console.log(data)

  if (isLoading) return <div>Check Wallet</div>

  if (isIdle)
    return (
      <button disabled={isLoading} onClick={() => sendTransaction()}>
        Send Transaction
      </button>
    )

  return (
    <div>
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {isError && <div>Error sending transaction</div>}
    </div>
  )
}
