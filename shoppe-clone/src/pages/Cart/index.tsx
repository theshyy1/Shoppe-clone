import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import PurchaseAPI from 'src/api/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { PurchaseStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/ultils'

const Cart = () => {
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['get-purchases', { status: PurchaseStatus.inCart }],
    queryFn: () => PurchaseAPI.getPurchases({ status: PurchaseStatus.inCart })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <section className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-5'>
                    <input type='checkbox' className='h-5 w-5 accent-orange' />
                  </div>
                  <div className='flex-grow text-black'>San pham</div>.
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid text-center grid-cols-5'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm shadow'>
              {purchasesInCart?.map((purchase: Purchase) => (
                <div
                  key={purchase.product._id}
                  className='grid items-center grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-black first:mt-0 mt-5'
                >
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-5'>
                        <input type='checkbox' className='h-5 w-5 accent-orange' />
                      </div>
                      <div className='flex-grow text-black'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                            className='h-20 w-20 flex-shrink-0'
                          >
                            <img src={purchase.product.image} alt={purchase.product.name} />
                          </Link>
                          <div className='flex-grow px-2 pt-1 pb-2'>
                            <Link
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              className='line-clamp-2'
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid text-center grid-cols-5'>
                      <div className='col-span-2'>
                        <div className='flex justify-center items-center'>
                          <span className='line-through text-gray-500 mr-4'>đ{purchase.price_before_discount}</span>
                          <span>đ{purchase.price}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          classNameWrapper='flex item-center justify-center'
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange'>đ{formatCurrency(purchase.price * purchase.buy_count)}</span>
                      </div>
                      <div className='col-span-1'>
                        <button className='bg-none text-black transition-colors hover:text-orange'>Xoa</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className='sticky bottom-0 z-10 bg-white flex flex-col rounded-sm p-5 shadow border border-gray-100 sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input type='checkbox' className='h-5 w-5 accent-orange' />
            </div>
            <button className='bg-none mx-3 border-none'>Chọn tất cả</button>
            <button className='bg-none mx-3 border-none'>Xoá</button>
          </div>
          <div className='sm:ml-auto flex flex-col sm:flex-row sm:items-center mt-5 sm:mt-0'>
            <div className=''>
              <div className='flex items-center sm:justify-end'>
                <div className=''>Tổng thanh toán (1 sản phẩm )</div>
                <div className='ml-2 text-2xl text-orange'>đ12333</div>
              </div>
              <div className='flex items-center sm:justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>đ1323232</div>
              </div>
            </div>
            <Button className='h-10 w-52 bg-orange hover:bg-orange/70 text-white sm:ml-4 sm:mt-0 mt-3 flex items-center justify-center text-sm uppercase'>
              Mua hàng
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Cart
