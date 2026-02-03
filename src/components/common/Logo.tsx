import { cn } from "@/utils/utils"
import Image from "next/image"
import Link from "next/link"

export function Logo({
  className,
  textStyle,
  imgStyle,
  sidebar,
}: {
  className?: string
  textStyle?: string
  imgStyle?: string
  sidebar?: boolean
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        width={62}
        height={62}
        alt="a black background image with written text is CE in yellow color"
        className={cn("rounded-md border border-slate-800 shadow-md", imgStyle)}
        quality={100}
      />
      <div className={cn("text-white tracking-wide", textStyle)}>
        <p
          className={cn(
            "font-extrabold text-color-accent text-[18px] pc:text-[24px] translate-y-[2px] pc:translate-y-1",
            sidebar && "text-[24px] translate-y-[6px]",
          )}
        >
          College
        </p>
        <p
          className={cn(
            "font-extrabold text-color-table-header text-[18px] pc:text-[24px] translate-y-[-2px] pc:-translate-y-1",
            sidebar && "text-[24px] translate-y-[-2px]",
          )}
        >
          Cutoff
        </p>
      </div>
    </Link>
  )
}

