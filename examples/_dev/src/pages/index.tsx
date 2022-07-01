import * as React from 'react'
import { useAccount } from 'wagmi'

import { Account, Connect, NetworkSwitcher } from '../components'
import { useIsMounted } from '../hooks'

const Page = () => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()

  if (!isMounted) return null
  return (
    <>
      <Connect />
      <div style={{ height: 20 }} />
      {isConnected && (
        <>
          <Account />
          <div style={{ height: 20 }} />
          <NetworkSwitcher />
        </>
      )}
    </>
  )
}

export default Page
