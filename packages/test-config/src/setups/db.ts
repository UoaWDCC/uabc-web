import { MongoMemoryReplSet } from "mongodb-memory-server"

let mongod: MongoMemoryReplSet | undefined

export const create = async (): Promise<MongoMemoryReplSet> => {
  if (mongod) {
    return mongod
  }
  mongod = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      storageEngine: "wiredTiger",
      dbName: "test",
      oplogSize: 1,
    },
    instanceOpts: [
      {
        storageEngine: "wiredTiger",
      },
    ],
  })
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
