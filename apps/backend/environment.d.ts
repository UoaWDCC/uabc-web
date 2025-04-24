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
       * Secret for signing JWT tokens and verifying their integrity/authenticity.
       * View the [docs](https://github.com/UoaWDCC/uabc-web/wiki/Backend-Architecture) on more information on how to generate one.
       */
      JWT_SECRET: string

      /**
       * The public URL of the backend
       */
      NEXT_PUBLIC_URL: string
    }
  }
}

export {}
