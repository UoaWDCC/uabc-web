declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Secret for signing JWT tokens and verifying their integrity/authenticity.
       * View the [docs](https://github.com/UoaWDCC/uabc-web/wiki/Backend-Architecture) on more information on how to generate one.
       */
      JWT_SECRET: string

      /**
       * The public URL of the frontend
       */
      NEXT_PUBLIC_URL: string
      /**
       * The public URL of the backend
       */
      NEXT_PUBLIC_API_URL: string
    }
  }
}

export {}
