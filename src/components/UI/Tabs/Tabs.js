/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
/**
 * Simple tabs component that uses Tailwind
 */
export default function Tabs({ tabs, firstActiveTab, onTabChange }) {
  const [activeTab, setActiveTab] = useState(firstActiveTab)
  const tabLinkClasses =
    'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm leading-5 focus:outline-none'
  const tabLinkActiveClasses =
    'border-indigo-500 text-indigo-600 focus:text-indigo-800 focus:border-indigo-700'

  const tabLinksInactiveClasses =
    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'

  const activeTabContent = tabs.find((t) => t.name === activeTab)

  return (
    <div>
      <div>
        <div className="sm:hidden">
          <select
            aria-label="Selected tab"
            className="form-select block w-full"
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value)
              onTabChange(e.target.value)
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.name}>
                {tab.title}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href="#"
                  className={`${tabLinkClasses} ${
                    activeTab === tab.name
                      ? tabLinkActiveClasses
                      : tabLinksInactiveClasses
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(tab.name)
                    onTabChange(tab.name)
                  }}
                >
                  {tab.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div>{activeTabContent.content}</div>
    </div>
  )
}
