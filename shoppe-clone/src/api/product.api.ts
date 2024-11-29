import { IProduct, IProductList, IProductListConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/ultil.type'
import http from 'src/utils/http'

const url = '/products'

const ProductAPI = {
  getProducts: (params: IProductListConfig) => http.get<SuccessResponse<IProductList>>(url, { params }),
  getProductDetail: (id: string) => http.get<SuccessResponse<IProduct>>(`${url}/${id}`)
}

export default ProductAPI
