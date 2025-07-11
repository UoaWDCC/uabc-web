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
    }
  }
}

export {}
