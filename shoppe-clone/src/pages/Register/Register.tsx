import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
import { getRules } from 'src/utils/validate'

export interface FormData {
  email?: string
  password?: string
  confirm_password?: string
}
const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>()
  const rules = getRules(getValues)

  const onHandleSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div className='bg-orange'>
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
                rules={rules.email}
              />
              <Input
                type='password'
                name='password'
                rules={rules.password}
                className='mt-3'
                placeholder='Password'
                errorMessage={errors && errors.password?.message}
                register={register}
              />
              <Input
                type='password'
                name='confirm_password'
                rules={rules.confirm_password}
                className='mt-3'
                placeholder='confirm_password'
                errorMessage={errors && errors.confirm_password?.message}
                register={register}
              />
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng Ký
                </button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center'>
                  <span className='text-gray-400'>Bạn đã có tài khoản! </span>
                  <Link to='/login' className='text-red-400'>
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
