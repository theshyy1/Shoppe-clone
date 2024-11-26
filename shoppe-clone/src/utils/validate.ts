import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    validate:
      typeof getValues === 'function'
        ? (value: any) => value === getValues('password') || 'Nhập lại password không khớp'
        : undefined
  }
})

// schema register <full>
export const formSchema = yup
  .object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Email không đúng định dạng')
      .min(8, 'Độ dài ít nhất 8 ký tự')
      .max(160, 'Độ dài nhiều nhất 160 ký tự'),
    password: yup
      .string()
      .required('Password là bắt buộc')
      .min(8, 'Độ dài ít nhất 8 ký tự')
      .max(160, 'Độ dài nhiều nhất 160 ký tự'),
    confirm_password: yup
      .string()
      .required('Confirn password là bắt buộc')
      .min(8, 'Độ dài ít nhất 8 ký tự')
      .max(160, 'Độ dài nhiều nhất 160 ký tự')
      .oneOf([yup.ref('password')], 'Nhập lại password không khớp')
  })
  .required()

export type formSchemaType = yup.InferType<typeof formSchema>

// schema login
export const loginSchema = formSchema.omit(['confirm_password'])
export type LoginSchemaType = yup.InferType<typeof loginSchema>
