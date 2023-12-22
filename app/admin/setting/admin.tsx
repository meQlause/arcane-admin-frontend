import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";

export default function SettingAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Setting`}
            userName={account.address}
            userImage={`/user/user-1.png`}
            userStatus={`Core`}
          />

          <p>Admin page</p>
        </>
      )}
    </>
  )
}