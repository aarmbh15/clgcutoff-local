import { debounce } from "@/utils/utils"
import { useEffect, useState } from "react"

interface WindowSize {
  width: number
  height: number
}

function useWindowSize(delay = 100): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    const debouncedResize = debounce(handleResize, delay)

    window.addEventListener("resize", debouncedResize)

    return () => {
      window.removeEventListener("resize", debouncedResize)
    }
  }, [delay])

  return windowSize
}

export default useWindowSize
