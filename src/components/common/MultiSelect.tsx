import { IOption } from "@/types/GlobalTypes"
import { ICommonComponentProps } from "@/types/GlobalTypes"
import { cn, debounce, isEmpty } from "@/utils/utils"
import { ChevronDown, Info, X } from "lucide-react"
import React, { SetStateAction, useEffect, useRef, useState } from "react"
import { Controller, FieldError } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import { SmallSpinner } from "./SmallSpinner"

interface SearchAndSelectProps
  extends Omit<ICommonComponentProps, "defaultOption"> {
  className?: string
  options: IOption[]
  value: IOption[] | undefined
  defaultOption?: IOption[]
  onChange: ({
    name,
    selectedOptions,
  }: {
    name: string
    selectedOptions: IOption[]
  }) => void
  listClass?: string
  listOptionClass?: string
  onInputClear?: () => void
  displayIdToo?: boolean
  minInputLengthToCallAPI?: number
  debounceDelay?: number
  forceRequired?: boolean
  searchAPI: (
    text: string,
    setListOptions: React.Dispatch<SetStateAction<IOption[]>>,
  ) => void
}

export const MultiSelect = ({
  name,
  className,
  errors,
  required,
  label,
  labelHint,
  labelTooltipIcon,
  options,
  onChange,
  control,
  value,
  placeholder = "Start Typing...",
  onInputClear,
  minInputLengthToCallAPI = 0,
  debounceDelay = 500,
  searchAPI,
  defaultOption,
  setValue,
  ...props
}: SearchAndSelectProps) => {
  const [input, setInput] = useState("")
  const [optionListOpen, setOptionListOpen] = useState(false)
  const [listOptions, setListOptions] = useState(options)
  const [isLoading, setIsLoading] = useState(false)
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1) // New state for active option
  const internalRef = useRef(null)
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([])

  useEffect(() => {
    if (!isEmpty(input) && input?.length >= minInputLengthToCallAPI) {
      setIsLoading(true)
    }
  }, [input, optionListOpen])

  useEffect(() => {
    setIsLoading(false)
    setActiveOptionIndex(-1) // Reset active index when options change
  }, [listOptions])

  useEffect(() => {
    if (defaultOption && defaultOption?.length > 0) {
      setSelectedOptions(defaultOption)
    }
  }, [defaultOption])

  function isRequired() {
    return (required && !props?.disabled) || props?.forceRequired ? "*" : ""
  }

  function onInputChange(value: string) {
    setInput(value)

    if (value?.trim() === "") {
      onInputClear?.()
      setListOptions(options)
      setOptionListOpen(true)
      setActiveOptionIndex(-1) // Reset active index on input clear
      return
    }

    if (value?.length >= minInputLengthToCallAPI) {
      setOptionListOpen(true)
      debounce(searchAPI, debounceDelay)(value, setListOptions)
    }
  }

  function onOptionSelected(option: IOption, fieldOnChange: any) {
    setSelectedOptions((prevState) => {
      let updatedOptions = [...prevState]

      if (Boolean(updatedOptions.find((item) => item?.id === option?.id))) {
        updatedOptions = updatedOptions.filter(
          (item) => item?.id !== option?.id,
        )
      } else {
        updatedOptions.push(option)
      }

      onChange({ name, selectedOptions: updatedOptions })
      fieldOnChange(updatedOptions)

      return updatedOptions
    })

    setOptionListOpen(false)
  }

  function isRulesRequired() {
    if (props?.forceRequired) {
      return true
    }

    return props?.disabled ? false : required
  }

  // New keyboard event handler
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    fieldOnChange: any,
  ) {
    if (!optionListOpen || isLoading || listOptions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault() // Prevent page scrolling
      setActiveOptionIndex((prev) =>
        prev < listOptions.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault() // Prevent page scrolling
      setActiveOptionIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && activeOptionIndex >= 0) {
      e.preventDefault() // Prevent form submission
      const selectedOption = listOptions[activeOptionIndex]
      if (selectedOption) {
        onOptionSelected(selectedOption, fieldOnChange)
      }
    }
  }

  const error = errors?.[name] as FieldError | undefined

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRulesRequired() }}
      render={({ field }) => {
        return (
          <div className={cn("text-color-text", props?.wrapperClass)}>
            <div className="flex items-baseline gap-2">
              <label className="text-base pc:text-lg mb-[6px] block font-medium">
                {isRequired() + label}
              </label>

              {labelHint}
              {labelTooltipIcon}
            </div>

            <div
              className={cn(
                "relative flex justify-between items-center gap-2 w-full",
                "componentsBox",
                error && "border-red-600",
                props?.disabled
                  ? "bg-[#DCE5DD] border border-[#CCCCCC] cursor-not-allowed"
                  : "",
                props?.boxWrapperClass,
              )}
              ref={internalRef}
            >
              {selectedOptions?.length > 0 && (
                <div
                  className={cn(
                    "bg-color-accent-dark text-white text-xs px-2 py-1 rounded-[4px] flex-shrink-0 cursor-pointer flex items-center gap-2",
                    props?.disabled && "cursor-not-allowed opacity-70",
                  )}
                  onClick={() => {
                    if (props?.disabled) return
                    onChange({ name, selectedOptions: [] })
                    setSelectedOptions([])
                    setActiveOptionIndex(-1) // Reset active index on clear
                    field.onChange([])
                  }}
                >
                  <p>{selectedOptions?.length} Selected</p>
                  <X size={14} color="#fff" />
                </div>
              )}

              <input
                name={name}
                className={cn(
                  "flex focus:outline-none focus-visible:outline-none disabled:bg-[#DCE5DD] disabled:cursor-not-allowed",
                  "bg-color-white_black w-full font-[400] text-[14px]",
                  className,
                )}
                ref={field.ref}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={placeholder}
                disabled={props?.disabled}
                autoComplete="off"
                onFocus={() => {
                  if (input?.length >= minInputLengthToCallAPI) {
                    setInput("")
                    setListOptions(options)
                    setOptionListOpen(true)
                    setIsLoading(false)
                    setActiveOptionIndex(-1) // Reset active index on focus
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, field.onChange)} // Add keyboard event handler
              />

              <ChevronDown
                className={cn(
                  "flex-shrink-0 text-color-text transition-transform duration-300 focus-within:border-color-accent",
                  optionListOpen ? "rotate-180" : "",
                )}
                onClick={() => {
                  setInput("")
                  setListOptions(options)
                  setOptionListOpen((prev) => !prev)
                  setIsLoading(false)
                  setActiveOptionIndex(-1)
                }}
              />

              {error && <Info className="flex-shrink-0 text-red-600" />}

              {optionListOpen && (
                <ListOptions
                  options={listOptions}
                  selectedOptions={selectedOptions}
                  fieldOnChange={field.onChange}
                  inputValue={input}
                  isLoading={isLoading}
                  onOptionSelected={onOptionSelected}
                  minInputLengthToCallAPI={minInputLengthToCallAPI}
                  displayIdToo={props?.displayIdToo}
                  listOptionClass={props?.listOptionClass}
                  activeOptionIndex={activeOptionIndex} // Pass active index
                />
              )}
            </div>

            {error && (
              <p
                className={cn(
                  "text-sm mt-1 text-red-600 font-normal",
                  props?.errorClass,
                )}
              >
                {error?.message ? error?.message : `${label} is required!`}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}

export default MultiSelect

interface ListOptionsProps {
  selectedOptions: IOption[]
  options: IOption[]
  onOptionSelected: (option: IOption, fieldOnChange: any) => void
  inputValue: string
  isLoading: boolean
  fieldOnChange: any
  minInputLengthToCallAPI: number
  displayIdToo?: boolean
  listOptionClass?: string
  activeOptionIndex: number // New prop for active option
}

function ListOptions({
  options,
  selectedOptions,
  onOptionSelected,
  inputValue,
  isLoading,
  fieldOnChange,
  displayIdToo,
  minInputLengthToCallAPI,
  listOptionClass,
  activeOptionIndex,
}: ListOptionsProps) {
  function isChecked(id: string) {
    return !!selectedOptions?.find((option) => option.id === id)
  }

  return (
    <>
      {inputValue?.length >= minInputLengthToCallAPI ? (
        <div
          className={cn(
            "w-full absolute top-full translate-y-[1px] left-0 z-[999] overflow-y-auto overflow-x-hidden",
            "max-h-52",
            "bg-color-form-background border border-color-border rounded-sm",
            listOptionClass,
          )}
        >
          {!isLoading &&
            options?.map((option, index) => (
              <div
                key={uuidv4()}
                className={cn(
                  "cursor-pointer flex items-center gap-[10px] select-none text-color-text group hover:bg-color-accent hover:text-white w-full px-4 py-2",
                  index === activeOptionIndex && "bg-color-accent text-white", // Highlight active option
                )}
                onClick={() => {
                  onOptionSelected(option, fieldOnChange)
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked(option.id)}
                  className={cn(
                    "bg-mane-page-bg-color border-[#28553D] flex-shrink-0",
                    index === activeOptionIndex && "text-white", // Adjust checkbox for active option
                  )}
                  readOnly
                />

                <div className="space-y-2">
                  <p className="text-xs font-semibold">{option.text}</p>
                  {displayIdToo && (
                    <p
                      className={cn(
                        "text-xs text-[#8A8A8A] -mt-1 group-hover:text-white/80",
                        index === activeOptionIndex && "text-white/80", // Adjust text color for active option
                      )}
                    >
                      {option?.id}
                    </p>
                  )}
                </div>
              </div>
            ))}

          {options?.length === 0 && !isLoading && (
            <p className="text-xs font-semibold py-3 px-7">No results...</p>
          )}

          {isLoading && (
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold py-3 px-7">Loading...</p>
              <SmallSpinner />
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}

