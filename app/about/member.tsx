import Image from "next/image";
import Link from "next/link";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Button } from "@/app/components/button";
import { Alert } from "@/app/components/alert";
import { formatDate } from "@/app/functions/datetime";

export default function AboutMember({ rdt }: any) {
  const { account } = useAccount({ rdt })

  const terms: any = {
    title: 'Your Agreement',
    description: 'Incididunt occaecat nisi dolore Lorem reprehenderit anim ullamco labore sint officia ullamco sunt cupidatat excepteur.\n\nEt pariatur qui nisi laborum et nulla ipsum in ad adipisicing do nostrud pariatur. Consequat occaecat nulla sunt nulla eiusmod quis.',
    created_at: '2023-12-27T17:55:26.0000Z',
    modified_at: '2024-01-10T08:43:10.0000Z'
  }

  return (
    <>
      <MainTitle
        title={`About`}
        userName={account && account.address}
        userImage={account && account.avatar}
        userRole={account && account.role}
      >
        {sessionStorage.getItem("arcane-alert-status")?.toLocaleLowerCase() ===
          "success" && (
          <Alert
            variant="success"
            icon="/icon/check-circle.svg"
            duration={5}
            source="arcane-alert-message"
          />
        )}
        {sessionStorage.getItem("arcane-alert-status")?.toLocaleLowerCase() ===
          "error" && (
          <Alert
            variant="error"
            icon="/icon/alert-circle.svg"
            duration={5}
            source="arcane-alert-message"
          />
        )}
      </MainTitle>

      <Card className="my-8">
        <div className="border-b-2 border-dashed border-gray-300 mb-8 pb-8">
          <h2 className="text-xl font-maven-pro font-semibold mb-4 last:mb-0">Welcome</h2>
          <p className="mb-3 last:mb-0">Officia anim sit nostrud duis occaecat consectetur. Deserunt reprehenderit tempor amet sint fugiat incididunt nostrud. Minim quis laboris quis proident esse. Et aliqua reprehenderit consectetur fugiat est officia adipisicing exercitation voluptate cupidatat adipisicing qui consectetur. In deserunt do exercitation quis incididunt dolor deserunt anim.</p>
          <p className="mb-3 last:mb-0">Aute amet sit est qui incididunt labore nisi magna incididunt. Irure elit ipsum tempor sit labore eiusmod veniam qui pariatur do laboris. Officia tempor velit irure aute ut id labore aliqua est est pariatur voluptate amet.</p>
        </div>
        <div>
          <h2 className="text-xl font-maven-pro font-semibold mb-4 last:mb-0">Token Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
            <div className="md:col-span-1 bg-gray-100 rounded-lg py-3 px-4">
              <span className="text-sm">Name</span>
              <h3 className="font-maven-pro font-semibold">Arcane Labyrinth</h3>
            </div>
            <div className="md:col-span-1 bg-gray-100 rounded-lg py-3 px-4">
              <span className="text-sm">Symbol</span>
              <h3 className="font-maven-pro font-semibold">ARC</h3>
            </div>
            <div className="md:col-span-1 bg-gray-100 rounded-lg py-3 px-4">
              <span className="text-sm">Network</span>
              <h3 className="font-maven-pro font-semibold">RadixDLT</h3>
            </div>
            <div className="md:col-span-1 bg-gray-100 rounded-lg py-3 px-4">
              <span className="text-sm">Total Supply</span>
              <h3 className="font-maven-pro font-semibold">100.000.000</h3>
            </div>
            <div className="md:col-span-2">
              <Link href="/">
                <Button type="button" variant="light" loading="none">
                  <div className="flex gap-2 sm:pl-4">
                    <span>{`Contract Address / RRI`}<br />
                    {`(Radix Resource Identifier)`}</span>
                    <Image
                      src="/icon/arrow-up-right.svg"
                      alt="icon"
                      className="inline -mt-px"
                      width={24}
                      height={24}
                      priority
                    />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <Card className="my-4">
        <div className="border-b-2 border-dashed border-gray-300 mb-5 pb-5">
          <h2 className="text-xl font-maven-pro font-semibold mb-4 last:mb-0">Terms & Conditions</h2>
        </div>
        {terms.description ?
          <div>
            <p className="text-primary-600 mb-6 last:mb-0">Last Update: {formatDate(terms.modified_at)}</p>
            <h3 className="font-maven-pro font-semibold text-lg md:text-xl mb-6 last:mb-0">{terms.title}</h3>
            <div className="mb-6 last:mb-0" dangerouslySetInnerHTML={{ __html: terms.description.replace(/\n/g, '<br>') }} />
          </div>
        :
          <div className="text-gray-400 italic">
            {`You don't have any Terms & Conditions yet.`}
          </div>
        }
      </Card>
    </>
  )
}