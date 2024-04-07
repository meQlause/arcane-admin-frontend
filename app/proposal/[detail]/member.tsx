import { useRouter } from "next/navigation";
import { useAccount } from "@/app/auth/account";
import { ProposalDetail, ProposalDetailProps, ProposalVoteProps } from "@/app/components/proposal";
import { useWallet } from "@/app/auth/wallet";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function ProposalDetailMember({ rdt, id }: any) {
  const { account } = useAccount({ rdt })
  const [isLoading, setIsLoading] = useState(true)
  const [dataProposal, setDataProposal] = useState<ProposalDetailProps>({
    id:'',
    user_address: '',
    user_role: '',
    avatar: '',
    title: '',
    photos: [],
    description: '',
    end: '',
    status: '',
    vote: [],
    voter: [],
    ComponentAddress: '',
  });
  const { access_token } = useWallet()
  // let dataProposals: ProposalDetailProps = {
  //   id: id,
  //   user_address: 'rdx1shb1412422216dba',
  //   user_role: 'Core',
  //   avatar: '/user/user-1.png',
  //   title: 'Magic Square Community Validation: Orbofi AI on the Magic Store Voting',
  //   description: 'Welcome to the Magic Square Community Validation for Project Orbofi AI on the Magic Store Voting. As a platform dedicated to discovering, rating, and validating the finest Web3 projects, we require your input in determining if Project Orbofi AI meets the necessary criteria to be validated on the Magic Store, Web3 App Store.\n\nProject Orbofi AI Overview: Orbofi is the ultimate AI-generated content engine for web3, games, and every online community. Orbofi empowers anyone with a phone to create on-chain AI-generated gaming assets, and train, deploy, and create finetuned AI models in a few clicks that act as Asset factories for web3 and gamesFor a comprehensive guide on how to participate in the project validation, including evaluation criteria, tips, and steps, please refer to our Knowledge Base. Only users with a fully validated MagicID account on the Magic Store (connected wallet, verified email, and selected username) can participate in the voting process.\n\nIf you have not completed these steps, please visit the Magic Store to do so before casting your vote. For further discussion on Project Orbofi AI validation, join our Discord Server to connect with fellow community members. For detailed information on Project Orbofi AI, please visit the project page on the Magic Store here.',
  //   photos: ['/upload/proposal-1.png','/upload/proposal-1.png'],
  //   start: '21 Jan 2024',
  //   end: '28 Jan 2024',
  //   status: 'Active',
  //   ComponentAddress: '',
  //   vote_hide: 'false',
  //   vote: [
  //     {
  //       label: 'For',
  //       amount: 120,
  //       token: 5400
  //     },
  //     {
  //       label: 'Againts',
  //       amount: 84,
  //       token: 2000
  //     },
  //     {
  //       label: 'Abstain',
  //       amount: 37,
  //       token: 450
  //     }
  //   ],
  //   voter: [
  //     {
  //       user_address: 'yzp2lmc2445678901abc',
  //       avatar: '/user/user-1.png',
  //       selected: 'For',
  //       amount: 4200,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: 'abc4xyz3789012345lmn',
  //       avatar: '/user/user-1.png',
  //       selected: 'For',
  //       amount: 900,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: 'qwe3njk3154321876xyz',
  //       avatar: '/user/user-1.png',
  //       selected: 'Abstain',
  //       amount: 1200,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: '1235ghi4321098765qwe',
  //       avatar: '/user/user-1.png',
  //       selected: 'For',
  //       amount: 200,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: 'lmno6rst9876543210pqr',
  //       avatar: '/user/user-1.png',
  //       selected: 'Againts',
  //       amount: 6400000,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: '7897jkl0987654321vbn',
  //       avatar: '/user/user-1.png',
  //       selected: 'For',
  //       amount: 80,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: 'xyz8abc0123456789rst',
  //       avatar: '/user/user-1.png',
  //       selected: 'For',
  //       amount: 500,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: 'uvw9lmn1234567890pqr',
  //       avatar: '/user/user-1.png',
  //       selected: 'Againts',
  //       amount: 3200,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: '5432ijk2109876543hjk',
  //       avatar: '/user/user-1.png',
  //       selected: 'Againts',
  //       amount: 600,
  //       label: 'vARC'
  //     },
  //     {
  //       user_address: 'def0uvw5678901234mno',
  //       avatar: '/user/user-1.png',
  //       selected: 'Abstain',
  //       amount: 5600,
  //       label: 'vARC'
  //     }
  //   ]
  // }

  const getVoteDetail = async () => {
    return await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/vote/${id}`,
      {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }
    ).then((res) => res.json());
  }

  useEffect(() => {
    // response data
  //   {
  //     "id": "1",
  //     "startDate": "2024-02-17T14:35:50.509Z",
  //     "endDate": "2024-02-17T14:35:50.509Z",
  //     "title": "qlauseqq",
  //     "description": "qqqq",
  //     "componentAddress": "component_tdx_2_1cpmpq9pl4vqq6dfq6dsqn97v47mw5jpmq7e7qq2mqpkxgukcqhsyx2",
  //     "voteTokenAmount": {
  //         "For": 0,
  //         "Againts": 0,
  //         "Abstain": 0
  //     },
  //     "voteAddressCount": {
  //         "For": 0,
  //         "Againts": 0,
  //         "Abstain": 0
  //     },
  //     "isPending": true,
  //     "address": {
  //         "id": 2,
  //         "address": "account_tdx_2_12yq620haqzlptj7tumgnyl8a9lwpg0z3cwtfyha754rtw2lggn033c",
  //         "role": "admin",
  //         "vault_admin_address": null,
  //         "nft_id": null,
  //         "signUpAt": "2024-02-17T14:34:50.800Z"
  //     },
  //     "voters": []
  // }
    const fetchData = async () => {
      const data = await getVoteDetail();
      
      const vote_list: ProposalVoteProps[] = Object.entries(data?.voteTokenAmount).map(([label, token]) => ({
        label,
        token: typeof token === 'number' ? token : undefined,
        amount: data?.voteAddressCount[label],
      }));

      const voter = data?.voters.map(({ amount, voter, selected } : any) => ({
        user_address: voter,
        avatar: '/user/user-1.png',
        selected: selected,
        amount: Number(amount),
        label: 'ARC'
      }));
      setDataProposal({
        id: data?.id,
        user_address: data?.address.address,
        user_role: data?.address.role,
        avatar: '/user/user-1.png',
        title: 'Sooonnn',
        photos: '/user/user-1.png',
        description: 'Sooonnn',
        end: `${data?.endEpoch}`,
        status: data?.isPending ? 'pending' : 'active',
        vote: vote_list,
        voter: voter,
        ComponentAddress: data?.componentAddress,
      })
    }
    fetchData();
    setIsLoading(false);
  }, [])

  const router = useRouter()

  const handleBack = () => {
    router.push('/proposal')
  }

  return (
    <>{
      isLoading ?
      <Loading></Loading> 
      :
      <ProposalDetail {...dataProposal} handleBack={handleBack} account={account} />
    }
      </>
  )
}