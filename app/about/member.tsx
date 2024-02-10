import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";

export default function SettingMember({ rdt }: any) {
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
            title={`Setting`}
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