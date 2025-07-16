import type { Field, NullableFormData } from "@repo/ui/components/Generic"
import { UserProfileCard, type UserProfileCardProps } from "@repo/ui/components/Generic"
import { useMutation } from "@tanstack/react-query"

/**
 * The props for the ProfileDetails component.
 * @template T The tuple of fields for the form.
 */
interface ProfileDetailsProps<T extends readonly Field[]> extends UserProfileCardProps<T> {}

/**
 * ProfileDetails renders a user profile details card with asynchronous save handling.
 *
 * @template T The tuple of fields for the form.
 * @param props ProfileDetailsProps
 */
export const ProfileDetails = <T extends readonly Field[]>({
  onSave,
  ...props
}: ProfileDetailsProps<T>) => {
  const mutation = useMutation({
    mutationFn: async (data: NullableFormData<T>) => {
      await onSave?.(data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // throw new Error("Failed to submit form")
    },
  })

  return (
    <UserProfileCard
      onSave={async (data) => {
        await mutation.mutateAsync(data)
      }}
      {...props}
    />
  )
}
