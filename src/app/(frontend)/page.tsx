import { UabcLogo } from '@/components/UabcLogo'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Link as UILink,
  VStack,
} from '@yamada-ui/react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Container
      as={Grid}
      minH="100dvh"
      bg={{
        base: ['white', 'black'],
        sm: 'primary',
      }}
      justifyContent="center"
      p={{ sm: '0' }}
    >
      <GridItem as={Center}>
        <Card
          bg={['white', 'black']}
          variant="solid"
          color={['black', 'white']}
          w="fit-content"
          textAlign="center"
          flexDir="row"
          p={{
            base: '6',
            sm: '12',
          }}
          gap="12"
        >
          <CardBody
            as={VStack}
            gap="6"
            p="0"
            maxW="500px"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="2xl" lineHeight="10">
              UABC Booking Portal
            </Heading>
            <Center
              display={{
                base: 'grid',
                lg: 'none',
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
              as={Link}
              size="lg"
              w="full"
              href="/sessions"
              colorScheme="primary"
              fontSize="sm"
              fontWeight="normal"
              lineHeight="5"
              height="2.75rem"
              _hover={{
                bg: 'transparentize(primary, 90%)',
              }}
            >
              Book a session!
            </Button>
            <UILink as={Link} href="/privacy" color="primary" textDecoration="underline">
              Privacy Policy
            </UILink>
          </CardBody>
          <CardFooter
            display={{
              base: 'none',
              lg: 'grid',
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
