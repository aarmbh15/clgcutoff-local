import axios, { AxiosRequestConfig } from "axios"
import { useCallback, useRef, useState } from "react"

import { useAppState } from "./useAppState"

interface FetchState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

interface FetchParams extends AxiosRequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  url: string
  data?: any
  headers?: Record<string, string>
  noLoading?: boolean
  noToast?: boolean
  notSetLoadingState?: boolean
  onError?: (error: any) => void
  onInternalError500?: (error: any) => void
}

export interface IAPIBaseType<T = any> {
  success: boolean
  payload: T
}

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
})

const useFetch = () => {
  const [state, setState] = useState<FetchState<any>>({
    data: null,
    error: null,
    loading: false,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const { setAppState, showToast } = useAppState()

  const fetchData = useCallback(
    async <T = any,>(params: FetchParams): Promise<IAPIBaseType<T> | null> => {
      const {
        url,
        method = "GET",
        data,
        headers,
        noLoading,
        notSetLoadingState,
        noToast,
        onError,
        onInternalError500,
      } = params

      setState({ data: null, error: null, loading: noLoading ? false : true })
      if (!noLoading) setAppState({ isLoading: true })

      abortControllerRef.current = new AbortController()
      const config: AxiosRequestConfig = {
        ...params,
        method,
        url,
        data,
        headers,
        signal: abortControllerRef.current.signal,
      }

      try {
        const response = await axiosInstance(config)

        if (response.status !== 200) {
          const errorMsg = response?.data?.msg || "An error occurred"
          if (!noToast) {
            showToast("error", errorMsg)
          }
          setState({
            data: null,
            error: errorMsg,
            loading: false,
          })
          if (!noLoading && !notSetLoadingState)
            setAppState({ isLoading: false })
          onError?.(response.data)
          return null
        }

        setState({ data: response.data, error: null, loading: false })
        if (!noLoading && !notSetLoadingState) {
          setAppState({ isLoading: false })
        }

        const returnData = {
          success: true,
          payload: response.data,
        }

        return returnData as IAPIBaseType<T>
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status
          if (statusCode === 500) {
            const errorMsg = "Internal Server Error (500)"
            if (typeof onInternalError500 !== "function") {
              if (!noToast) {
                showToast("error", String(noLoading))
              }
            }
            setState({
              data: null,
              error: errorMsg,
              loading: false,
            })
            setAppState({ isLoading: false })
            onInternalError500?.(error)
          } else if (error.code !== "ERR_CANCELED") {
            const errorMsg = error.response?.data?.msg || error.message

            if (!noToast) {
              showToast("error", errorMsg)
            }
            console.error(errorMsg)
            setState({
              data: null,
              error: errorMsg,
              loading: false,
            })
            setAppState({ isLoading: false })
          }
        } else {
          const errorMsg = "An unexpected error occurred"
          if (!noToast) {
            showToast("error", errorMsg)
          }
          console.error("Internal Server Error: ", errorMsg)
          setState({
            data: null,
            error: errorMsg,
            loading: false,
          })
          setAppState({ isLoading: false })
        }

        return null
      }
    },
    [setAppState, showToast],
  )

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  const refetch = useCallback(
    (params: FetchParams) => {
      return fetchData({ ...params, method: "GET" })
    },
    [fetchData],
  )

  return { ...state, fetchData, refetch, cancelRequest }
}

export default useFetch
