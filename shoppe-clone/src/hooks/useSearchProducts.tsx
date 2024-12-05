import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { formSchema, formSchemaType } from 'src/utils/validate'

type FormData = Pick<formSchemaType, 'name'>
const searchSchema = formSchema.pick(['name'])

const useSearchProducts = () => {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(searchSchema)
  })

  const onHandleSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name as string
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name as string
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return {
    onHandleSearch,
    register
  }
}

export default useSearchProducts
