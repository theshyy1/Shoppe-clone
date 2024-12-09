import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { UserAPI } from 'src/api/user.api'
import Button from 'src/components/Button'
import DateSelect from 'src/components/DateSelect'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { saveProfileToLS } from 'src/utils/auth'
import { UserSchema, userSchema } from 'src/utils/validate'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'avatar' | 'date_of_birth'>

const profileSchema = userSchema.pick(['address', 'phone', 'name', 'avatar', 'date_of_birth'])

const ProfileUser = () => {
  const { setProfile } = useContext(AppContext)
  const { data: ProfileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: UserAPI.getProfile
  })

  const profile = ProfileData?.data.data
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1) // 1-1-1990
    },
    resolver: yupResolver(profileSchema)
  })

  const updateProfileMutation = useMutation({
    mutationFn: UserAPI.updateProfile
  })

  const onHandleSubmit = handleSubmit(async (data) => {
    await updateProfileMutation.mutateAsync(
      { ...data, date_of_birth: data.date_of_birth?.toISOString() },
      {
        onSuccess: ({ data: res }) => {
          setProfile(res.data)
          saveProfileToLS(res.data)
          toast.success(res.message)
          refetch()
        }
      }
    )
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  return (
    <div className='rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí bảo thông tin hồ sơ để bảo vệ tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onHandleSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Tên Đăng nhập</div>
            <div className='sm:w-[80%] pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Họ Và Tên</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Ten'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Số điện thoại</div>
            <div className='sm:w-[80%] pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Địa chỉ</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
                register={register}
                name='address'
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />
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
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img src='https://picsum.photos/100/100' className='w-full h-full rounded-full object-cover' alt='' />
            </div>
            <input type='file' className='hidden' accept='.jpg, .png, .jpeg' />
            <button
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
            >
              Chọn ảnh
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileUser
