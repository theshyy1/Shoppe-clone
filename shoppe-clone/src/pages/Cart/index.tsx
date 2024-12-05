import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PurchaseAPI from 'src/api/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { PurchaseStatus } from 'src/constants/purchase'
import { ExtendedPurchases, Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/ultils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'

const Cart = () => {
  const location = useLocation()
  const purchaseIdFromDetail = (location.state as { purchaseId: string | null })?.purchaseId
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['get-purchases', { status: PurchaseStatus.inCart }],
    queryFn: () => PurchaseAPI.getPurchases({ status: PurchaseStatus.inCart })
  })

  const updatePurchasesMutation = useMutation({
    mutationFn: PurchaseAPI.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: PurchaseAPI.deletePurchase,
    onSuccess: (data) => {
      toast.success(data.data.message)
      refetch()
    }
  })

  const buyProductsMutation = useMutation({
    mutationFn: PurchaseAPI.buyProducts,
    onSuccess: (data) => {
      toast.success(data.data.message)
      refetch()
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((p) => p.checked), [extendedPurchases])
  const purchasesChecked = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const purchasesCheckedCount = purchasesChecked.length
  const totalMoneyPay = useMemo(
    () => purchasesChecked.reduce((total, purchase) => total + purchase.buy_count * purchase.price, 0),
    [purchasesChecked]
  )
  const totalMoneySaving = useMemo(
    () =>
      purchasesChecked.reduce(
        (total, purchase) => total + purchase.buy_count * (purchase.price_before_discount - purchase.price),
        0
      ),
    [purchasesChecked]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isPurchasedFromProductDetail = purchaseIdFromDetail === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isPurchasedFromProductDetail || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
    return () => {
      history.replaceState(null, '')
    }
  }, [purchasesInCart, purchaseIdFromDetail])

  const onHandleChangePurchase = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) => {
      return prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    })
  }

  const handleChangeQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[purchaseIndex]
      updatePurchasesMutation.mutate({ product_id: purchase.product._id, buy_count: value })
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeletePurchases = () => {
    const purchaseIds = purchasesChecked.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleBuyProducts = () => {
    if (purchasesCheckedCount > 0) {
      const body = purchasesChecked.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <section className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-5'>
                    <input
                      type='checkbox'
                      onClick={handleCheckAll}
                      className='h-5 w-5 accent-orange'
                      checked={isAllChecked}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>.
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
            {extendedPurchases.length > 0 ? (
              <div className='my-3 rounded-sm shadow'>
                {extendedPurchases?.map((purchase: ExtendedPurchases, index) => (
                  <div
                    key={purchase.product._id}
                    className='grid items-center grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-black first:mt-0 mt-5'
                  >
                    <div className='col-span-6'>
                      <div className='flex items-center'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-5'>
                          <input
                            type='checkbox'
                            className='h-5 w-5 accent-orange'
                            checked={purchase.checked}
                            onChange={onHandleChangePurchase(index)}
                          />
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
                            onIncrease={(value) =>
                              handleChangeQuantity(index, value, value < purchase.product.quantity)
                            }
                            onDecrease={(value) => handleChangeQuantity(index, value, value > 1)}
                            onType={handleTypeQuantity(index)}
                            onFocusOut={(value) =>
                              handleChangeQuantity(
                                index,
                                value,
                                value > 1 &&
                                  value < purchase.product.quantity &&
                                  value !== (purchasesInCart as Purchase[])[index].buy_count
                              )
                            }
                            disabled={purchase.disabled}
                          />
                        </div>
                        <div className='col-span-1'>
                          <span className='text-orange'>đ{formatCurrency(purchase.price * purchase.buy_count)}</span>
                        </div>
                        <div className='col-span-1'>
                          <button
                            onClick={handleDelete(index)}
                            className='bg-none text-black transition-colors hover:text-orange'
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='max-w-full flex justify-center my-3 rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
                <div className='flex h-[400px] w-[400px] flex-col items-center justify-center p-2'>
                  <img
                    src='https://picsum.photos/300/300'
                    className='rounded-full object-cover h-32 w-32'
                    alt='No product'
                  />
                  <div className='mt-3 text-base'>Chưa có sản phẩm</div>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className='sticky bottom-0 z-10 bg-white flex flex-col rounded-sm p-5 shadow border border-gray-100 sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-orange'
                checked={isAllChecked}
                onClick={handleCheckAll}
              />
            </div>
            <button className='bg-none mx-3 border-none'>Chọn tất cả ( {purchasesCheckedCount} )</button>
            <button className='bg-none mx-3 border-none' onClick={handleDeletePurchases}>
              Xoá
            </button>
          </div>
          <div className='sm:ml-auto flex flex-col sm:flex-row sm:items-center mt-5 sm:mt-0'>
            <div className=''>
              <div className='flex items-center sm:justify-end'>
                <div className=''>Tổng thanh toán ({purchasesCheckedCount} sản phẩm )</div>
                <div className='ml-2 text-2xl text-orange'>đ{formatCurrency(totalMoneyPay)}</div>
              </div>
              <div className='flex items-center sm:justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>đ{formatCurrency(totalMoneySaving)}</div>
              </div>
            </div>
            <Button
              onClick={handleBuyProducts}
              className='h-10 w-52 bg-orange hover:bg-orange/70 text-white sm:ml-4 sm:mt-0 mt-3 flex items-center justify-center text-sm uppercase'
              disabled={buyProductsMutation.isPending}
            >
              Mua hàng
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Cart
