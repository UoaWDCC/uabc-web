import Link from "next/link"

import { UabcHeaderText } from "@/components/Composite/UabcHeaderText"
import { UabcLogoNotFound } from "@/components/Composite/UabcLogoNotFound"
import { Button } from "@/components/Generic/ui/button"

export const metadata = {
  title: "Not Found - UABC Booking Portal",
}

const NotFoundPage = () => {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-evenly overflow-hidden bg-background">
      <UabcHeaderText />
      <div>
        <div className="mb-4 flex size-72 items-center justify-center opacity-70">
          <UabcLogoNotFound className="absolute min-w-[250px]" />
          {/* doubled because of weird font stroke */}
          <h1 className="textStroke absolute z-10 select-none font-bold text-9xl text-white">
            404
          </h1>
          <h1 className="z-10 select-none font-bold text-9xl text-background">404</h1>
        </div>
        <p className="w-full text-center font-medium text-2xl text-foreground/70">Page not found</p>
      </div>
      <div className="flex w-dvw flex-col gap-4 p-4">
        <Link href="/">
          <Button className="w-full">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
