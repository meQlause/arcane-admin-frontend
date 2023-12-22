import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";

export default function ProposalMember({ rdt }: any) {
  const { account } = useAccount({ rdt })

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Proposal`}
            userName={account.address}
            userImage={`/user/user-1.png`}
            userStatus={`Core`}
          />
    
          <p>Member page</p>
        </>
      )}
    </>
  )
}