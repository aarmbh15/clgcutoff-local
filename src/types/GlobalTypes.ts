import { ReactNode } from "react"
import { Control, FieldErrors, FieldValues, UseFormClearErrors, UseFormSetValue } from "react-hook-form"

export interface IOption {
  sub_categories?: never[]
  sub_quotas?:never[]
  id: any
  text: string
  disable?: boolean
  otherValues?: any
  code?:string
  type?:string
}

export interface ICommonComponentProps {
  label?: string
  name: string
  setValue: any
  labelHint?: React.ReactNode
  labelTooltipIcon?: React.ReactNode
  placeholder?: string
  required?: boolean | string
  disabled?: boolean
  errors: FieldErrors<FieldValues>
  control: Control<any>
  defaultOption?: IOption
  wrapperClass?: string
  boxWrapperClass?: string
  errorClass?: string
}


export interface TableColumn {
  title: ReactNode
  tableKey: string
  width?: string
  hidden?: boolean
  overrideInternalClick?: boolean
  disableMobStaticLeft?: boolean
  renderer?: (props: {
    rowData: any
    cellData: React.ReactNode
  }) => React.ReactNode
}


export interface RendererProps {
  rendererStatus: "PAID" | "NOT_PAID" | "NOT_FOUND" | null
  setRendererStatus: (state: "PAID" | "NOT_PAID" | "NOT_FOUND" | null) => void
  tableData: any
  generateCols: TableColumn[]
  showCutoff: () => void
  amount: number
  configYear: string[]
  college: string
  courseType: string
  course?: string
  stateCode: string
  state?: string
  stateAmount: number
  pageSize: number
  currentPage: number
  updateURL: (page: number, size: number) => void
  setPageSize: (size: number) => void
  setCurrentPage: (page: number) => void
  setStatePaymentPopup: (flag: boolean) => void
  setPaymentChecker: (flag: boolean) => void
  statePaymentPopup?: boolean
  paymentChecker?: boolean
  control: Control<any>
    successCallbackStatePayment: (orderId: string) => Promise<void>
  setValue: UseFormSetValue<any>
  clearErrors: UseFormClearErrors<any>
  errors: FieldErrors<any>
  autoComplete: (
    text: string,
    options: IOption[],
    setOptions: (opts: IOption[]) => void,
  ) => void
}

