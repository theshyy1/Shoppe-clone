import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
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

const loginSchema = formSchema.pick(['email', 'password'])
type FormData = Pick<formSchemaType, 'email' | 'password'>
const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: AuthAPI.LoginAccount
  })

  const onHandleSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: ({ data }) => {
        console.log('Login', data)
        toast.success(data.message)
        setIsAuthenticated(true)
        setProfile(data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxios422Error<ErrorResponse<FormData>>(error)) {
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
        <title>Đăng nhập | Shoppe Clone</title>
        <meta name='description' content='Đăng nhập vào trang web' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onHandleSubmit}>
              <div className='text-2xl'>Đăng Nhập</div>
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
              <div className='mt-3'>
                <Button
                  type='submit'
                  disabled={loginMutation.isPending}
                  isLoading={loginMutation.isPending}
                  className='w-full flex items-center justify-center text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center'>
                  <span className='text-gray-400'>Bạn có tài khoản chưa? </span>
                  <Link to={path.register} className='text-red-400'>
                    Đăng Ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        H
      </div>
    </div>
  )
}

export default Login
