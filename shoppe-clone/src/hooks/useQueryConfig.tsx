import { isUndefined, omitBy } from 'lodash'
import useQueryParams from 'src/hooks/useQueryParams'
import { IProductListConfig } from 'src/types/product.type'

export type QueryConfig = {
  [key in keyof IProductListConfig]: string
}

const useQueryConfig = () => {
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
  return queryConfig
}

export default useQueryConfig
