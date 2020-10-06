import React from 'react'
import Loader from '../Loader/Loader'

export const AppLoader = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-cool-gray-200 opacity-75"></div>
      </div>

      <Loader className="text-6xl text-gray-400 w-20" />
    </div>
  )
}

export default AppLoader
