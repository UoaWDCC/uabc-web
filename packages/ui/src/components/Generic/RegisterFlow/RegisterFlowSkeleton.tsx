import {
  Button,
  Heading,
  IconButton,
  LoadingStateBar,
  TextInput,
} from "@repo/ui/components/Primitive"
import { Center, Container, Grid, GridItem, Skeleton, Spacer, VStack } from "@yamada-ui/react"

export const RegisterFlowSkeleton = () => {
  return (
    <Container centerContent layerStyle="container">
      <VStack
        bg="gray.900"
        layerStyle="gradientBorder"
        maxW="lg"
        minH="2xl"
        p="lg"
        rounded="3xl"
        w="full"
      >
        <Grid templateColumns="1fr auto 1fr">
          <GridItem>
            <Skeleton>
              <IconButton />
            </Skeleton>
          </GridItem>
          <GridItem as={Center}>
            <Skeleton>
              <Heading.h2>Big Wide Title</Heading.h2>
            </Skeleton>
          </GridItem>
        </Grid>
        <LoadingStateBar value={0} />
        <Skeleton>
          <Heading.h3>A title for this form</Heading.h3>
        </Skeleton>
        <Skeleton w="full">
          <TextInput />
        </Skeleton>
        <Skeleton w="full">
          <TextInput />
        </Skeleton>
        <Spacer />
        <Skeleton w="full">
          <Button />
        </Skeleton>
      </VStack>
    </Container>
  )
}
