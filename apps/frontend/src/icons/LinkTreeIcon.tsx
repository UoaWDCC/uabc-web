import { Icon, type IconProps } from "@yamada-ui/react"
import { type FC, memo } from "react"

export interface LinkTreeIconProps extends IconProps {}

export const LinkTreeIcon: FC<LinkTreeIconProps> = memo((props) => {
  return (
    <Icon fill="none" strokeWidth="3px" viewBox="0 0 30 38" {...props}>
      <path
        d="M1.07977 13.3456H9.54977L3.49477 7.47648L6.81977 4.0409L12.5598 10.0174V1.5H17.5298V10.0174L23.2698 4.0409L26.5948 7.47648L20.5398 13.3098H29.0098V18.1411H20.5048L26.5598 24.1176L23.2348 27.4816L15.0098 19.0716L6.78477 27.5174L3.45977 24.1176L9.51477 18.1411H1.00977V13.3456H1.07977ZM12.5948 25.0481H17.5648V36.5H12.5948V25.0481Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </Icon>
  )
})

LinkTreeIcon.displayName = "LinkTreeIcon"
