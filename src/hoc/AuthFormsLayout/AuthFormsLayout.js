import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthFormsLayout ({ children, title, onSubmit }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to={'/'}>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Aventum"
          />
        </Link>
        <h2 className="mt-6 text-center text-2xl leading-9 font-extrabold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    </div>
  )
}
