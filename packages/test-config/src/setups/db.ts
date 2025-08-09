import { MongoMemoryServer } from "mongodb-memory-server"

let mongod: MongoMemoryServer | undefined

export const create = async (): Promise<MongoMemoryServer> => {
  if (mongod) {
    return mongod
  }
  mongod = await MongoMemoryServer.create()
  return mongod
}

export const close = async (): Promise<void> => {
  await mongod?.stop()
  mongod = undefined
}

export const getUri = async (): Promise<string> => {
  if (!mongod) {
    return (await create()).getUri()
  }
  return mongod.getUri()
}
