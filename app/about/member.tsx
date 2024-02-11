import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Alert } from "@/app/components/alert";

export default function AboutMember({ rdt }: any) {
  const { account } = useAccount({ rdt })

  return (
    <>
      <MainTitle
        title={`About`}
        userName={account.address}
        userImage={account.avatar}
        userRole={account.role}
      >
        {sessionStorage.getItem('arcane-alert-status')?.toLocaleLowerCase() === 'success' &&
          <Alert variant="success" icon="/icon/check-circle.svg" duration={5} source="arcane-alert-message" />
        }
        {sessionStorage.getItem('arcane-alert-status')?.toLocaleLowerCase() === 'error' &&
          <Alert variant="error" icon="/icon/alert-circle.svg" duration={5} source="arcane-alert-message" />
        }
      </MainTitle>

      <p>Member page</p>
    </>
  )
}