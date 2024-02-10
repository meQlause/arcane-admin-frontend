import React, { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

type TabProps = {
  id: string
  label: string
  children: ReactNode
}

type TabsProps = {
  children: React.ReactNode
}

const Tab: React.FC<TabProps> = ({ id, label, children }) => {
  return <div data-id={id} data-label={label}>{children}</div>
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const foundIndex = React.Children.toArray(children).findIndex((child) => {
      const tab = child as React.ReactElement<TabProps>
      return tab.props.id === hash
    })

    if (foundIndex !== -1) {
      setActiveTab(foundIndex)
    }
  }, [children])

  const handleTabClick = (id: string, index: number) => {
    setActiveTab(index)
    router.push(`#${id}`)
  }

  const tabs = React.Children.map(children, (child, index) => {
    const tab = child as React.ReactElement<TabProps>
    const isActive = index === activeTab

    return (
      <button key={index} onClick={() => handleTabClick(tab.props.id, index)} type="button" className={`w-full md:w-fit font-medium whitespace-nowrap px-5 py-3 border-b-4 border-transparent text-gray-400 [&.active]:bg-primary-50 [&.active]:text-primary-600 [&.active]:border-primary-500 ${isActive ? 'active' : ''}`}>
        {tab.props.label}
      </button>
    )
  })

  const activeContent = React.Children.toArray(children)[activeTab]

  return (
    <div>
      <div className="max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white w-full flex gap-2 border-b border-gray-200 mb-5">{tabs}</div>
      <div>{activeContent}</div>
    </div>
  )
}

export { Tab, Tabs }