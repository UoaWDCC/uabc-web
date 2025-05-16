import { UabcLogo } from "@/components/Composite/UabcLogo"
import { Button } from "@repo/ui/components/Button"
import { Heading } from "@repo/ui/components/Heading"
import {
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Grid,
  GridItem,
  Text,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"

export default function HomePage() {
  return (
    <Container
      as={Grid}
      bg={{
        base: ["white", "black"],
        sm: "primary",
      }}
      justifyContent="center"
      minH="100dvh"
      p={{ sm: "0" }}
    >
      <GridItem as={Center}>
        <Card
          bg={["white", "black"]}
          color={["black", "white"]}
          flexDir="row"
          gap="12"
          p={{
            base: "6",
            sm: "12",
          }}
          textAlign="center"
          variant="solid"
          w="fit-content"
        >
          <CardBody
            alignItems="center"
            as={VStack}
            gap="6"
            justifyContent="center"
            maxW="500px"
            p="0"
          >
            <Heading.h2 lineHeight="10">UABC Booking Portal</Heading.h2>
            <Center
              display={{
                base: "grid",
                lg: "none",
              }}
              placeItems="center"
            >
              <UabcLogo size={200} />
            </Center>
            <Text>🏸 Welcome to the UABC Booking Portal 🏸</Text>
            <Text>
              Easily book your badminton sessions with the University of Auckland Badminton Club.
            </Text>
            <Text>
              Enjoy quick, hassle-free reservations and get on the court in no time. Join our
              vibrant community and play your best game today!
            </Text>
            <Button
              _hover={{
                bg: "transparentize(primary, 90%)",
              }}
              as={Link}
              colorScheme="primary"
              fontSize="sm"
              fontWeight="normal"
              height="2.75rem"
              href="/sessions"
              lineHeight="5"
              size="lg"
              w="full"
            >
              Book a session!
            </Button>
            <UILink as={Link} color="primary" href="/privacy" textDecoration="underline">
              Privacy Policy
            </UILink>
          </CardBody>
          <CardFooter
            display={{
              base: "none",
              lg: "grid",
            }}
            p="0"
          >
            <Center>
              <UabcLogo size={350} />
            </Center>
          </CardFooter>
        </Card>
      </GridItem>
    </Container>
  )
}
