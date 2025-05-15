import path from "node:path"
import { fileURLToPath } from "node:url"
// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import { payloadCloudPlugin } from "@payloadcms/payload-cloud"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import type { Config } from "@repo/shared/payload-types"
import { Admin } from "./collections/Admin"
import { Authentication } from "./collections/Authentication"
import { Booking } from "./collections/Booking"
import { GameSession } from "./collections/GameSession"
import { GameSessionSchedule } from "./collections/GameSessionSchedule"
import { Media } from "./collections/Media"
import { Semester } from "./collections/Semester"
import { User } from "./collections/User"

declare module "payload" {
  export interface GeneratedTypes extends Config {}
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: "/payload/admin",
    api: "/payload/api",
    graphQL: "/payload/graphql",
    graphQLPlayground: "/payload/graphql-playground",
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
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "../../../packages/shared/src/payload-types.ts"),
    declare: false,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
