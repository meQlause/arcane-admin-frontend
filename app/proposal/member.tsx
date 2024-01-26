import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";

export default function ProposalMember({ rdt }: any) {
  const { account } = useAccount({ rdt })
  const profile: any = {
    username: account?.address,
    avatar: '/user/user-1.png',
    role: 'Admin'
  }

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Proposal`}
            userName={profile.username}
            userImage={profile.avatar}
            userRole={profile.role}
          />
    
          <p>Member page</p>
        </>
      )}
    </>
  )
}