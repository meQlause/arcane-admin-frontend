import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";

export default function DiscussionMember({ rdt }: any) {
  const { account } = useAccount({ rdt })

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Discussion`}
            userName={account.address}
            userImage={account.avatar}
            userRole={account.role}
          />
    
          <p>Member page</p>
        </>
      )}
    </>
  )
}