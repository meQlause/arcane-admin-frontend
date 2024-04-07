'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAccount } from "@/app/auth/account";
import { Card } from "@/app/components/card";
import { Checkbox, Fieldset, Input, InputFile, Radio, Textarea } from "@/app/components/form";
import { Button } from "@/app/components/button";
import { Popup, PopupBody, PopupFooter, PopupHeader } from "@/app/components/popup";
import { Alert } from "@/app/components/alert";
import { ProposalDetail } from "@/app/components/proposal";
import { formatDate } from "@/app/functions/datetime";
import { RTMGenerator } from "@/app/rtm_generator";
import { useWallet } from "@/app/auth/wallet";



export default function ProposalCreateMember({ rdt }: any) {
  const { account } = useAccount({ rdt })
  const { nft_id , access_token} = useWallet()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(false)
  const [votingOptions, setVotingOptions] = useState<Array<{ label: string }>>([])
  const [votingDuration, setVotingDuration] = useState('3')

  const defaultVoting = [
    {
      label: 'For'
    },
    {
      label: 'Againts'
    },
    {
      label: 'Abstain'
    }
  ]
  const [votingDefault, setVotingDefault] = useState(false)
  const [votingOption, setVotingOption] = useState('')
  const handleVotingDefault = () => {
    if ( votingDefault ) {
      setVotingDefault(false)
      setVotingOptions([])
    } else {
      setVotingDefault(true)
      setVotingOptions(defaultVoting)
    }
  }
  const handleVotingOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotingOption(e.target.value)
  }
  const handleVotingOptionAdd = () => {
    if (votingOption !== '') {
      setVotingOptions((prevOptions) => [
        ...prevOptions,
        {
          label: votingOption
        }
      ])
      setVotingOption('')
    }
  }
  const handleVotingOptionRemove = (index: number) => {
    setVotingOptions((prevOptions) => {
      const newOptions = [...prevOptions]
      newOptions.splice(index, 1)
      return newOptions
    })
  }
  const handleVotingOptionSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleVotingOptionAdd()
    }
  }

  const [showPopupBack, setShowPopupBack] = useState(false)
  const handleOpenPopupBack = () => {
    setShowPopupBack(true)
  }
  const handleClosePopupBack = () => {
    setShowPopupBack(false)
  }

  const [showPopupPhoto, setShowPopupPhoto] = useState(false)
  const [photoMessage, setPhotoMessage] = useState('')
  const [blobImage, setBlobImage] = useState<Blob[]>([])
  const handleClosePopupPhoto = () => {
    setShowPopupPhoto(false)
  }
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedBlobImages = blobImage.filter((_, i) => i !== indexToRemove)
    setBlobImage(updatedBlobImages)
  }
  const defaultDuration = [60, 3600, 86400, 259200] // 1 minute, 1 hour, 1 day, 3 days in seconds
  const options: any = { month: 'short', day: 'numeric', year: 'numeric' }
  const currentDate = new Date()
  const today = currentDate.toLocaleDateString('en-US', options)
  const getEndDate = (second: number) => {
    const endDate = new Date(currentDate.getTime() + second * 1000)
    return endDate.toLocaleDateString('en-US', options)
  }

  const [showPopupSubmit, setShowPopupSubmit] = useState(false)
  const handleOpenPopupSubmit = () => {
    setShowPopupSubmit(true)
  }
  const handleClosePopupSubmit = () => {
    setShowPopupSubmit(false)
  }

  const [agreement, setAgreement] = useState(true)
  const handleAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ( e.target.checked ) {
      setAgreement(false)
    } else {
      setAgreement(true)
    }
  }

  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const isFormFilled =
      title !== '' &&
      description !== '' &&
      votingOptions.length > 1 &&
      votingDuration !== ''
    setFilled(isFormFilled)
  }, [
    title,
    description,
    votingOptions,
    votingDuration
  ])

  const handleHistoryBack = () => {
    router.push('/proposal')
  }

  const [preview, setPreview] = useState(false)
  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },50)
  }
  const handleOpenPreview = () => {
    setPreview(true)
    scrollToTop()
  }
  const handleClosePreview = () => {
    setPreview(false)
    scrollToTop()
  }

  const [errorSubmit, setErrorSubmit] = useState(false)
  useEffect(() => {
    if (errorSubmit) setTimeout(() => setErrorSubmit(false),11000)
  },[errorSubmit])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const votes = votingOptions.map(vote => vote.label);
    const manifest = RTMGenerator.createVote(account?.address, nft_id, votes, 3)
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: manifest,
      message: 'Create New Proposal'
    })
    rdt.buttonApi.status$.subscribe((data:any) => {
      console.log(data);
    })
    // if (result.isErr()) {
    //   throw new Error("Error creating voting")
    // }
    // let startDate = new Date();
    // let endDate = new Date(startDate.getTime() + Number(votingDuration) * 1000); 
    // const photos : string[] = [];
    // for (let index = 0; index < blobImage.length; index++) {
    //   const value = blobImage[index];
    //   const pict = new FormData();
    //   pict.append("photo", value, index + "image" + "." + value.type.split('/')[1]);
    //   const res1 = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/upload-pict`,
    //     {
    //       method: 'POST',
    //       body: pict,
    //       headers: { 
    //         'Authorization': `Bearer ${access_token}`
    //       },
    //     }
    //   );
      
    //   if (res1.ok) {
    //     const text = await res1.text();
    //     console.log(text);
    //     photos.push(text);
    //   }
    // }
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/create-vote`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         'address' : account?.address, 
    //         'title': title, 
    //         'description': description, 
    //         'txId': result.value.transactionIntentHash, 
    //         'votes': votes,
    //         'photos': photos,
    //         'startDate': startDate.toISOString(),
    //         'endDate': endDate.toISOString(),
    //       }),
    //       headers: { 
    //         'content-type': 'application/json',
    //         'Authorization': `Bearer ${access_token}`
    //       },
    //     }
    // )

    if (!result.isErr()) {
      /* logic here when data is recorded on database */
      sessionStorage.setItem('arcane-alert-status','success') // primary, error, warning, success, info
      sessionStorage.setItem('arcane-alert-message','Proposal created successfully')
      router.push('/proposal')
    }

    if (result.isErr()) {
      /* logic here when data is failed storing on database */
      sessionStorage.setItem('arcane-alert-status','error') // primary, error, warning, success, info
      sessionStorage.setItem('arcane-alert-message','Proposal failed to be create')
      scrollToTop()
      setLoading(false)
      setShowPopupSubmit(false)
      setErrorSubmit(true)
    }
  }

  const terms: any = {
    title: 'Your Agreement',
    description: 'Incididunt occaecat nisi dolore Lorem reprehenderit anim ullamco labore sint officia ullamco sunt cupidatat excepteur.\n\nEt pariatur qui nisi laborum et nulla ipsum in ad adipisicing do nostrud pariatur. Consequat occaecat nulla sunt nulla eiusmod quis.',
    created_at: '2023-12-27T17:55:26.0000Z',
    modified_at: '2024-01-10T08:43:10.0000Z'
  }

  return (
    <>
      {account && (
        <>
          {errorSubmit &&
            <div className="relative z-10">
              <Alert variant="error" icon="/icon/alert-circle.svg" duration={10} source="arcane-alert-message" className="-mt-3 -mr-2" />
            </div>
          }

          <Card className={`!bg-primary-50 border border-primary-300 max-sm:px-3 max-sm:py-2 mt-2 mb-8 relative overflow-hidden ${preview && '!hidden'}`}>
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
                <h1 className="text-primary-800 text-3xl font-semibold font-maven-pro mb-3">Start your Proposal and get the Vote</h1>
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

          <form spellCheck="false" encType="multipart/form-data" onSubmit={handleFormSubmit}>
            <Card className={`my-8 ${preview && '!hidden'}`}>
              <Fieldset>
                <Input type={"text"} id={"proposal-title"} name={"proposal-title"} variant={"secondary"} showLabel={true} required={true} label={"Title"} placeholder={"Enter title here"} value={title} onChange={(e) => setTitle(e.target.value)} />
              </Fieldset>
              <Fieldset>
                <Textarea id={"proposal-description"} name={"proposal-description"} variant={"secondary"} showLabel={true} required={true} label={"Description"} placeholder={"Enter description here"} rows={7} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Fieldset>
              <Fieldset>
                <InputFile id={"proposal-photo"} name={"proposal-photo"} required={false} multiple={true} label={"Upload Photo"} description={"Maximum of 10 items of 2MB each, file format .png/.jpg/.jpeg"} accept={".png,.jpg,.jpeg"} maxSize={2} maxAmount={10} setStatus={setPhoto} setShowPopup={setShowPopupPhoto} setPopupMessage={setPhotoMessage} handleBlobImages={setBlobImage} handleRemoveImage={handleRemoveImage} />
                <Popup show={showPopupPhoto} backdropClose={true} handleClose={handleClosePopupPhoto}>
                  <PopupHeader variant={"error"} icon={"/icon/alert-circle.svg"}>
                    Upload photo failed
                  </PopupHeader>
                  <PopupBody>
                    {photoMessage}
                  </PopupBody>
                  <PopupFooter>
                    <Button type="button" variant="primary" loading="none" onClick={handleClosePopupPhoto}>Okay</Button>
                  </PopupFooter>
                </Popup>
              </Fieldset>
              <Fieldset>
                <span className="text-sm text-gray-500">Voting</span>
                <div className="border border-gray-200 bg-gray-50/50 p-6 rounded-xl flex flex-col md:flex-row lg:flex-col xl:flex-row gap-8 mt-2">
                  <div className="w-full relative">
                    <div className="absolute right-0 max-sm:[&_label]:hidden">
                      <span className="text-sm text-gray-500 mr-1.5 sm:hidden">Default</span>
                      <Checkbox label={"Use Default Voting"} id={"proposal-voting-default"} name={"proposal-voting-default"} revert={true} className="text-sm text-gray-500 !mr-1.5 [&+input]:mb-0" onChange={handleVotingDefault} />
                    </div>
                    <div>
                      <Input type={"text"} id={"proposal-voting-option"} name={"proposal-voting-option"} variant={"secondary"} showLabel={true} label={"Voting Option"} placeholder={"Enter option here"} value={votingOption} disabled={votingDefault} onChange={handleVotingOption} onKeyDown={handleVotingOptionSubmit} />
                    </div>
                    <Button type="button" variant="primary" loading="none" disabled={votingDefault} onClick={handleVotingOptionAdd} className="mt-4">Add option</Button>
                  </div>
                  <div className="min-w-[2px] h-auto bg-gray-200 hidden md:block lg:hidden xl:block"></div>
                  <div className="h-[2px] bg-gray-200 md:hidden lg:block xl:hidden"></div>
                  {votingOptions.length > 0 ?
                    <div className="grid gap-3 w-full h-fit">
                      {votingDefault ?
                        votingOptions.map((option, index) => (
                          <div key={index} className="font-maven-pro border border-gray-300 bg-white rounded-lg px-4 py-3">{option.label}</div>
                        ))
                      :
                        votingOptions.map((option, index) => (
                          <div key={index} className="font-maven-pro border border-gray-300 bg-white rounded-lg px-4 py-3">
                            <button
                              type="button"
                              className="float-right"
                              onClick={() => handleVotingOptionRemove(index)}
                            >
                              <Image
                                src="/icon/x.svg"
                                alt="icon"
                                width={24}
                                height={24}
                              />
                            </button>
                            <span>{option.label}</span>
                          </div>
                        ))
                      }
                    </div>
                  :
                    <div className="w-full text-center my-auto">
                      <div className="bg-white inline-block p-1 rounded-lg">
                        <Image 
                          src="/icon/plus.svg"
                          alt="icon"
                          className="opacity-50"
                          width={24}
                          height={24}
                        />
                      </div>
                      <p className="font-maven-pro text-lg font-medium my-2">Preview Option</p>
                      <p className="text-sm text-gray-600">Add options first by entering in the input field beside</p>
                    </div>
                  }
                </div>
              </Fieldset>
              <Fieldset>
                <span className="text-sm text-gray-500">Voting Duration</span>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
                  {defaultDuration.map((duration) => 
                    <Radio key={`proposal-voting-duration-${duration}`} id={`proposal-voting-duration-${duration}`} name={"proposal-voting-duration"} value={duration.toString()} onChange={(e) => setVotingDuration(e.target.value)} required={true}>
                      <p className="font-maven-pro text-lg -mb-1">
                        {duration < 60 ? `${duration} Second${duration > 1 ? 's' : ''}` :
                          duration < 3600 ? `${Math.floor(duration / 60)} Minute${Math.floor(duration / 60) > 1 ? 's' : ''}` :
                          duration < 86400 ? `${Math.floor(duration / 3600)} Hour${Math.floor(duration / 3600) > 1 ? 's' : ''}` :
                          duration < 172800 ? `${Math.round(duration / 24 / 3600)} Day${Math.round(duration / 24 / 3600) > 1 ? 's' : ''}` :
                          `${Math.floor(duration / 24 / 3600)} Day${Math.floor(duration / 24 / 3600) > 1 ? 's' : ''}`
                        }
                      </p>
                      <small className="opacity-50">{`Until ${getEndDate(duration)}`}</small>
                    </Radio>
                  )}
                </div>
              </Fieldset>
            </Card>

            {preview &&
              <>
                <ProposalDetail
                  id={`1`}
                  user_address={account.address}
                  user_role={account.role}
                  avatar={account.avatar}
                  title={title ? title : ''}
                  description={description ? description : ''}
                  ComponentAddress=""
                  photos={blobImage}
                  start={today}
                  end={getEndDate(Number(votingDuration))}
                  vote={votingOptions ? votingOptions : null}
                  handleBack={handleClosePreview}
                />
              </>
            }

            <Card className="my-4 md:flex">
              <div className="flex max-sm:flex-col sm:flex-wrap gap-4 md:ml-auto">
                <Button type="button" variant="secondary" loading="none" className={`md:w-fit ${preview && '!hidden'}`} onClick={handleOpenPreview}>Preview</Button>
                <Button type="button" variant="secondary" loading="none" className={`md:w-fit ${!preview && '!hidden'}`} onClick={handleClosePreview}>Exit Preview</Button>
                <Button type="button" variant="primary" loading="none" className="md:w-fit" disabled={!filled} onClick={handleOpenPopupSubmit}>Upload Proposal</Button>
              </div>
            </Card>

            <Popup show={showPopupSubmit} backdropClose={true} handleClose={handleClosePopupSubmit}>
              <PopupHeader variant={"primary"} icon={"/icon/alert-circle.svg"}>
                Terms & Conditions
              </PopupHeader>
              <PopupBody>
                <div className="text-sm font-medium text-primary-600 mb-3">Last Update: {formatDate(terms.modified_at)}</div>
                <h4 className="font-medium text-lg mb-3">{terms.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: terms.description.replace(/\n/g, '<br>') }} />
                <Fieldset className="mt-4">
                  <Checkbox label={"I agree with the Terms & Conditions"} id={"proposal-agreement"} name={"proposal-agreement"} revert={false} onChange={handleAgreement} />
                </Fieldset>
              </PopupBody>
              <PopupFooter>
                <Button type="button" variant="light" loading="none" className="md:w-fit" onClick={handleClosePopupSubmit}>Cancel</Button>
                <Button type="submit" variant="primary" loading={loading} disabled={agreement} className="md:w-fit">Upload Proposal</Button>
              </PopupFooter>
            </Popup>
          </form>
        </>
      )}
    </>
  )
}