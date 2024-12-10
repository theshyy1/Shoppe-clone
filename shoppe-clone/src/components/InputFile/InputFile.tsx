import React, { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'

interface Props {
  onChange: (file?: File) => void
}

const maxSizeUploadAvatar = 1000000
const InputFile = ({ onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if ((fileFromLocal && fileFromLocal.size > maxSizeUploadAvatar) || !fileFromLocal?.type.includes('image')) {
      toast.error('Lỗi định dạng ảnh hoặc kích thước quá lớn!')
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }
  return (
    <Fragment>
      <input type='file' ref={fileInputRef} onChange={onFileChange} className='hidden' accept='.jpg, .png, .jpeg' />
      <button
        type='button'
        onClick={handleUpload}
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
      >
        Chọn ảnh
      </button>
    </Fragment>
  )
}

export default InputFile
