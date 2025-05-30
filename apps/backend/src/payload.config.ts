import path from "node:path"
import { fileURLToPath } from "node:url"
// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import type { Config } from "@repo/shared/payload-types"
import { Admin } from "./data-layer/collections/Admin"
import { Authentication } from "./data-layer/collections/Authentication"
import { Booking } from "./data-layer/collections/Booking"
import { GameSession } from "./data-layer/collections/GameSession"
import { GameSessionSchedule } from "./data-layer/collections/GameSessionSchedule"
import { Media } from "./data-layer/collections/Media"
import { Semester } from "./data-layer/collections/Semester"
import { User } from "./data-layer/collections/User"

import { Footer } from "./data-layer/globals/Footer"

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
  admin: {
    user: Admin.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: `${path.resolve(dirname)}/app/payload/admin/importMap.js`,
    },
  },
  collections: [
    Admin,
    User,
    Media,
    Semester,
    GameSessionSchedule,
    GameSession,
    Booking,
    Authentication,
  ],
  globals: [Footer],
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
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
