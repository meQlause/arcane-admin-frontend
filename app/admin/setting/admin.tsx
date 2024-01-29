'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card, CardOutline } from "@/app/components/card";
import { Fieldset, Input, InputImage, Select, Textarea } from "@/app/components/form";
import { Tab, Tabs } from "@/app/components/tab";
import { Button } from "@/app/components/button";
import { Popup, PopupBody, PopupFooter, PopupHeader } from "@/app/components/popup";
import { formatDate } from "@/app/functions/datetime";
import { Alert } from "@/app/components/alert";

export default function SettingAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })
  const profile: any = {
    username: account?.address,
    avatar: '/user/user-1.png',
    role: 'Admin'
  }

  const currentUrl = new URL(window.location.href)
  const isGeneral = currentUrl.hash.indexOf('#general') > -1
  const isMember = currentUrl.hash.indexOf('#member') > -1
  const isTerm = currentUrl.hash.indexOf('#term') > -1

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

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(searchKeyword)
  }
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const [addMemberAccount, setAddMemberAccount] = useState('')
  const [addMemberLoading, setAddMemberLoading] = useState(false)
  const [addMemberDisabled, setAddMemberDisabled] = useState(false)

  const handleAddMemberClick = async () => {
    setAddMemberLoading(true)
    setAddMemberDisabled(true)
    try {
      console.log("Button clicked, performing action...")
    } catch (error) {
      console.error("Error during action:", error)
    }
    setAddMemberLoading(false)
    setAddMemberDisabled(false)
  }
  const handleAddMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submitting...')
  }

  const optionsRole: any = [
    {
      value: 'admin',
      label: 'Admin'
    },
    {
      value: 'core',
      label: 'Core'
    },
    {
      value: 'moderator',
      label: 'Moderator'
    }
  ]
  const [currentOptionsRole, setCurrentOptionsRole] = useState('')
  const handleSelectRole = (value: string) => {
    setCurrentOptionsRole(value)
  }
  const [selectedRoles, setSelectedRoles] = useState<Array<any>>(optionsRole.map((option: any) => option.value))
  const handleSelectRoleChanges = (index: number, selectedRole: any) => {
    const updatedRoles: Array<string> = [...selectedRoles]
    updatedRoles[index] = selectedRole
    setSelectedRoles(updatedRoles)
  }

  const [showPopupRemove, setShowPopupRemove] = useState(false)
  const handleOpenPopupRemove = () => {
    setShowPopupRemove(true)
  }
  const handleClosePopupRemove = () => {
    setShowPopupRemove(false)
  }

  const [removeMemberAccount, setRemoveMemberAccount] = useState('')
  const handleRemoveMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submitting...')
  }

  const memberList: any = {
    members: [
      {
        id: '1',
        user: 'rdx1shb1412422216dba',
        role: 'Admin',
        avatar: '/user/user-1.png',
        created_at: '2023-12-27T17:55:26.0000Z',
        modified_at: '2023-12-27T17:55:26.0000Z'
      },
      {
        id: '2',
        user: 'yzp2lmc2445678901abc',
        role: 'Core',
        avatar: '/user/user-2.jpeg',
        created_at: '2023-12-28T17:55:26.0000Z',
        modified_at: '2023-12-28T17:55:26.0000Z'
      },
      {
        id: '3',
        user: 'qwe3njk3154321876xyz',
        role: 'Moderator',
        avatar: '/user/user-3.jpeg',
        created_at: '2024-01-04T17:55:26.0000Z',
        modified_at: '2024-01-10T08:43:10.0000Z'
      }
    ],
    pagination: {
      total: 1,
      current: 1,
      limit: 10
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
          <MainTitle
            title={`Setting`}
            userName={profile.username}
            userImage={profile.avatar}
            userRole={profile.role}
          >
            {isGeneral &&
              <Alert variant="success" icon="/icon/check-circle.svg" active={false}>
                Profile saved successfully
              </Alert>
            }
            {isMember &&
              <Alert variant="success" icon="/icon/check-circle.svg" active={false}>
                Member added successfully
              </Alert>
            }
            {isTerm &&
              <Alert variant="success" icon="/icon/check-circle.svg" active={false}>
                Terms & Conditions created successfully
              </Alert>
            }
          </MainTitle>

          <Card className="mb-4">
            <Tabs>
              <Tab label="General" id="general">
                <div className="mt-8 mb-4">
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
              <Tab label="Member" id="member">
                <div className="mt-8 mb-4">
                  <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
                    <h2 className="text-xl font-maven-pro font-semibold">Member</h2>
                  </div>
                  <CardOutline className="overflow-hidden">
                    <div className="flex md:items-center justify-between max-md:flex-col gap-4">
                      <h3 className="text-lg font-maven-pro font-semibold">List Member</h3>
                      <form spellCheck="false" className="w-full md:w-fit" onSubmit={handleSearch}>
                        <Fieldset className="relative">
                          <label htmlFor="search-member" className="absolute top-0 bottom-0 left-0 my-auto mx-3 h-fit opacity-50">
                            <Image
                              src="/icon/search-md.svg"
                              alt="icon"
                              width={24}
                              height={24}
                              priority
                            />
                            <span className="sr-only">Search</span>
                          </label>
                          <input type="text" id="search-member" name="search-member" placeholder="Search Member" className="w-full appearance-none rounded-xl py-3 pr-4 pl-11 text-gray-500 bg-gray-100 border-2 border-transparent placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default" onChange={handleSearchInput} />
                        </Fieldset>
                      </form>
                    </div>
                    <div className="max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white w-[calc(100%+3rem)] md:w-[calc(100%+3.5rem)] -mx-6 md:-mx-7 my-6">
                      <table className="w-full">
                        <thead className="text-sm font-maven-pro font-semibold text-gray-500">
                          <tr>
                            <th className="bg-gray-100 text-left border-y border-gray-300 py-5 pl-6 md:pl-7 pr-4">Member</th>
                            <th className="bg-gray-100 text-left border-y border-gray-300 py-5 px-4 w-[200px]">Role</th>
                            <th className="bg-gray-100 text-left border-y border-gray-300 py-5 pr-6 md:pr-7 pl-4 w-[150px] min-w-[150px]"><span className="sr-only">Action</span></th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberList?.members.map((item: any, index: number) => (
                            <tr key={item.id}>
                              <td className="border-y border-gray-300 py-4 pl-6 md:pl-7 pr-4">
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={item.avatar}
                                    alt="avatar"
                                    className="rounded-full object-cover min-w-[2.5rem] w-10 h-10 border border-gray-100"
                                    width={36}
                                    height={36}
                                  />
                                  <span className="truncate">{item.user}</span>
                                </div>
                              </td>
                              <td className="border-y border-gray-300 py-4 px-4">
                                <form spellCheck="false">
                                  <Select label={"Role"} id={`member-role-${index}`} name={`member-role-${index}`} showLabel={false} className={"!w-fit"} value={selectedRoles[index]} options={optionsRole} onChange={(e) => handleSelectRoleChanges(index, e.target.value)} />
                                </form>
                              </td>
                              <td className="border-y border-gray-300 py-4 pr-6 md:pr-7 pl-4">
                                <Button type="button" variant="light" className="border-transparent mx-auto !w-fit !px-3" onClick={handleOpenPopupRemove}>
                                  <span className="sr-only">Remove</span>
                                  <Image
                                    src="/icon/trash-01.svg"
                                    alt="icon"
                                    width={24}
                                    height={24}
                                  />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="border-y border-gray-300 py-4 pl-6 md:pl-7 pr-4">
                              <Input type={"text"} id={"add-member-account-editable"} name={"add-member-account-editable"} variant={"secondary"} showLabel={false} required={true} label={"Account"} placeholder={"Enter account here"} value={addMemberAccount} onChange={(e) => setAddMemberAccount(e.target.value)} />
                            </td>
                            <td className="border-y border-gray-300 py-4 px-4">
                              <Select label={"Role"} id={"add-member-role-editable"} name={"add-member-role-editable"} showLabel={false} className={"!w-fit"} value={currentOptionsRole} options={optionsRole} onChange={(e) => handleSelectRole(e.target.value)} />
                            </td>
                            <td className="border-y border-gray-300 py-4 pr-6 md:pr-7 pl-4">
                              <Button type={"button"} variant={"light"} className="!border-2 !py-2.5 !px-3 whitespace-nowrap" disabled={addMemberDisabled} loading={addMemberLoading} onClick={handleAddMemberClick}>
                                Add
                                <Image
                                  src="/icon/plus.svg"
                                  alt="icon"
                                  className="inline ml-1 pr-1 -mt-1"
                                  width={24}
                                  height={24}
                                  priority
                                />
                              </Button>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                      <form spellCheck="false" className="sr-only" onSubmit={handleAddMemberSubmit}>
                        <Fieldset>
                          <Input type={"text"} id={"add-member-account"} name={"add-member-account"} variant={"secondary"} showLabel={false} required={true} label={"Account"} placeholder={"Enter account here"} value={addMemberAccount} onChange={(e) => setAddMemberAccount(e.target.value)} />
                        </Fieldset>
                        <Fieldset>
                          <Select label={"Role"} id={"add-member-role"} name={"add-member-role"} showLabel={false} className={"!w-fit"} value={currentOptionsRole} options={optionsRole} onChange={(e) => handleSelectRole(e.target.value)} />
                        </Fieldset>
                        <Fieldset>
                          <Button type={"submit"} variant="primary">Add</Button>
                        </Fieldset>
                      </form>
                    </div>

                    <Popup show={showPopupRemove} backdropClose={true} handleClose={handleClosePopupRemove}>
                      <PopupHeader variant={"primary"} icon={"/icon/alert-circle.svg"} />
                      <PopupBody>
                        <h3 className="text-xl font-semibold mb-4">Are you sure to delete user?</h3>
                        <p>Make sure your choice is correct.</p>
                      </PopupBody>
                      <PopupFooter>
                        <Button type="button" variant="light" loading="none" className="md:w-fit" onClick={handleClosePopupRemove}>Cancel</Button>
                        <form spellCheck="false" onSubmit={handleRemoveMemberSubmit}>
                          <Input type={"text"} id={"remove-member-account"} name={"remove-member-account"} variant={"secondary"} showLabel={false} required={true} label={"Account"} placeholder={"Enter account here"} value={removeMemberAccount} onChange={(e) => setRemoveMemberAccount(e.target.value)} className="sr-only" />
                          <Button type="submit" variant="primary" className="md:w-fit">Delete</Button>
                        </form>
                      </PopupFooter>
                    </Popup>
                  </CardOutline>
                </div>
              </Tab>
              <Tab label="Terms & Conditions" id="term">
                <div className="mt-8 mb-4">
                  <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8 flex justify-between max-md:flex-col gap-4">
                    <h2 className="text-xl font-maven-pro font-semibold w-full">Terms & Conditions</h2>
                    {terms ?
                      <Link href="/admin/setting/term/edit" className="md:w-fit md:whitespace-nowrap md:-mt-3">
                        <Button type={"button"} variant="secondary" loading="none">
                          Edit
                          <Image
                            src="/icon/edit-03.svg"
                            alt="icon"
                            className="filter-primary-600 inline ml-2 -mt-px md:mr-4"
                            width={24}
                            height={24}
                            priority
                          />
                        </Button>
                      </Link>
                    :
                      <Link href="/admin/setting/term/create" className="md:w-fit md:whitespace-nowrap md:-mt-3">
                        <Button type={"button"} variant="primary" loading="none">
                          Add Terms & Conditions
                          <Image
                            src="/icon/plus.svg"
                            alt="icon"
                            className="filter-white inline ml-1 -mt-px md:mr-4"
                            width={24}
                            height={24}
                            priority
                          />
                        </Button>
                      </Link>
                    }
                  </div>
                  <div>
                    <p className="text-primary-600 mb-6 last:mb-0">Last Update: {formatDate(terms.modified_at)}</p>
                    <h3 className="font-maven-pro font-semibold text-lg md:text-xl mb-6 last:mb-0">{terms.title}</h3>
                    <div className="mb-6 last:mb-0" dangerouslySetInnerHTML={{ __html: terms.description.replace(/\n/g, '<br>') }} />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Card>
        </>
      )}
    </>
  )
}