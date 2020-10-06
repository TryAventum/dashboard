import React from 'react'

const Header = ({ children, className, ...props }) => {
  return (
    <div
      className={`border-b border-gray-200 px-4 py-5 sm:px-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const Content = ({ children, className, ...props }) => {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

const Footer = ({ children, className, ...props }) => {
  return (
    <div
      className={`border-t border-gray-200 px-4 py-4 sm:px-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const Panel = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      className={`panel bg-white shadow rounded-lg ${className}`}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
})

Panel.Header = Header
Panel.Content = Content
Panel.Footer = Footer

export default Panel
