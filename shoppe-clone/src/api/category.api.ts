import { ICategory } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/ultil.type'
import http from 'src/utils/http'

const url = '/categories'

const CategoryAPI = {
  getCategories: () => http.get<SuccessResponse<ICategory[]>>(url)
}

export default CategoryAPI
