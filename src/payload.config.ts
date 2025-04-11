// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Admin } from './collections/Admin'
import { User } from './collections/User'
import { Media } from './collections/Media'
import { Semester } from './collections/Semester'
import { GameSession } from './collections/GameSession'
import { Booking } from './collections/Booking'
import { Authentication } from './collections/Authentication'
import { GameSessionSchedule } from './collections/GameSessionSchedule'

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
