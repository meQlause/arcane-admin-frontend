'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAccount } from "@/app/auth/account";
import { Card } from "@/app/components/card";
import { Fieldset, Textarea } from "@/app/components/form";
import { Button } from "@/app/components/button";
import { Popup, PopupBody, PopupFooter, PopupHeader } from "@/app/components/popup";

export default function TermEditAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })
  const router = useRouter()

  const descriptionDefault = 'Incididunt occaecat nisi dolore Lorem reprehenderit anim ullamco labore sint officia ullamco sunt cupidatat excepteur.\n\nEt pariatur qui nisi laborum et nulla ipsum in ad adipisicing do nostrud pariatur. Consequat occaecat nulla sunt nulla eiusmod quis.'

  const [description, setDescription] = useState(descriptionDefault)

  const [formTerm, setFormTerm] = useState(false)

  useEffect(() => {
    const isFormTermFilled =
      description !== descriptionDefault
    setFormTerm(isFormTermFilled)
  }, [
    description
  ])

  const [showPopupSave, setShowPopupSave] = useState(false)
  const handleOpenPopupSave = () => {
    setShowPopupSave(true)
  }
  const handleClosePopupSave = () => {
    setShowPopupSave(false)
  }

  const [showPopupBack, setShowPopupBack] = useState(false)
  const handleOpenPopupBack = () => {
    setShowPopupBack(true)
  }
  const handleClosePopupBack = () => {
    setShowPopupBack(false)
  }
  const handleHistoryBack = () => {
    router.push('/admin/setting#term')
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submitting...')
  }

  return (
    <>
      {account && (
        <>
          <Card className="!bg-primary-50 border border-primary-300 max-sm:px-3 max-sm:py-2 mt-2 mb-8 relative overflow-hidden">
            <div className="relative z-[1] flex gap-4 md:gap-8 max-md:flex-col px-2 pt-3 pb-4">
              <div>
                <Button type="button" variant="light" loading="none" className="!w-fit !p-2" onClick={handleOpenPopupBack}>
                  <Image
                    src="/icon/arrow-left.svg"
                    alt="icon"
                    className="filter-primary-600 min-w-[24px]"
                    width={24}
                    height={24}
                  />
                  <span className="sr-only">Back</span>
                </Button>
              </div>
              <div>
                <h1 className="text-primary-800 text-3xl font-semibold font-maven-pro mb-3">Edit Terms & Conditions</h1>
                <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien id purus feugiat lobortis eu eget dolor. Vivamus eleifend eget risus vel congue.</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-3/4 flex justify-between">
              <Image
                src="/icon/polygon-2.svg"
                alt="bg"
                className="w-auto h-full"
                width={100}
                height={100}
              />
              <Image
                src="/icon/polygon-3.svg"
                alt="bg"
                className="w-auto h-full max-md:hidden"
                width={100}
                height={100}
              />
            </div>

            <Popup show={showPopupBack} backdropClose={true} handleClose={handleClosePopupBack}>
              <PopupHeader variant={"primary"} icon={"/icon/alert-circle.svg"}>
                Are you sure to return into previous page?
              </PopupHeader>
              <PopupBody>
                <p>if you return to the previous page, the data you have entered will not be saved.</p>
              </PopupBody>
              <PopupFooter>
                <Button type="button" variant="light" loading="none" className="md:w-fit" onClick={handleClosePopupBack}>Cancel</Button>
                <Button type="button" variant="primary" loading="none" className="md:w-fit" onClick={handleHistoryBack}>Return to Previous Page</Button>
              </PopupFooter>
            </Popup>
          </Card>

          <form spellCheck="false" onSubmit={handleFormSubmit}>
            <Fieldset>
              <Textarea id={"term-description"} name={"term-description"} variant={"secondary"} showLabel={true} required={true} label={"Description"} placeholder={"Enter description here"} rows={7} defaultValue={descriptionDefault} onChange={(e) => setDescription(e.target.value)} />
            </Fieldset>
            <div className="flex max-sm:flex-col sm:flex-wrap gap-4 md:ml-auto md:w-fit">
              <Button type="button" variant="primary" className="md:min-w-[160px]" disabled={!formTerm} onClick={handleOpenPopupSave}>Save</Button>
            </div>

            <Popup show={showPopupSave} backdropClose={true} handleClose={handleClosePopupSave}>
              <PopupHeader variant={"primary"} icon={"/icon/alert-circle.svg"} />
              <PopupBody>
                <h3 className="text-xl font-semibold mb-4">Are you sure for terms & conditions?</h3>
                <p>Make sure you edit is correctly.</p>
              </PopupBody>
              <PopupFooter>
                <Button type="button" variant="light" loading="none" className="md:w-fit" onClick={handleClosePopupSave}>Cancel</Button>
                <Button type="submit" variant="primary" className="md:w-fit">Save</Button>
              </PopupFooter>
            </Popup>
          </form>
        </>
      )}
    </>
  )
}