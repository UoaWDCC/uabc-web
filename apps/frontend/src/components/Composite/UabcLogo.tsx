import Image from "next/image"
import LogoDarkMode from "../../../public/svgs/logo-darkmode.svg"
import Logo from "../../../public/svgs/logo.svg"

interface UabcLogoProps {
  className?: string
  size?: number
}

export const UabcLogo = ({ className, size = 250 }: UabcLogoProps) => (
  <div className={className}>
    <Image
      src={LogoDarkMode}
      alt="uabc logo"
      className="hidden dark:block"
      width={size}
      height={size}
      draggable={false}
    />
    <Image
      src={Logo}
      alt="uabc logo"
      className="block dark:hidden"
      width={size}
      height={size}
      draggable={false}
    />
  </div>
)
