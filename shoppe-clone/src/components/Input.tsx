import React from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  name: string
  type: React.HTMLInputTypeAttribute
  placeholder?: string
  register: UseFormRegister<any>
  errorMessage?: string
  className?: string
  rules?: RegisterOptions
}

const Input = ({ type, placeholder, register, errorMessage, name, className, rules }: Props) => {
  return (
    <div className={className}>
      <input
        type={type}
        {...register(name, rules)}
        className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
        placeholder={placeholder}
      />
      <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errorMessage}</div>
    </div>
  )
}

export default Input
