declare global {
  namespace JSX {
    interface IntrinsicElements {
      'radix-connect-button': any;
    }
  }
}

import { useWalletContext } from "@/app/contexts/wallet-context";

export default function WalletRadix({ onUpdate }: any) {
  const rdt = useWalletContext()
  rdt?.walletApi.provideConnectResponseCallback(async (result) => {
    if (!result.isErr()) {
      onUpdate(true)
    }
  })

  return (
    <>
      <radix-connect-button />
    </>
  )
}