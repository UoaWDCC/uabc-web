import { Card, CardBody, Container, DiscList, Heading, ListItem, Text } from "@yamada-ui/react"

export const metadata = {
  title: "Privacy Policy - UABC Booking Portal",
  description: "Privacy policy for the UABC Booking Portal",
}

export default function PrivacyPolicyPage() {
  return (
    <Container centerContent minH="100dvh">
      <Card
        maxW="3xl"
        size="lg"
        textWrap="pretty"
        variant={{ base: "unstyled", sm: "outline" }}
        w="full"
      >
        <CardBody gap="md">
          <Heading fontSize="3xl" fontWeight="extrabold">
            Privacy Policy
          </Heading>
          <Text color="tertiary">
            Effective date: <Text as="strong">27th of June, 2024</Text>
          </Text>
          <Text>
            The Web Development Consulting Club (registered charity), or WDCC, (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) operates the UABC Booking Portal web application
            (the &quot;App&quot;). This page informs you of our policies regarding the collection,
            use, and disclosure of personal data when you use our App and the choices you have
            associated with that data.
          </Text>
          <Heading as="h2" fontSize="2xl" fontWeight="bold">
            Information Collection and Use
          </Heading>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            Data we collect
          </Heading>
          <Text>
            While using our App, we may ask you to provide us with certain personally identifiable
            information that can be used to contact or identify you (&quot;Personal Data&quot;).
            Personally identifiable information may include, but is not limited to:
          </Text>
          <DiscList>
            <ListItem>Email address</ListItem>
            <ListItem>First name and last name</ListItem>
            <ListItem>Hashed Passwords</ListItem>
          </DiscList>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            How we use your data
          </Heading>
          <Text>We use the collected data in order to:</Text>
          <DiscList>
            <ListItem>Provide and maintain the App</ListItem>
            <ListItem>Let you engage with the App</ListItem>
            <ListItem>Email you with information such as booking confirmations</ListItem>
          </DiscList>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            Data Security and Retention
          </Heading>
          <Text>
            We prioritize the security of your data and take reasonable steps to protect it from
            unauthorized access, disclosure, alteration, and destruction.
          </Text>
          <Text>
            We retain Personal Data about you for as long as you have an open account with us or as
            otherwise necessary to provide you with our services.
          </Text>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            Information Sharing
          </Heading>
          <Text>
            We do not share your personal information with third parties unless required by law or
            as necessary to provide our services.
          </Text>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            Cookies and tracking
          </Heading>
          <Text>
            Cookies are small text files that are placed on your computer by the websites that you
            visit. They are widely used in order to make websites work, or work more efficiently, as
            well as to provide information to the owners of the site.
          </Text>
          <Text>We use the following types of Cookies:</Text>
          <DiscList>
            <ListItem>
              <Text as="strong">Required Cookies:</Text> Certain cookies are required for the App to
              function. When you log in to the App, authentication cookies are stored to identify
              you and maintain your session.
            </ListItem>
            <ListItem>
              <Text as="strong">Functional Cookies:</Text> Some cookies are used to remember your
              preferences and settings. For example your name, and choice of theme.
            </ListItem>
          </DiscList>
          <Text>
            The App does not use tracking cookies or any other tracking mechanisms. You may choose
            to disable cookies from your browser settings. However, this may limit your ability to
            use certain features of the App.
          </Text>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            Changes to This Privacy Policy
          </Heading>
          <Text>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page.
          </Text>
          <Heading as="h3" fontSize="xl" fontWeight="bold">
            Contact Information
          </Heading>
          If you have any questions about this Privacy Policy, please do not hesitate to contact us
          at:
          <Text>
            <Text as="strong">Email:</Text> uabc@projects.wdcc.co.nz
          </Text>
        </CardBody>
      </Card>
    </Container>
  )
}
