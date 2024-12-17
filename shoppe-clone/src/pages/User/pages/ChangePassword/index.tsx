import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { UserAPI } from 'src/api/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/ultil.type'
import { isAxios422Error } from 'src/utils/ultils'
import { UserSchema, userSchema } from 'src/utils/validate'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const formData = userSchema.pick(['password', 'new_password', 'confirm_password'])

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(formData)
  })

  const updateProfileMutation = useMutation({
    mutationFn: UserAPI.updateProfile
  })

  const onHandleSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxios422Error<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data

        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <Helmet>
        <title>Đổi mật khẩu</title>
        <meta name='description' content='Nơi bạn có thể đổi lại mật khẩu tài khoản!' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí bảo thông tin hồ sơ để bảo vệ tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onHandleSubmit}>
        <div className='max-w-2xl mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Mật khẩu cũ</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                className='relative'
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.password?.message}
                register={register}
                name='password'
                type='password'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Mật khẩu mới</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                className='relative'
                classNameInput=' px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                placeholder='Mật khẩu mới'
                errorMessage={errors.new_password?.message}
                register={register}
                name='new_password'
                type='password'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Nhập lại mật khẩu</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                className='relative'
                classNameInput='  px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                placeholder='Nhập lại mật khẩu'
                errorMessage={errors.confirm_password?.message}
                register={register}
                type='password'
                name='confirm_password'
              />
            </div>
          </div>

          <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize ' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex h-9 items-center bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
