declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The public URL of the frontend
       */
      NEXT_PUBLIC_URL: string
      /**
       * The public URL of the backend
       */
      NEXT_PUBLIC_API_URL: string
      /**
       * The SMTP host
       */
      SMTP_HOST: string
      /**
       * The SMTP user
       */
      SMTP_USER: string
      /**
       * The SMTP password
       */
      SMTP_PASS: string
      /**
       * The payload secret
       */
      PAYLOAD_SECRET: string
      /**
       * The database URI
       */
      DATABASE_URI: string
    }
  }
}

export {}
