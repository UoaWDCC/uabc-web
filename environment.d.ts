declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The mongoDB connection string
       */
      DATABASE_URI: string
      /**
       * Secret used to secure Payload
       */
      PAYLOAD_SECRET: string

      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string

      /**
       * JWT token secret
       */
      JWT_SECRET: string

      /**
       * The public URL of the website
       */
      NEXT_PUBLIC_URL: string
    }
  }
}

export {}
