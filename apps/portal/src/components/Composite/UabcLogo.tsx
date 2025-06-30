import Image from "next/image"
import Logo from "../../../public/svgs/logo.svg"
import LogoDarkMode from "../../../public/svgs/logo-darkmode.svg"

interface UabcLogoProps {
  className?: string
  size?: number
}

export const UabcLogo = ({ className, size = 250 }: UabcLogoProps) => (
  <div className={className}>
    <Image
      alt="uabc logo"
      className="hidden dark:block"
      draggable={false}
      height={size}
      src={LogoDarkMode}
      width={size}
    />
    <Image
      alt="uabc logo"
      className="block dark:hidden"
      draggable={false}
      height={size}
      src={Logo}
      width={size}
    />
  </div>
)
