import React from 'react'

type Button = {
  children: React.ReactNode;
  onClick: () => void;
}

const Button = ({ children, onClick }: Button) => {
  return (
    <button
      className='text-red-500 bg-gray-100 hover:cursor-pointer'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button