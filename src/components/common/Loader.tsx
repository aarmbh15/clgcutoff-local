"use client"

import { useAppState } from "@/hooks/useAppState"
import { cn, shouldRenderComponent } from "@/utils/utils"

export function Loader() {
  const { appState } = useAppState()

  return (
    <>
      {shouldRenderComponent(
        [appState?.isLoading, appState?.pageLoader],
        "OR",
      ) ? (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-[1100]">
          <div className="bg-color-modal-background flex flex-col gap-6 items-center text-center px-10 py-6 rounded-md w-80 tab:w-[380px]">
            <div className={cn("loader")}></div>
            <h2 className="text-[20px] text-color-text">
              {appState?.pageLoader ? (
                <>
                  <p>Loading Page</p>
                  <p>Please wait...</p>
                </>
              ) : (
                <>
                  <p>Loading Data</p>
                  <p>Please wait...</p>
                </>
              )}
            </h2>
          </div>
        </div>
      ) : null}
    </>
  )
}
