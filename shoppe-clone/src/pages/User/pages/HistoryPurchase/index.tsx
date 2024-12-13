import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import PurchaseAPI from 'src/api/purchase.api'
import path from 'src/constants/path'
import { PurchaseStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/ultils'

const purchaseTabs = [
  { status: PurchaseStatus.all, name: 'All' },
  { status: PurchaseStatus.waitForConfirming, name: 'Confirming' },
  { status: PurchaseStatus.waitForGetting, name: 'Getting' },
  { status: PurchaseStatus.inProgress, name: 'InProgress' },
  { status: PurchaseStatus.delivered, name: 'Delivered' },
  { status: PurchaseStatus.cancelled, name: 'Canceled' }
]
const HistoryPurchase = () => {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || PurchaseStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['get-purchases', { status }],
    queryFn: () => PurchaseAPI.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const PurchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 justify-center items-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))
  return (
    <div>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{PurchaseTabsLink}</div>
      <div className=''>
        {purchasesInCart?.map((purchase) => (
          <div className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-600 shadow-sm' key={purchase._id}>
            <Link
              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
              className='flex'
            >
              <div className='flex-shrink-0'>
                <img className='h-20 w-20' src={purchase.product.image} alt={purchase.product.name} />
              </div>
              <div className='flex-grow ml-3 overflow-hidden'>
                <div className='truncate'>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>
              <div className='ml-3 flex-shrink-0'>
                <span className='truncate line-through text-gray-500 mr-4'>
                  {formatCurrency(purchase.price_before_discount)}đ
                </span>
                <span className='truncate text-orange'>{formatCurrency(purchase.price)}đ</span>
              </div>
            </Link>
            <div className='flex justify-end'>
              <div className=''>
                <span>Tổng tiền: </span>
                <span className='ml-4 truncate text-xl'>{formatCurrency(purchase.price * purchase.buy_count)}đ</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPurchase
