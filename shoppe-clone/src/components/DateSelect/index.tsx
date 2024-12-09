import { range } from 'lodash'
import { useEffect, useState } from 'react'

interface Props {
  errorMessage?: string
  onChange?: (value: Date) => void
  value?: Date
}

const DateSelect = ({ errorMessage, onChange, value }: Props) => {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      date: value?.getDate() || 1,
      month: value?.getMonth() || 0,
      year: value?.getFullYear() || 1990,
      [name]: Number(valueFromSelect)
    }

    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
      <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize '>Ngày sinh</div>
      <div className='sm:w-[80%] pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngay</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name='month'
            onChange={handleChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            value={value?.getMonth() || date.month}
          >
            <option disabled>Month</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            name='year'
            onChange={handleChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Year</option>
            {range(1990, 2030).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='sm:w-[80%]'>
          <div className="mt-1 text-red-600 min-h-[1rem] text-sm'">{errorMessage}</div>
        </div>
      </div>
    </div>
  )
}

export default DateSelect
