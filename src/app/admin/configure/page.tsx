"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { TableAddButton } from "@/components/common/Table/TableAddButton"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import {
  autoComplete,
  cn,
  isEmpty,
  onOptionSelected,
  shouldRenderComponent,
} from "@/utils/utils"
import { X } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

const dropDownType: IOption[] = [
  { id: 1, text: "CATEGORY" },
  { id: 2, text: "QUOTA" },
  // { id: 3, text: "COUNSELLING-TYPE" },
  // { id: 4, text: "STATE" },
  // { id: 5, text: "SEAT-YPE" },
  // { id: 6, text: "CATEGORY-YPE" },

]

export default function ConfigureDropdownPage() {
  const [configList, setConfigList] = useState<any[]>([])
  const [initialConfigList, setInitialConfigList] = useState<any[]>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<IOption | undefined>()
  const [buttonText, setButtonText] = useState("Save Changes")

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()

  const [updateMode, setUpdateMode] = useState<string>("")
  const { appState } = useAppState()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (selectedType) getData(selectedType.text)
  }, [selectedType])

  async function getData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure/get",
      params: { type },
    })
    if (res?.success) {
      setConfigList(res?.payload?.data || [])
      setInitialConfigList(res?.payload?.data || [])
    }
  }

  function addNewRow() {
    setConfigList((prev) => [{ id: null, text: "" }, ...prev])
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  function updateText(index: number, text: string) {
    setConfigList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text } : item)),
    )
  }

  async function onSubmit() {
    if (!selectedType) return

    const newEntries = configList.filter(
      (item) => item.id === null && item.text.trim() !== "",
    )
    if (newEntries.length === 0) return

    const res = await fetchData({
      url: "/api/admin/configure/add",
      method: "POST",
      data: newEntries.map((item) => ({
        type: selectedType.text,
        text: item.text.trim(),
      })),
    })

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      getData(selectedType.text)
    } else {
      showToast("error", "Failed to add options")
    }
  }

  async function updateData(id: number, newText: string) {
    if (!newText.trim()) return

    const res = await fetchData({
      url: "/api/admin/configure/update",
      method: "POST",
      data: { id, text: newText.trim() },
    })

    if (res?.success) {
      showToast("success", "Updated successfully")
      getData(selectedType!.text)
    }
  }

  function removeNewRow(index: number) {
    setConfigList((prev) => prev.filter((_, i) => i !== index))
  }

  async function deleteData() {
    if (!deleteId) return

    const res = await fetchData({
      url: "/api/admin/configure/delete",
      method: "POST",
      data: { id: deleteId },
    })

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      getData(selectedType!.text)
      setPopupOpen(false)
    } else {
      showToast("error", "Failed to delete")
    }
  }

  const isSaveDisabled =
    configList?.length === 0 ||
    configList?.some((item) => item.text.trim() === "") ||
    JSON.stringify(configList) === JSON.stringify(initialConfigList)

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Configure Dropdowns</Heading>

      <Card className="mt-4 p-6 min-h-80">
        <div className="w-full max-w-96">
          <SearchAndSelect
            name="dropDownType"
            label="Select Dropdown Type"
            placeholder="Select Dropdown Type"
            value={selectedType}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, () => {})
              setSelectedType(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={dropDownType}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, dropDownType, setOptions)
            }
            errors={errors}
          />
        </div>

        {shouldRenderComponent([selectedType], "AND") && (
          <form
            className="w-full max-w-[500px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="text-xl text-color-text mt-8 mb-4 flex items-center justify-between">
              {selectedType?.text} Options
              <TableAddButton title="Add More" onClick={addNewRow} />
            </div>

            {shouldRenderComponent(
              [isEmpty(configList), !appState.isLoading],
              "AND",
            ) && (
              <div className="text-color-subtext text-center mt-10 mb-2 w-full border border-color-border py-10">
                No options to show <br /> Please add some...
              </div>
            )}

            <ul
              ref={listRef}
              className="flex flex-col gap-3 w-full max-w-[500px] max-h-[calc(100vh-500px)] overflow-y-auto"
            >
              {configList?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-2 text-color-subtext py-2 mr-4 text-sm"
                >
                  <Input
                    name={String(index)}
                    placeholder="Enter here"
                    value={item.text}
                    setValue={setValue}
                    onChange={(e) => {
                      updateText(index, e.target.value)
                    }}
                    onFocus={(e) => {
                      if (item?.id) {
                        setUpdateMode(e.target.name)
                        if (buttonText === "Update Changes") return
                        setButtonText("Update Changes")
                      } else {
                        if (buttonText === "Save Changes") return
                        setButtonText("Save Changes")
                      }
                    }}
                    onBlur={() => {
                      if (item?.id) {
                        setUpdateMode("")
                        if (item.text !== initialConfigList?.[index]?.text)
                          updateData(item.id, item.text)
                      }
                    }}
                    control={control}
                    errors={errors}
                    wrapperClass={cn(
                      "w-full",
                      String(index) === updateMode && "z-[1001]",
                    )}
                  />

                  {item.id ? (
                    <X
                      className={cn(
                        "text-color-subtext hover:text-red-600 cursor-pointer border-none outline-none",
                        initialConfigList?.length === 1 && "opacity-50",
                      )}
                      size={20}
                      data-tooltip-id={
                        initialConfigList?.length === 1 ? "tooltip" : ""
                      }
                      data-tooltip-content="You Can't Delete the Last Option"
                      onClick={() => {
                        if (initialConfigList?.length === 1) return

                        setDeleteId(item.id)
                        setPopupOpen(true)
                      }}
                    />
                  ) : (
                    <X
                      className="text-color-subtext hover:text-red-600 cursor-pointer border-none outline-none"
                      size={20}
                      onClick={() => removeNewRow(index)}
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="flex mt-8 items-center justify-end mb-8">
              <Button className="py-2" type="submit" disabled={isSaveDisabled}>
                {buttonText}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {updateMode && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-[1000]"></div>
      )}

      <ConfirmationPopup
        isOpen={popupOpen}
        title="Are You Sure You Want To Delete?"
        text="This action cannot be undone."
        onClose={() => setPopupOpen(false)}
        onConfirm={deleteData}
      />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}

