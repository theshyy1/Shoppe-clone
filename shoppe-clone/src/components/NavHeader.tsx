import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthAPI from 'src/api/auth.api'
import Popover from 'src/components/Popover'
import path from 'src/constants/path'
import { PurchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/ultils'

const NavHeader = () => {
  const queryClient = useQueryClient()
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const LogoutMutation = useMutation({
    mutationFn: AuthAPI.LogoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['get-purchases', { status: PurchaseStatus.inCart }] })
    }
  })
  const handleLogout = () => LogoutMutation.mutate()

  return (
    <div className='flex justify-end'>
      <Popover
        as='span'
        renderProp={
          <div className='bg-white text-black relative shadow-sm rounded-sm border border-gray-200'>
            <div className='flex flex-col py-2 px-3'>
              <button className='py-3 px-4 pr-24 pl-3 hover:text-orange'>Tiếng Việt</button>
              <button className='py-3 px-4 pr-24 pl-3 hover:text-orange'>Tiếng Anh</button>
            </div>
          </div>
        }
        className={'flex items-center py-1 hover:text-white/70 cursor-pointer'}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='size-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='px-1'>Tiếng Việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          as='section'
          className={'flex items-center py-1 hover:text-white/70 cursor-pointer ml-4'}
          renderProp={
            <div className='bg-white text-black relative shadow-sm rounded-sm border border-gray-200'>
              <div className='flex flex-col'>
                <Link to={path.profile} className='py-4 px-5 hover:text-orange hover:bg-gray-'>
                  Tài khoản của tôi
                </Link>
                <Link to={path.cart} className='py-4 px-5 hover:text-orange hover:bg-gray-100'>
                  Đơn mua
                </Link>
                <button onClick={handleLogout} className='py-4 px-5 hover:text-orange hover:bg-gray-100 text-left'>
                  Đăng xuất
                </button>
              </div>
            </div>
          }
        >
          <div className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-4'>
            <div className='w-5 h-5 mr-2 flex-shrink-0'>
              <img src={getAvatarUrl(profile?.avatar)} className='w-full h-full object-cover rounded-full' />
            </div>
            <div className=''>
              <span>{profile?.email}</span>
            </div>
          </div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70 cursor-pointer'>
            Đăng ký
          </Link>
          <div className='border-r-[1px] border-r-white/40  h-4' />
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70 cursor-pointer'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}

export default NavHeader
