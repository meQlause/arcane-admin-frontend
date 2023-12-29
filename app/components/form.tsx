import React, { ReactNode, FC, KeyboardEvent, MouseEventHandler, ChangeEvent, DragEvent, useState, CSSProperties, Dispatch } from "react";
import Image from "next/image";
import { truncateMiddle } from "@/app/functions/truncate";

type FieldsetProps = {
  children: ReactNode
  className?: string
}

export const Fieldset: FC<FieldsetProps> = ({ children, className }) => {
  return (
    <fieldset className={`mb-6 last:mb-0 ${className || ''}`}>
      {children}
    </fieldset>
  )
}

type InputProps = {
  label: string
  type: string
  id: string
  name: string
  placeholder?: string
  defaultValue?: string
  value?: string
  disabled?: boolean
  required?: boolean
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'secondary'
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
}

export function Input({label, type, id, name, placeholder, defaultValue, value, disabled, required, className, showLabel, variant, onChange, onKeyDown}: Readonly<InputProps>) {
  let variantStyle = "bg-white border border-gray-200 placeholder-gray-300"

  switch (variant) {
    case "secondary":
      variantStyle = "text-gray-700 bg-gray-100 border-transparent placeholder-gray-400"
      break
    default:
      break
  }

  return (
    <>
      <label htmlFor={id} className={`text-sm text-gray-500 ${!showLabel ? 'sr-only' : ''}`}>
        {label}
      </label>
      <input type={type} id={id} name={name} placeholder={placeholder} defaultValue={defaultValue} value={value} disabled={disabled} required={required} onChange={onChange} onKeyDown={onKeyDown} className={`w-full appearance-none rounded-xl py-3 px-4 ${!showLabel ? '' : 'mt-2'} border-2 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default read-only:bg-gray-100 read-only:cursor-default ${variantStyle} ${className ?? ''}`} />
    </>
  )
}

type InputFileProps = {
  label: string
  description: string
  id: string
  name: string
  placeholder?: string
  value?: string
  disabled?: boolean
  required?: boolean
  className?: string
  showLabel?: boolean
  multiple?: boolean
  accept?: string
  maxSize?: number
  maxAmount?: number
  setStatus: Dispatch<React.SetStateAction<boolean>>
  setShowPopup: Dispatch<React.SetStateAction<boolean>>
  setPopupMessage: Dispatch<React.SetStateAction<string>>
  handleBlobImages: Dispatch<React.SetStateAction<Blob[]>>
  handleRemoveImage: (index: number) => void
}

export function InputFile({label, description, id, name, value, disabled, required, className, showLabel, multiple, accept, maxSize, maxAmount, setStatus, setShowPopup, setPopupMessage, handleBlobImages, handleRemoveImage}: Readonly<InputFileProps>) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileStatus, setFileStatus] = useState(false)
  const [fileData, setFileData] = useState<{ fileNames: string[], blobImages: Blob[] }>({ fileNames: [], blobImages: [] })

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    const droppedFiles = event.dataTransfer.files
    handleFileUpload(droppedFiles)
  }

  const handleFileUpload = (selectedFiles: FileList | File[]) => {
    const files = Array.from(selectedFiles)
    const blobImages: Blob[] = []

    files.forEach((file) => {
      const blobImage = new Blob([file], { type: file.type })
      blobImages.push(blobImage)
    })

    if (blobImages.length > 0) {
      handleBlobImages(blobImages)
    }

    if (fileData.fileNames.length + files.length > Number(maxAmount)) {
      setPopupMessage(`The number of files exceeds the maximum limit of ${maxAmount} photo${Number(maxAmount) > 1 ? 's' : ''}.`)
      setShowPopup(true)
      return
    }

    const oversizedFiles = files.filter((file) => file.size > Number(maxSize) * 1024 * 1024)

    if (oversizedFiles.length > 0) {
      setPopupMessage(`Some files are too large. Maximum size is ${maxSize} MB.`)
      setShowPopup(true)
      return
    }

    setFileData((prevFileData) => ({
      fileNames: [...prevFileData.fileNames, ...files.map((file) => file.name)],
      blobImages: [...prevFileData.blobImages, ...blobImages],
    }))

    setFileStatus(true)
    setStatus(true)
  }

  const clearFileUpload = (indexToRemove: number) => {
    setFileData((prevFileData) => ({
      fileNames: prevFileData.fileNames.filter((_, index) => index !== indexToRemove),
      blobImages: prevFileData.blobImages.filter((_, index) => index !== indexToRemove),
    }))

    setFileStatus(fileData.fileNames.length > 1)
    setStatus(fileData.fileNames.length > 1)

    handleRemoveImage(indexToRemove)
  }

  return (
    <>
      <span className={`text-sm text-gray-500 ${!showLabel ? 'sr-only' : ''}`}>{label}</span>
      <label htmlFor={id} className={`group cursor-pointer ${!showLabel ? '' : 'mt-2'} ${className ?? ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input type="file" id={id} name={name} defaultValue={value} disabled={disabled} required={required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files!)} multiple={multiple} accept={accept} className="sr-only" />
        <div className={`border-2 border-dashed border-gray-200 group-hover:border-primary-500 p-6 rounded-xl text-center ${isDragging ? 'bg-primary-50 border-primary-500' : ''}`}>
          <div className={`inline-block p-1 rounded-lg ${fileStatus ? 'bg-success-100' : 'bg-primary-100'}`}>
            <Image 
              src={fileStatus ? "/icon/check-circle.svg" : "/icon/upload-cloud-02.svg"}
              alt="icon"
              className={fileStatus ? "filter-success-500" : "filter-primary-600"}
              width={24}
              height={24}
            />
          </div>
          <p className="font-maven-pro text-lg font-medium my-2">
            {fileStatus ? `Photo${fileData.fileNames.length > 1 ? 's' : ''} selected` : 'Upload photo here'}
          </p>
          <p className="text-sm text-gray-600">{description}</p>
          {fileStatus &&
            fileData.fileNames.map((fileName, index) => (
              <div key={index} className="bg-primary-100 px-4 py-3 rounded-lg text-left text-sm mt-4">
                <button type="button" className="float-right" onClick={() => clearFileUpload(index)}>
                  <Image 
                    src="/icon/x.svg"
                    alt="icon"
                    className=""
                    width={24}
                    height={24}
                  />
                </button>
                <Image 
                  src="/icon/file-02.svg"
                  alt="icon"
                  className="filter-primary-600 inline-block mr-2"
                  width={24}
                  height={24}
                />
                <span className="hidden sm:inline-block">{fileName}</span>
                <span className="sm:hidden">{truncateMiddle(fileName, 20)}</span>
              </div>
            ))
          }
        </div>
      </label>
    </>
  )
}

type SelectProps = {
  label: string
  id: string
  name: string
  options: OptionProps[]
  defaultValue?: string
  value?: string
  disabled?: boolean
  required?: boolean
  className?: string
  showLabel?: boolean
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

type OptionProps = {
  value: string
  label: string
}

export function Select({label, id, name, options, defaultValue, value, disabled, required, className, showLabel, onChange}: Readonly<SelectProps>) {
  return (
    <>
      <label htmlFor={id} className={`text-sm text-gray-500 ${!showLabel ? 'sr-only' : ''}`}>
        {label}
      </label>
      <select id={id} name={name} defaultValue={defaultValue} value={value} disabled={disabled} required={required} onChange={onChange} className={`w-full appearance-none rounded-xl py-2.5 pl-4 pr-9 ${!showLabel ? '' : 'mt-2'} bg-white border-2 border-gray-200 placeholder-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default cursor-pointer ${className ?? ''}`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

type TextareaProps = {
  label: string
  rows?: number
  cols?: number
  id: string
  name: string
  placeholder?: string
  defaultValue?: string
  value?: string
  disabled?: boolean
  required?: boolean
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'secondary'
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export function Textarea({label, rows = 3, cols, id, name, placeholder, defaultValue, value, disabled, required, className, showLabel, variant, onChange}: Readonly<TextareaProps>) {
  let variantStyle = "bg-white border-gray-200 placeholder-gray-300"

  switch (variant) {
    case "secondary":
      variantStyle = "text-gray-700 bg-gray-100 border-transparent placeholder-gray-400"
      break
    default:
      break
  }

  const [textareaValue, setTextareaValue] = useState<string>('');

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(event.target.value);
  }

  const getRows = () => {
    return textareaValue.split('\n').length;
  }

  const textareaStyle: CSSProperties = {
    minHeight: `calc(${rows * 1.5}rem + 2px)`,
    height: `calc(${getRows() * 1.5}rem + 1.75rem)`,
  }

  return (
    <>
      <label htmlFor={id} className={`text-sm text-gray-500 ${!showLabel ? 'sr-only' : ''}`}>
        {label}
      </label>
      <textarea rows={rows} cols={cols} id={id} name={name} defaultValue={defaultValue} value={value} placeholder={placeholder} disabled={disabled} required={required} onInput={handleTextareaChange} onChange={onChange} className={`w-full appearance-none rounded-xl py-3 px-4 ${!showLabel ? '' : 'mt-2'} border focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default read-only:bg-gray-100 read-only:cursor-default overflow-hidden resize-none ${variantStyle} ${className ?? ''}`} style={textareaStyle} />
    </>
  )
}

type CheckboxProps = {
  label: string
  id: string
  name: string
  disabled?: boolean
  required?: boolean
  checked?: boolean
  className?: string
  revert: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export function Checkbox({label, id, name, disabled, required, checked, className, revert, onChange}: Readonly<CheckboxProps>) {
  let defaultLabel = 'cursor-pointer'
  let defaultInput = 'cursor-pointer appearance-none rounded-md border border-gray-400 focus:border-primary-500 focus:ring-0 checked:bg-primary-600 checked:hover:bg-primary-600 checked:focus:bg-primary-600 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default read-only:bg-gray-100 read-only:cursor-default mb-[3px]'

  return (
    <>
      {revert ?
        <>
          <label htmlFor={id} className={`${defaultLabel} mr-2.5 ${className ?? ''}`}>
            {label}
          </label>
          <input type="checkbox" id={id} name={name} disabled={disabled} required={required} onChange={onChange} checked={checked} className={defaultInput} />
        </>
      :
        <>
          <input type="checkbox" id={id} name={name} disabled={disabled} required={required} onChange={onChange} checked={checked} className={defaultInput} />
          <label htmlFor={id} className={`${defaultLabel} ml-2.5 ${className ?? ''}`}>
            {label}
          </label>
        </>
      }
    </>
  )
}

type RadioProps = {
  children: ReactNode
  id: string
  name: string
  defaultValue?: string
  value?: string
  disabled?: boolean
  required?: boolean
  checked?: boolean
  className?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export function Radio({children, id, name, defaultValue, value, disabled, required, checked, className, onChange}: Readonly<RadioProps>) {
  return (
    <fieldset>
      <input type="radio" id={id} name={name} defaultValue={defaultValue} value={value} disabled={disabled} required={required} onChange={onChange} className={`sr-only peer`} checked={checked} />
      <label htmlFor={id} className={`relative block px-4 py-3 rounded-lg cursor-pointer border border-gray-200 lg:hover:bg-gray-100 ring-primary-400 peer-checked:ring-1 peer-checked:text-primary-800 peer-checked:bg-primary-100 peer-checked:border-primary-400 focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default read-only:bg-gray-100 read-only:cursor-default ${className ?? ''}`}>
        {children}
      </label>
    </fieldset>
  )
}