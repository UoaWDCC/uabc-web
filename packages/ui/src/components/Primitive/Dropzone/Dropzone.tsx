import { Dropzone as UIDropzone, type DropzoneProps as UIDropzoneProps } from "@yamada-ui/dropzone"
import { FolderUpIcon } from "@yamada-ui/lucide"
import { Text, VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { Heading } from "../Heading"

/**
 * Props for {@link Dropzone} component.
 */
export interface DropzoneProps extends UIDropzoneProps {
  /**
   * Optional header text displayed above the description.
   */
  header?: string
  /**
   * Optional description of the dropzone
   */
  description?: string
}

/**
 * Dropzone component used to upload files.
 *
 * Renders a centered folder icon and instructional text inside the underlying
 * `@yamada-ui/dropzone` component.
 *
 * @remarks
 * The `header` and `description` props provide the visible title and helper
 * text. Any other `@yamada-ui/dropzone` props are forwarded to the component.
 *
 * @example
 * <Dropzone />
 */
export const Dropzone: FC<DropzoneProps> = memo(
  ({
    header = "Attach file here",
    description = "Drop item here or click to select file",
    ...props
  }) => {
    return (
      <UIDropzone {...props}>
        <VStack alignItems="center">
          <FolderUpIcon color="white" fontSize="9xl" strokeWidth="1.2" />
          <VStack gap="md" textAlign="center">
            <Heading.h2 color="white" fontWeight="semibold">
              {header}
            </Heading.h2>
            <Text color="secondary.100" fontWeight="normal">
              {description}
            </Text>
          </VStack>
        </VStack>
      </UIDropzone>
    )
  },
)

Dropzone.displayName = "Dropzone"
