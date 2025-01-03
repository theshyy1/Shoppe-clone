import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthAPI from 'src/api/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/ultil.type'
import { isAxios422Error } from 'src/utils/ultils'
import { formSchema, formSchemaType } from 'src/utils/validate'

const registerSchema = formSchema.pick(['email', 'password', 'confirm_password'])
type FormData = Pick<formSchemaType, 'email' | 'confirm_password' | 'password'>

const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: AuthAPI.registerAccount
  })

  const onHandleSubmit = handleSubmit((data) => {
    const body = omit(data, 'confirm_password')
    registerMutation.mutate(body, {
      onSuccess: ({ data }) => {
        toast.success(data.message, {
          delay: 1000
        })
        setIsAuthenticated(true)
        setProfile(data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxios422Error<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data

          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }

          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <Helmet>
        <title>Đăng ký | Shoppe Clone</title>
        <meta name='description' content='Đăng ký tài khoản' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onHandleSubmit} noValidate>
              <div className='text-2xl'>Đăng Ký</div>
              <Input
                type='email'
                name='email'
                register={register}
                className='mt-8'
                errorMessage={errors && errors.email?.message}
                placeholder='Email'
              />
              <Input
                type='password'
                name='password'
                className='mt-3'
                placeholder='Password'
                errorMessage={errors && errors.password?.message}
                register={register}
              />
              <Input
                type='password'
                name='confirm_password'
                className='mt-3'
                placeholder='confirm_password'
                errorMessage={errors && errors.confirm_password?.message}
                register={register}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  disabled={registerMutation.isPending}
                  isLoading={registerMutation.isPending}
                  className='w-full flex justify-center items-center text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng Ký
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center'>
                  <span className='text-gray-400'>Bạn đã có tài khoản! </span>
                  <Link to={path.login} className='text-red-400'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
