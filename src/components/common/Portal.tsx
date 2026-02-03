import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export const Portal = ({ children }: { children: React.ReactNode }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create a container element for the portal
    const containerElement = document.createElement("div")
    document.body.appendChild(containerElement)
    setContainer(containerElement)

    // Cleanup on unmount
    return () => {
      try {
        if (containerElement) {
          document.body.removeChild(containerElement)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  return container ? createPortal(children, container) : null
}
