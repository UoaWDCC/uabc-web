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
    }
  }
}

export {}
