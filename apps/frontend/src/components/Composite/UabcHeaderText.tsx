import { cn } from "@/lib/utils"

interface UabcHeaderTextProps {
  className?: string
  description?: boolean
}

export const UabcHeaderText = ({ description, className }: UabcHeaderTextProps) => (
  <div className={cn("text-center font-bold text-primary leading-none dark:text-white", className)}>
    <span className="text-[4rem] leading-none tracking-tight">UABC</span>
    {description && (
      <>
        <br />
        <span className="text-lg leading-none">booking portal</span>
      </>
    )}
  </div>
)
