'use client'

import { useEffect, useState } from "react";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Fieldset, Input, InputImage, Textarea } from "@/app/components/form";
import { Tab, Tabs } from "@/app/components/tab";
import { Button } from "@/app/components/button";
import { Popup, PopupBody, PopupFooter, PopupHeader } from "@/app/components/popup";

export default function SettingAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })

  const avatarDefault = ''
  const nameDefault = ''
  const aboutDefault = ''
  const socialWebDefault = ''
  const socialTwitterDefault = ''
  const socialTelegramDefault = ''

  const [avatar, setAvatar] = useState(avatarDefault)
  const [name, setName] = useState(nameDefault)
  const [about, setAbout] = useState(aboutDefault)
  const [socialWeb, setSocialWeb] = useState(socialWebDefault)
  const [socialTwitter, setSocialTwitter] = useState(socialTwitterDefault)
  const [socialTelegram, setSocialTelegram] = useState(socialTelegramDefault)

  const [formGeneral, setFormGeneral] = useState(false)

  useEffect(() => {
    const isFormGeneralFilled =
      avatar !== avatarDefault ||
      name !== nameDefault ||
      about !== aboutDefault ||
      socialWeb !== socialWebDefault ||
      socialTwitter !== socialTwitterDefault ||
      socialTelegram !== socialTelegramDefault
    setFormGeneral(isFormGeneralFilled)
  }, [
    avatar,
    name,
    about,
    socialWeb,
    socialTwitter,
    socialTelegram
  ])

  const [showPopupAvatar, setShowPopupAvatar] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState('')
  const handleClosePopupAvatar = () => {
    setShowPopupAvatar(false)
  }

  const handleFormGeneralSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submitting...')
  }

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Setting`}
            userName={account.address}
            userImage={`/user/user-1.png`}
            userStatus={`Core`}
          />

          <Card className="mb-4">
            <Tabs>
              <Tab label="General">
                <div className="my-8">
                  <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
                    <h2 className="text-xl font-maven-pro font-semibold">General</h2>
                  </div>
                  <form spellCheck="false" onSubmit={handleFormGeneralSubmit}>
                    <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
                      <h3 className="text-lg font-maven-pro font-semibold mb-3">Profile</h3>
                      <Fieldset>
                        <InputImage id={"general-avatar"} name={"general-avatar"} required={true} accept={".png,.jpg,.jpeg"} defaultValue={avatarDefault} maxSize={2} setValue={setAvatar} setShowPopup={setShowPopupAvatar} setPopupMessage={setAvatarMessage} />
                        <Popup show={showPopupAvatar} backdropClose={true} handleClose={handleClosePopupAvatar}>
                          <PopupHeader variant={"error"} icon={"/icon/alert-circle.svg"}>
                            Upload photo failed
                          </PopupHeader>
                          <PopupBody>
                            {avatarMessage}
                          </PopupBody>
                          <PopupFooter>
                            <Button type="button" variant="primary" loading="none" onClick={handleClosePopupAvatar}>Okay</Button>
                          </PopupFooter>
                        </Popup>
                      </Fieldset>
                      <Fieldset>
                        <Input type={"text"} id={"general-name"} name={"general-name"} variant={"secondary"} showLabel={true} required={true} label={"Name"} placeholder={"Enter name here"} defaultValue={nameDefault} onChange={(e) => setName(e.target.value)} />
                      </Fieldset>
                      <Fieldset>
                        <Textarea id={"general-about"} name={"general-about"} variant={"secondary"} showLabel={true} required={true} label={"About"} placeholder={"Enter about here"} rows={5} defaultValue={aboutDefault} onChange={(e) => setAbout(e.target.value)} />
                      </Fieldset>
                    </div>
                    <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
                      <h3 className="text-lg font-maven-pro font-semibold mb-3">Social Accounts</h3>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <Fieldset className="!mb-0">
                          <Input type={"text"} id={"general-social-web"} name={"general-social-web"} variant={"secondary"} showLabel={true} required={true} label={"Website"} placeholder={"Enter address here"} icon={"/icon/language.svg"} defaultValue={socialWebDefault} onChange={(e) => setSocialWeb(e.target.value)} />
                        </Fieldset>
                        <Fieldset className="!mb-0">
                          <Input type={"text"} id={"general-social-twitter"} name={"general-social-twitter"} variant={"secondary"} showLabel={true} required={true} label={"Twitter"} placeholder={"Enter username here"} icon={"/icon/social-media-twitter.svg"} defaultValue={socialTwitterDefault} onChange={(e) => setSocialTwitter(e.target.value)} />
                        </Fieldset>
                        <Fieldset className="!mb-0">
                          <Input type={"text"} id={"general-social-telegram"} name={"general-social-telegram"} variant={"secondary"} showLabel={true} required={true} label={"Telegram"} placeholder={"Enter username here"} icon={"/icon/social-media-telegram.svg"} defaultValue={socialTelegramDefault} onChange={(e) => setSocialTelegram(e.target.value)} />
                        </Fieldset>
                      </div>
                    </div>
                    <div className="flex max-sm:flex-col sm:flex-wrap gap-4 md:ml-auto md:w-fit">
                      <Button type="submit" variant="primary" className="md:min-w-[160px]" disabled={!formGeneral}>Save</Button>
                    </div>
                  </form>
                </div>
              </Tab>
              <Tab label="Member">
                <div className="my-8">
                  <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
                    <h2 className="text-xl font-maven-pro font-semibold">Member</h2>
                  </div>
                  ...
                </div>
              </Tab>
              <Tab label="Terms & Conditions">
                <div className="my-8">
                  <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
                    <h2 className="text-xl font-maven-pro font-semibold">Terms & Conditions</h2>
                  </div>
                  ...
                </div>
              </Tab>
            </Tabs>
          </Card>
        </>
      )}
    </>
  )
}