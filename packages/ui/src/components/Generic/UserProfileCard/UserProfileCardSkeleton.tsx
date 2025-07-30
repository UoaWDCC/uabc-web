import { Heading } from "@repo/ui/components/Primitive"
import { PenIcon } from "@yamada-ui/lucide"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Label,
  Skeleton,
  Spacer,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"

export interface UserProfileCardSkeletonProps {
  title: string
  fieldLabels: string[]
}

export const UserProfileCardSkeleton: FC<UserProfileCardSkeletonProps> = ({
  title,
  fieldLabels,
}) => {
  return (
    <Card bg={["secondary.50", "secondary.900"]} layerStyle="gradientBorder" size="lg" w="full">
      <CardHeader>
        <VStack w="full">
          <HStack w="full">
            <Heading.h2 py="4">{title}</Heading.h2>
            <Spacer />
            <Button disabled minW="12" startIcon={<PenIcon />}>
              Edit
            </Button>
          </HStack>
        </VStack>
      </CardHeader>
      <CardBody w="full">
        <VStack gap="md" w="full">
          {fieldLabels.map((label) => (
            <VStack
              alignSelf="center"
              borderBottom="2px solid"
              borderColor={["blackAlpha.200", "whiteAlpha.300"]}
              gap="xs"
              key={label}
              minW={0}
              py="md"
              w="full"
            >
              <Label color="muted">{label}</Label>
              <Skeleton borderRadius="md" height="20px">
                &nbsp;
              </Skeleton>
            </VStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  )
}

UserProfileCardSkeleton.displayName = "UserProfileCardSkeleton"
