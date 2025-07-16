import path from "node:path"
import { fileURLToPath } from "node:url"
// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import type { Config } from "@repo/shared/payload-types"
import { buildConfig } from "payload"
import sharp from "sharp"
import { Admin } from "./data-layer/collections/Admin"
import { Authentication } from "./data-layer/collections/Authentication"
import { Booking } from "./data-layer/collections/Booking"
import { Event } from "./data-layer/collections/Event"
import { GameSession } from "./data-layer/collections/GameSession"
import { GameSessionSchedule } from "./data-layer/collections/GameSessionSchedule"
import { Media } from "./data-layer/collections/Media"
import { Semester } from "./data-layer/collections/Semester"
import { User } from "./data-layer/collections/User"

import { FAQ } from "./data-layer/globals/Faq"
import { Footer } from "./data-layer/globals/Footer"
import { Navbar } from "./data-layer/globals/Navbar"

declare module "payload" {
  export interface GeneratedTypes extends Config {}
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: "/payload/admin",
    api: "/payload/api",
  },
  cors: "*",
  admin: {
    user: Admin.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: `${path.resolve(dirname)}/app/payload/admin/importMap.js`,
    },
  },
  collections: [
    Admin,
    Event,
    User,
    Media,
    Semester,
    GameSessionSchedule,
    GameSession,
    Booking,
    Authentication,
  ],
  globals: [FAQ, Footer, Navbar],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "../../../packages/shared/src/payload-types.ts"),
    declare: false,
  },
  graphQL: {
    disable: true,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
    allowIDOnCreate: process.env.NODE_ENV === "test",
  }),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER,
    defaultFromName: "UABC",
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
