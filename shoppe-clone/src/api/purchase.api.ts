import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/ultil.type'
import http from 'src/utils/http'

const url = 'purchases'

const PurchaseAPI = {
  addToCart: (body: { product_id: string; buy_count: number }) => {
    return http.post<SuccessResponse<Purchase>>(`${url}/add-to-cart`, body)
  },
  getPurchases: (params: { status: PurchaseListStatus }) =>
    http.get<SuccessResponse<Purchase[]>>(url, {
      params
    }),
  buyProducts: (body: { product_id: string; buy_count: number }) => {
    return http.post<SuccessResponse<Purchase[]>>(`${url}/buy-products`, body)
  },
  updatePurchase: (body: { product_id: string; buy_count: number }) => {
    return http.put<SuccessResponse<Purchase>>(`/update-purchase`, body)
  },
  deletePurchase: (purchaseIds: string[]) => {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(url, {
      data: purchaseIds
    })
  }
}

export default PurchaseAPI
