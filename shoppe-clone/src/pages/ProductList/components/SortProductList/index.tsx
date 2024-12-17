import classNames from 'classnames'
import omit from 'lodash/omit'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { orderBy, sortBy } from 'src/constants/product.filter'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
import { IProductListConfig } from 'src/types/product.type'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const page = Number(queryConfig.page)
  const navigate = useNavigate()

  const isActiveSort = (sortValue: Exclude<IProductListConfig['sort_by'], undefined>) => {
    return sortValue === sort_by
  }
  const handleSort = (sortValue: Exclude<IProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handelPriceOrder = (orderValue: Exclude<IProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <section className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div className=''>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.view),
              'bh-white text-black hover:bg-slate-100': !isActiveSort(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.createdAt),
              'bh-white text-black hover:bg-slate-100': !isActiveSort(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.sold),
              'bh-white text-black hover:bg-slate-100': !isActiveSort(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.price),
              'bh-white text-black hover:bg-slate-100': !isActiveSort(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) =>
              handelPriceOrder(event.target.value as Exclude<IProductListConfig['order'], undefined>)
            }
          >
            <option value='' disabled>
              Giá
            </option>
            <option value={orderBy.asc}>Từ Thấp đến cao</option>
            <option value={orderBy.desc}>Từ Cao đến thấp</option>
          </select>
        </div>
        <div className='flex items-center'>
          <div className=''>
            <span className='text-orange'>{page}</span>
            <span className=''>/ {pageSize}</span>
          </div>

          <div className='flex items-center justify-center ml-3'>
            {page === 1 ? (
              <button
                className={classNames('bg-gray-100 rounded px-3 py-2 shadow-sm mx-1 cursor-not-allowed border', {})}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </button>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className={classNames(
                  ' bg-white rounded px-3 py-2 shadow-sm mx-1 cursor-pointer border hover:bg-slate-300'
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <button className={classNames('bg-gray-100 rounded px-3 py-2 shadow-sm mx-1 cursor-not-allowed border')}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </button>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className={classNames(
                  ' bg-white rounded px-3 py-2 shadow-sm mx-1 cursor-pointer border hover:bg-slate-300'
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SortProductList
