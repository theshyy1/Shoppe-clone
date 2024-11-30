import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import CategoryAPI from 'src/api/category.api'
import ProductAPI from 'src/api/product.api'
import Pagination from 'src/components/Pagination'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from 'src/pages/ProductList/AsideFilter'
import ProductItem from 'src/pages/ProductList/ProductItem'
import SortProductList from 'src/pages/ProductList/SortProductList'
import { IProductListConfig } from 'src/types/product.type'

export type QueryConfig = {
  [key in keyof IProductListConfig]: string
}
const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 20,
      sort_by: queryParams.sort_by,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )

  const { data: ProductData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => ProductAPI.getProducts(queryConfig as IProductListConfig),
    placeholderData: (keepPreviousData) => keepPreviousData
  })

  const { data: CategoryData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => CategoryAPI.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {ProductData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={CategoryData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={ProductData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {ProductData.data &&
                  ProductData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <ProductItem product={product} />
                    </div>
                  ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={ProductData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
