'use client'

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Fieldset, Textarea } from "@/app/components/form";
import { Button } from "@/app/components/button";

export default function DiscussionAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(searchKeyword)
  }
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const [chat, setChat] = useState(false)
  const [chatList, setChatList] = useState(true)
  const [chatDetail, setChatDetail] = useState(true)
  const [chatNew, setChatNew] = useState('')
  const [activeChat, setActiveChat] = useState<number | null>(null)

  const handleOpenChat = (index: number) => {
    setChat(true)
    setActiveChat(index)
    if ( window.innerWidth <= 768 ) {
      setChatDetail(true)
      setChatList(false)
    }
  }
  const handleCloseChat = () => {
    setActiveChat(null)
    setChatDetail(false)
    setChatList(true)
  }

  const [showInput, setShowInput] = useState(false)
  const handleIconClick = () => {
    setShowInput((prev) => !prev)
  }
  const handleInputBlur = () => {
    setShowInput(false)
  }

  const [attach, setAttach] = useState({
    blob: '',
    name: ''
  })
  const attachRef = useRef<any>(null)
  const handleAttach = (event: any) => {
    const file = event.target.files[0]

    if (file) {
      const blob = URL.createObjectURL(file)
      setAttach({
        blob: blob,
        name: file.name
      })
    }
  }
  const handleAttachRemove = () => {
    setAttach({
      blob: '',
      name: ''
    })
    if (attachRef.current) {
      attachRef.current.value = null;
    }
  }

  useEffect(() => {
    const handleWindowResize = () => {
      const isMobile = window.innerWidth <= 768
      if ( window.innerWidth > 768 ) {
        setChatList(!isMobile)
        setChatDetail(!isMobile)
      } else {
        setChatList(isMobile)
        setChatDetail(false)
      }
    }
    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const dataChat: any = [
    {
      id: 1,
      title: 'Tiera Forum',
      avatar: '/user/user-1.png',
      unread: 0,
      last_chat: {
        user: 'Michaela Verno',
        chat: 'So, how to convertion this variable',
      },
      is_typing: {
        user: ''
      }
    },
    {
      id: 2,
      title: 'Ethereum Link',
      avatar: '/user/user-1.png',
      unread: 3,
      last_chat: {
        user: 'Jackson Piere',
        chat: 'Thankyou guys for help me to',
      },
      is_typing: {
        user: ''
      }
    },
    {
      id: 3,
      title: 'Magic Square Discussion',
      avatar: '/user/user-1.png',
      unread: 27,
      last_chat: {
        user: 'Amonella Khan',
        chat: 'Nostrud magna incididunt voluptate ipsum pariatur commodo nulla sint ex.',
      },
      is_typing: {
        user: 'Celine Ambawan'
      }
    },
    {
      id: 4,
      title: 'New World',
      avatar: '',
      unread: 0,
      last_chat: {
        user: '',
        chat: '',
      },
      is_typing: {
        user: ''
      }
    }
  ]

  const dataChatSelected: any = {
    id: 3,
    title: 'Magic Square Discussion',
    avatar: '/user/user-1.png',
    member: 274
  }

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Discussion`}
            userName={account.address}
            userImage={`/user/user-1.png`}
            userStatus={`Core`}
          />

          <div className="grid md:grid-cols-10 xl:grid-cols-6 gap-6 max-md:mb-4">
            {chatList &&
              <Card className="md:col-span-4 xl:col-span-2 max-md:min-h-[calc(100vh-200px)] md:h-[calc(100vh-200px)] lg:h-[calc(100vh-130px)] !px-0">
                <form spellCheck="false" className="w-full px-4 mb-6" onSubmit={handleSearch}>
                  <Fieldset className="relative">
                    <label htmlFor="discussion-search-user" className="absolute top-0 bottom-0 left-0 my-auto mx-3 h-fit opacity-50">
                      <Image
                        src="/icon/search-md.svg"
                        alt="icon"
                        width={24}
                        height={24}
                        priority
                      />
                      <span className="sr-only">Search</span>
                    </label>
                    <input type="text" id="discussion-search-user" name="discussion-search-user" placeholder="Search" className="w-full appearance-none rounded-xl py-3 pr-4 pl-11 text-gray-500 bg-gray-100 border-2 border-transparent placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default" onChange={handleSearchInput} />
                  </Fieldset>
                </form>
                <div className="px-4 pb-6 overflow-auto max-h-[calc(100%-52px)]">
                  {dataChat.reverse().map((item: any) => (
                    <button type="button" key={item.id} className={`flex items-center gap-2 p-2 mb-4 last:mb-0 w-full text-left rounded-xl hover:bg-gray-100 [&.active]:bg-gray-100 ${item.id === activeChat && 'active'}`} title={item.title} onClick={() => handleOpenChat(item.id)}>
                      <Image 
                        src={item.avatar ? item.avatar : '/brand/logo.png'}
                        alt="avatar"
                        className="rounded-lg object-cover border border-gray-200"
                        width={44}
                        height={44}
                      />
                      <div className="w-full">
                        <div>
                          {item.unread > 0 &&
                            <div className="float-right text-xs px-2 py-1 ml-1 rounded-lg bg-error-100 text-error-600">{item.unread}</div>
                          }
                          <h3 className="font-maven-pro font-medium -mt-px break-all line-clamp-1">{item.title}</h3>
                        </div>
                        {item.is_typing.user ?
                          <p className="text-sm text-success-500 italic break-all line-clamp-1">{item.is_typing.user} typing...</p>
                        :
                          <>
                            {item.last_chat.user &&
                              <p className="text-sm text-gray-400 break-all line-clamp-1">{item.last_chat.user}: {item.last_chat.chat}</p>
                            }
                          </>
                        }
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            }

            {chatDetail &&
              <Card className="md:col-span-6 xl:col-span-4 relative overflow-auto">
                {chat ?
                  <>
                    {dataChatSelected &&
                      <div className="flex flex-col gap-6 h-full">
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="light" loading="none" className="!w-fit !p-2.5 aspect-square md:hidden" onClick={handleCloseChat}>
                            <Image
                              src="/icon/arrow-left.svg"
                              alt="icon"
                              className="filter-primary-600 min-w-[24px]"
                              width={24}
                              height={24}
                            />
                            <span className="sr-only">Back</span>
                          </Button>
                          <div className="grid grid-cols-5 lg:grid-cols-2 gap-4 relative w-full">
                            <div className={`max-lg:col-span-4 max-lg:py-1.5 flex items-center gap-2 ${showInput ? 'max-lg:opacity-0' : ''}`} title={`${dataChatSelected.title} (${dataChatSelected.member} Member${dataChatSelected.member > 1 && 's'})`}>
                              <Image 
                                src={dataChatSelected.avatar ? dataChatSelected.avatar : '/brand/logo.png'}
                                alt="avatar"
                                className="rounded-lg object-cover border border-gray-200"
                                width={44}
                                height={44}
                              />
                              <div className="w-full">
                                <h3 className="font-maven-pro font-medium -mt-px break-all line-clamp-1">{dataChatSelected.title}</h3>
                                <p className="text-sm text-gray-400 break-all line-clamp-1">{dataChatSelected.member} Member{dataChatSelected.member > 1 && 's'}</p>
                              </div>
                            </div>
                            <form spellCheck="false" className={`max-lg:col-span-1 w-full ${showInput ? 'max-lg:absolute' : 'max-lg:py-3.5 max-lg:my-3'}`} onSubmit={handleSearch}>
                              <Fieldset className="relative h-full">
                                <label htmlFor="discussion-search-chat" className={`absolute top-0 bottom-0 my-auto mx-3 h-fit opacity-50 lg:pointer-events-none ${showInput ? 'left-0' : 'max-lg:right-0 max-lg:cursor-pointer'}`} onClick={handleIconClick}>
                                  <Image
                                    src="/icon/search-md.svg"
                                    alt="icon"
                                    width={24}
                                    height={24}
                                    priority
                                  />
                                  <span className="sr-only">Search</span>
                                </label>
                                <input type="text" id="discussion-search-chat" name="discussion-search-chat" placeholder="Search" className={`w-full appearance-none rounded-xl py-3 pr-4 pl-11 text-gray-500 bg-gray-100 border-2 border-transparent placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default ${showInput ? 'lg:hidden' : 'max-lg:hidden'}`} onChange={handleSearchInput} onBlur={handleInputBlur} />
                              </Fieldset>
                            </form>
                          </div>
                        </div>

                        <div className="bg-gray-100 rounded-xl py-4 px-5 h-full relative overflow-auto max-h-[calc(100vh-332px)] max-md:min-h-[70vh]">
                          <p>Deserunt irure occaecat ut quis pariatur magna irure amet incididunt dolor.</p>
                          <div className="w-full h-full absolute top-0 left-0 opacity-70 bg-[length:300px]" style={{backgroundImage: 'url(/chat/shape.png)'}}></div>
                        </div>

                        <form spellCheck="false" className="flex items-end gap-4 mt-auto">
                          <Fieldset className="!mb-0 min-w-[56px]">
                            <label htmlFor="discussion-attach" className="flex items-center justify-center h-full p-3.5 mb-px rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100">
                              <input type="file" id="discussion-attach" name="discussion-attach" className="sr-only" ref={attachRef} onChange={handleAttach} />
                              <Image
                                src="/icon/link-01.svg"
                                alt="icon"
                                width={24}
                                height={24}
                                className="inline-block"
                              />
                            </label>
                          </Fieldset>
                          <Fieldset className="!mb-0 w-full">
                            {attach.blob &&
                              <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-gray-200 pr-3 mb-3">
                                <Image
                                  src={attach.blob}
                                  alt="attach"
                                  width={44}
                                  height={44}
                                  className="object-cover min-w-[44px]"
                                />
                                <div className="text-gray-400 text-xs italic break-all line-clamp-1 w-full">{attach.name}</div>
                                <button
                                  type="button"
                                  onClick={handleAttachRemove}
                                >
                                  <Image
                                    src="/icon/x.svg"
                                    alt="icon"
                                    width={24}
                                    height={24}
                                    className="min-w-[24px]"
                                  />
                                </button>
                              </div>
                            }
                            <Textarea id={"discussion-new-chat"} name={"discussion-new-chat"} variant={"secondary"} showLabel={false} required={true} label={"Chat"} placeholder={"Type a message"} className="max-h-[100px] !overflow-auto" rows={1} value={chatNew} onChange={(e) => setChatNew(e.target.value)} />
                          </Fieldset>
                          <Fieldset className="!mb-0 min-w-[120px]">
                            <Button type="submit" variant="primary" loading="none" className="!py-3.5 mb-px [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                              Send
                              <Image
                                src="/icon/send-01.svg"
                                alt="icon"
                                width={24}
                                height={24}
                                className="filter-white"
                              />
                            </Button>
                          </Fieldset>
                        </form>
                      </div>
                    }
                  </>
                :
                  <>
                    <div className="relative z-[1] flex flex-col items-center justify-center gap-2 w-full h-full text-center my-auto">
                      <div className="bg-primary-100 inline-block p-3 rounded-lg">
                        <Image 
                          src="/icon/message-chat-circle.svg"
                          alt="icon"
                          className="filter-primary-500"
                          width={36}
                          height={36}
                        />
                      </div>
                      <p className="font-maven-pro text-lg font-medium mt-1">Forum Discussion</p>
                      <p className="text-sm text-gray-600 mb-4">Send and Receive messages with other members</p>
                    </div>
                    <div className="w-full h-full absolute top-0 left-0 opacity-70 bg-[length:300px]" style={{backgroundImage: 'url(/chat/shape.png)'}}></div>
                  </>
                }
              </Card>
            }
          </div>
        </>
      )}
    </>
  )
}