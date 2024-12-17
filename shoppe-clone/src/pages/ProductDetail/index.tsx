import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { convert } from 'html-to-text'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductAPI from 'src/api/product.api'
import PurchaseAPI from 'src/api/purchase.api'
import QuantityController from 'src/components/QuantityController'
import RatingStar from 'src/components/RatingStar'
import path from 'src/constants/path'
import { PurchaseStatus } from 'src/constants/purchase'
import ProductItem from 'src/pages/ProductList/components/ProductItem'
import { IProduct, IProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, percentSale } from 'src/utils/ultils'

const ProductDetail = () => {
  const queryClient = useQueryClient()
  const [buyCount, setBuyCount] = useState(1)
  const imageRef = useRef<HTMLImageElement>(null)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['get-product', id],
    queryFn: () => ProductAPI.getProductDetail(id as string)
  })
  const product = data?.data.data
  const queryConfig: IProductListConfig = { page: '1', limit: '20', category: product?.category._id }

  const { data: ProductData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => ProductAPI.getProducts(queryConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation({
    mutationFn: PurchaseAPI.addToCart
  })

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const onHandleMouseEnter = (img: string) => {
    setActiveImage(img)
  }

  const nextImage = () => {
    if (currentIndexImages[1] < (product as IProduct)?.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prevImage = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const onHandleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    const { offsetX, offsetY } = event.nativeEvent

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const onHandleMouseLeave = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, {
            autoClose: 1500
          })
          queryClient.invalidateQueries({ queryKey: ['get-purchases', { status: PurchaseStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null
  return (
    <div className='bg-gray-300 py-6'>
      <Helmet>
        <title> {product.name} | Shoppe Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            wordwrap: 120
          })}
        />
      </Helmet>
      <div className='bg-white p-4'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden'
                onMouseMove={onHandleMouseMove}
                onMouseLeave={onHandleMouseLeave}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute pointer-events-none top-0 left-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1 overflow-hidden'>
                <button
                  onClick={prevImage}
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'
                    />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActiveImage = img === activeImage
                  return (
                    <div
                      className='relative w-full pt-[100%] shadow'
                      key={img}
                      onMouseEnter={() => onHandleMouseEnter(img)}
                    >
                      <img src={img} alt='' className='absolute top-0 left-0 h-full w-full bg-white object-cover' />
                      {isActiveImage && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  onClick={nextImage}
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium capitalize'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <RatingStar
                    rating={product.rating}
                    activeClassname='text-orange fill-orange w-4 h-4'
                    nonActiveClassname='text-gray-300 fill-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div className=''>
                  <span>{formatNumberToSocialStyle(product.sold)} </span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>đ {formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'> đ {formatCurrency(product.price)}</div>
                <span className='bg-orange text-white px-2 py-1 text-medium ml-3'>
                  {percentSale(product.price_before_discount, product.price) + '%'}
                  <span className='uppercase'> Giảm giá</span>
                </span>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500 mr-3'>Số lượng</div>
                <QuantityController
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-gray-300/90'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6 mr-2 fill-current stroke-orange text-orange'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className='flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none  hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8 bg-white p-4 shadow'>
        <div className='container'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize font-semibold italic text-slate-700'>
            Mô tả sản phẩm
          </div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            >
              {}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'></div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-2xl text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {ProductData && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
              {ProductData.data &&
                ProductData.data.data.products.slice(0, 12).map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <ProductItem product={product} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
