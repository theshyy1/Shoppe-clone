import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import RateStars from 'src/pages/ProductList/components/AsideFilter/RatingStar'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
import { ICategory } from 'src/types/category.type'
import { NoUndefinedField } from 'src/types/ultil.type'
import { formSchema, formSchemaType } from 'src/utils/validate'
import { ObjectSchema } from 'yup'

interface Props {
  categories: ICategory[]
  queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<formSchemaType, 'price_max' | 'price_min'>>
const priceSchema = formSchema.pick(['price_max', 'price_min'])

const AsideFilter = ({ categories, queryConfig }: Props) => {
  const { category } = queryConfig
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema as ObjectSchema<FormData>)
  })

  const onHandleSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange ': !category
        })}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6 fill-orange'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
          />
        </svg>
        <span className='ml-2'>Tất cả danh mục</span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <ul>
        {categories?.map((categoryItem) => {
          const isActiveCategory = categoryItem._id === category
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams(
                    omit({
                      ...queryConfig,
                      category: categoryItem._id
                    })
                  ).toString()
                }}
                className={classNames('relative px-2 ', {
                  'text-orange font-semibold': isActiveCategory
                })}
              >
                <svg
                  viewBox='0 0 4 7'
                  className={classNames(' h-2 w-2 absolute top-2 left-[-10px]', {
                    'fill-orange': isActiveCategory
                  })}
                >
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='flex items-center font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
          />
        </svg>

        <span className='ml-2'>Bộ lọc tìm kiếm</span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='my-5'>
        <div className=''>Khoảng giá</div>
        <form className='mt-2' onSubmit={onHandleSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              defaultValue=''
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='đ TỪ'
                  classNameError='hidden'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max')
                  }}
                />
              )}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='đ ĐẾN'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1rem] text-sm font-semibold text-center'>
            {errors.price_max?.message}
          </div>
          <Button className='bg-orange w-full text-white uppercase hover:bg-orange/80 px-3 py-2 flex justify-center items-center'>
            ÁP DỤNG
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>Đánh giá</div>
      <RateStars queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button
        onClick={handleRemoveAll}
        className='bg-orange w-full text-white uppercase hover:bg-orange/80 px-3 py-2 flex justify-center items-center'
      >
        Xoá tất cả
      </Button>
    </div>
  )
}

export default AsideFilter
