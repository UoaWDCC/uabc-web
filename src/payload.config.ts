// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { User } from './collections/user'
import { Admin } from './collections/admin'
import { Media } from './collections/media'
import { Semester } from './collections/semester'
import { GameSessionSchedule } from './collections/game-session-schedule'
import { GameSession } from './collections/game-session'
import { Booking } from './collections/booking'
import { Authentication } from './collections/authentication'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/payload/admin',
    api: '/payload/api',
    graphQL: '/payload/graphql',
    graphQLPlayground: '/payload/graphql-playground',
  },
  admin: {
    user: Admin.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname) + '/app/payload/admin/importMap.js',
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
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
