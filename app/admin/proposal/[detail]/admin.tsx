import { useRouter } from "next/navigation";
import { useAccount } from "@/app/auth/account";
import {
  ProposalDetail,
  ProposalDetailProps,
  ProposalVoteProps,
} from "@/app/components/proposal";
import { useWallet } from "@/app/auth/wallet";
import { useEffect, useState } from "react";
import config from "@/app/config";

export default function ProposalDetailAdmin({ rdt, id }: any) {
  const { account, nft_id } = useAccount({ rdt });
  const [isLoading, setIsLoading] = useState(true);
  const [dataProposal, setDataProposal] = useState<ProposalDetailProps>({
    id: "",
    user_address: "",
    user_role: "",
    avatar: "",
    title: "",
    photos: [],
    description: "",
    start: 0,
    end: 0,
    status: "",
    vote: [],
    voter: [],
    component_address: "",
  });
  const { access_token } = useWallet();
  // const dataProposal: ProposalDetailProps = {
  //   id: id,
  //   user_address: 'rdx1shb1412422216dba',
  //   user_role: 'Core',
  //   avatar: '/user/user-1.png',
  //   title: 'Magic Square Community Validation: Orbofi AI on the Magic Store Voting',
  //   description: 'Welcome to the Magic Square Community Validation for Project Orbofi AI on the Magic Store Voting. As a platform dedicated to discovering, rating, and validating the finest Web3 projects, we require your input in determining if Project Orbofi AI meets the necessary criteria to be validated on the Magic Store, Web3 App Store.\n\nProject Orbofi AI Overview: Orbofi is the ultimate AI-generated content engine for web3, games, and every online community. Orbofi empowers anyone with a phone to create on-chain AI-generated gaming assets, and train, deploy, and create finetuned AI models in a few clicks that act as Asset factories for web3 and gamesFor a comprehensive guide on how to participate in the project validation, including evaluation criteria, tips, and steps, please refer to our Knowledge Base. Only users with a fully validated MagicID account on the Magic Store (connected wallet, verified email, and selected username) can participate in the voting process.\n\nIf you have not completed these steps, please visit the Magic Store to do so before casting your vote. For further discussion on Project Orbofi AI validation, join our Discord Server to connect with fellow community members. For detailed information on Project Orbofi AI, please visit the project page on the Magic Store here.',
  //   photos: ['/upload/proposal-1.png','/upload/proposal-1.png'],
  //   ComponentAddress: '',
  //   start: 0,
  //   end: 0,
  //   status: 'Active',
  //   vote_hide: 'true',
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
  //   ],
  //   need_approval: true
  // }
  const [dataVoteDetail, setDataVoteDetail] = useState<boolean>(true);
  const getVoteDetail = async () => {
    return await fetch(
      `${config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER}/proposal/detail/${id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    ).then((res) => res.json());
  };

  const getVoterDetail = async (id: any, nft_id: string) => {
    return await fetch(
      `${
        config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER
      }/proposal/voter?proposalId=${id}?nftId=${nft_id.slice(1, -1)}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .catch((_) => undefined);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVoteDetail();

      if (data) {
        const vote_list: ProposalVoteProps[] = Object.entries(
          data?.vote_token_amount
        ).map(([label, token]) => ({
          label,
          token: typeof token === "number" ? token : undefined,
          amount: data?.vote_address_count[label],
        }));

        const voter = data?.voters.map(({ amount, voter, selected }: any) => ({
          user_address: voter,
          avatar: "/user/user-1.png",
          selected: selected,
          amount: Number(amount),
          label: "ARC",
        }));

        let proposalData: any = {};

        if (nft_id) {
          const dataVoter = await getVoterDetail(data?.id, nft_id);
          proposalData = {
            ...proposalData,
            user_voted: dataVoter?.selected,
            user_withdraw: dataVoter?.is_withdrawed,
          };
        }

        proposalData = {
          ...proposalData,
          id: data?.id,
          user_address: data?.address.address,
          user_role: data?.address.role,
          avatar: "/user/user-1.png",
          title: data?.title,
          photos: [data?.picture],
          description: data?.description,
          end: data?.end_epoch,
          start: data?.start_epoch,
          status: data?.status,
          vote: vote_list,
          voter: voter,
          ComponentAddress: data?.component_address,
        };

        setDataProposal(proposalData);
        setDataVoteDetail(true);
      } else {
        setDataVoteDetail(false);
      }
    };
    fetchData();

    setIsLoading(false);
  }, []);
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/proposal");
  };

  return (
    <>
      {account && (
        <>
          <ProposalDetail
            {...dataProposal}
            handleBack={handleBack}
            account={account}
          />
        </>
      )}
    </>
  );
}
