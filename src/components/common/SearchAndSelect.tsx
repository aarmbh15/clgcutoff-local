
import { IOption } from "@/types/GlobalTypes"
import { ICommonComponentProps } from "@/types/GlobalTypes"
import { cn, debounce, isEmpty } from "@/utils/utils"
import { ChevronDown, Info } from "lucide-react"
import React, { SetStateAction, useEffect, useRef, useState } from "react"
import { Controller, FieldError } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import { SmallSpinner } from "./SmallSpinner"

interface SearchAndSelectProps extends ICommonComponentProps {
  className?: string
  options: IOption[]
  value: IOption | undefined
  labelNode?: React.ReactNode
  onChange: ({
    name,
    selectedValue,
  }: {
    name: string
    selectedValue: IOption
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
  labelClassName?: string
  loading?: boolean
}

// Global state to track open dropdowns
const openDropdowns: Set<string> = new Set()

// if (typeof window !== "undefined") {
//   window.addEventListener("beforeunload", () => {
//     openDropdowns.clear()
//   })
// }
export const SearchAndSelect = ({
  name,
  className,
  errors,
  required,
  label,
  labelNode,
  labelHint,
  labelTooltipIcon,
  options,
  onChange,
  loading,
  control,
  value,
  placeholder = "Start Typing...",
  onInputClear,
  minInputLengthToCallAPI = 0,
  debounceDelay = 500,
  searchAPI,
  defaultOption,
  setValue,
  labelClassName,
  ...props
}: SearchAndSelectProps) => {
  const [input, setInput] = useState(defaultOption ? defaultOption.text : "")
  const [optionListOpen, setOptionListOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<IOption>()
  const [listOptions, setListOptions] = useState(options)
  const [isLoading, setIsLoading] = useState(false)
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)
  const internalRef = useRef<HTMLDivElement>(null)
  const dropdownId = useRef(uuidv4()) // Unique ID for each dropdown
  // PROBLEM: This runs on server where window doesn't exist
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      openDropdowns.clear()
    })
  }

  // FIX: Move inside useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleBeforeUnload = () => {
        openDropdowns.clear()
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        internalRef.current &&
        !internalRef.current.contains(event.target as Node)
      ) {
        closeDropdown()
      }
    }

    // Close other dropdowns when this one opens
    if (optionListOpen) {
      // Close all other open dropdowns
      openDropdowns.forEach((id) => {
        if (id !== dropdownId.current) {
          const event = new CustomEvent("closeDropdown", { detail: { id } })
          window.dispatchEvent(event)
        }
      })
      openDropdowns.add(dropdownId.current)
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      openDropdowns.delete(dropdownId.current)
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      openDropdowns.delete(dropdownId.current)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [optionListOpen])

  // Listen for close events from other dropdowns
  useEffect(() => {
    function handleCloseDropdown(event: CustomEvent) {
      if (event.detail.id !== dropdownId.current && optionListOpen) {
        closeDropdown()
      }
    }

    window.addEventListener(
      "closeDropdown" as any,
      handleCloseDropdown as EventListener,
    )

    return () => {
      window.removeEventListener(
        "closeDropdown" as any,
        handleCloseDropdown as EventListener,
      )
    }
  }, [optionListOpen])

  const closeDropdown = () => {
    setOptionListOpen(false)
    setActiveOptionIndex(-1)
    openDropdowns.delete(dropdownId.current)
  }

  const toggleDropdown = () => {
    if (optionListOpen) {
      closeDropdown()
    } else {
      setInput("")
      setListOptions(options)
      setOptionListOpen(true)
      setIsLoading(false)
      setActiveOptionIndex(-1)
    }
  }

  useEffect(() => {
    if (!isEmpty(input) && input?.length >= minInputLengthToCallAPI) {
      setIsLoading(true)
    }
  }, [input, optionListOpen])

  useEffect(() => {
    setIsLoading(false)
    setActiveOptionIndex(-1)
  }, [listOptions])

  useEffect(() => {
    if (defaultOption?.text && isEmpty(value?.text)) {
      setValue(name, defaultOption)
      setSelectedValue(defaultOption)
      setInput(defaultOption.text)
      onChange({ name, selectedValue: defaultOption })
    }
  }, [defaultOption])

  useEffect(() => {
    if (isEmpty(value?.text) && isEmpty(defaultOption?.text)) {
      setInput("")
    } else if (isEmpty(value?.text) && !isEmpty(defaultOption?.text)) {
      setInput(defaultOption?.text || "")
    } else if (value?.text === "EMPTY") {
      setInput("")
      setSelectedValue(undefined)
    }
  }, [value])

  function isRequired() {
    return (required && !props?.disabled) || props?.forceRequired ? "*" : ""
  }

  function onInputChange(value: string) {
    setInput(value)

    if (value?.trim() === "") {
      onInputClear?.()
      setListOptions(options)
      setOptionListOpen(true)
      setActiveOptionIndex(-1)
      return
    }

    if (value?.length >= minInputLengthToCallAPI) {
      setOptionListOpen(true)
      debounce(searchAPI, debounceDelay)(value, setListOptions)
    }
  }

  function onOptionSelected(option: IOption, fieldOnChange: any) {
    onChange({ name, selectedValue: option })
    setSelectedValue(option)
    setInput(option.text)
    closeDropdown()
    fieldOnChange(option)
  }

  function isRulesRequired() {
    if (props?.forceRequired) {
      return true
    }

    return props?.disabled ? false : required
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    fieldOnChange: any,
  ) {
    if (!optionListOpen || isLoading || listOptions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveOptionIndex((prev) =>
        prev < listOptions.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveOptionIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && activeOptionIndex >= 0) {
      e.preventDefault()
      const selectedOption = listOptions[activeOptionIndex]
      if (selectedOption) {
        onOptionSelected(selectedOption, fieldOnChange)
      }
    } else if (e.key === "Escape") {
      closeDropdown()
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
            {label && (
              <div className="flex items-baseline gap-2">
                <label
                  className={cn(
                    "text-base pc:text-lg mb-[6px] block font-medium",
                    labelClassName,
                  )}
                >
                  {isRequired() + label}
                </label>

                {labelHint}
                {labelTooltipIcon}
              </div>
            )}

            {labelNode && <>{labelNode}</>}

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
              {loading ? (
                <div className="flex items-center gap-2 w-full">
                  <p className="text-[14px] font-[400]">Loading...</p>
                  <SmallSpinner />
                </div>
              ) : (
                <>
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
                        setActiveOptionIndex(-1)
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, field.onChange)}
                  />

                  <ChevronDown
                    className={cn(
                      "flex-shrink-0 text-color-text transition-transform duration-300 cursor-pointer h-5 w-5",
                      optionListOpen ? "rotate-180" : "",
                    )}
                    onClick={toggleDropdown}
                  />

                  {error && <Info className="flex-shrink-0 text-red-600" />}

                  {optionListOpen && (
                    <ListOptions
                      options={listOptions}
                      selectedValue={selectedValue}
                      fieldOnChange={field.onChange}
                      inputValue={input}
                      isLoading={isLoading}
                      onOptionSelected={onOptionSelected}
                      minInputLengthToCallAPI={minInputLengthToCallAPI}
                      displayIdToo={props?.displayIdToo}
                      listOptionClass={props?.listOptionClass}
                      activeOptionIndex={activeOptionIndex}
                      onClose={closeDropdown}
                    />
                  )}
                </>
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

export default SearchAndSelect

interface ListOptionsProps {
  selectedValue: IOption | undefined
  options: IOption[]
  onOptionSelected: (option: IOption, fieldOnChange: any) => void
  inputValue: string
  isLoading: boolean
  fieldOnChange: any
  minInputLengthToCallAPI: number
  displayIdToo?: boolean
  listOptionClass?: string
  activeOptionIndex: number
  onClose: () => void
}

function ListOptions({
  options,
  selectedValue,
  onOptionSelected,
  inputValue,
  isLoading,
  fieldOnChange,
  displayIdToo,
  minInputLengthToCallAPI,
  listOptionClass,
  activeOptionIndex,
  onClose,
}: ListOptionsProps) {
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
                  "cursor-pointer items-center gap-2 select-none text-color-text group hover:bg-color-accent hover:text-white w-full",
                  option?.text === selectedValue?.text && "text-color-accent",
                  index === activeOptionIndex && "bg-color-accent text-white",
                )}
                onClick={() => onOptionSelected(option, fieldOnChange)}
                onMouseEnter={() => {
                  /* Optional: Add hover highlight */
                }}
              >
                <p className="text-xs font-semibold py-2 px-7">{option.text}</p>
                {displayIdToo && (
                  <p
                    className={cn(
                      "text-xs px-7 text-[#8A8A8A] -mt-1 pb-2 group-hover:text-white/80",
                      index === activeOptionIndex && "text-white/80",
                    )}
                  >
                    {option?.id}
                  </p>
                )}
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

