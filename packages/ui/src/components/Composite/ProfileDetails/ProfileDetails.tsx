import type { Field, NullableFormData } from "@repo/ui/components/Generic"
import { UserProfileCard, type UserProfileCardProps } from "@repo/ui/components/Generic"
import { useMutation } from "@tanstack/react-query"

interface ProfileDetailsProps<T extends readonly Field[]> extends UserProfileCardProps<T> {}

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
