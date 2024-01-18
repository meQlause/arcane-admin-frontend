import React, { useState, ReactNode } from "react";

type TabProps = {
  label: string
  children: ReactNode
}

type TabsProps = {
  children: React.ReactNode
}

const Tab: React.FC<TabProps> = ({ label, children }) => {
  return <div data-label={label}>{children}</div>
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  const tabs = React.Children.map(children, (child, index) => {
    const tab = child as React.ReactElement<TabProps>
    const isActive = index === activeTab

    return (
      <button key={index} onClick={() => handleTabClick(index)} type="button" className={`w-full md:w-fit font-medium whitespace-nowrap px-5 py-3 border-b-4 border-transparent text-gray-400 [&.active]:bg-primary-50 [&.active]:text-primary-600 [&.active]:border-primary-500 ${isActive ? 'active' : ''}`}>
        {tab.props.label}
      </button>
    )
  })

  const activeContent = React.Children.toArray(children)[activeTab]

  return (
    <div>
      <div className="overflow-auto w-full flex gap-2 border-b border-gray-200 mb-5">{tabs}</div>
      <div>{activeContent}</div>
    </div>
  )
}

export { Tab, Tabs }