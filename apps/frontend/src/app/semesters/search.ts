import { parseAsInteger, parseAsString } from "nuqs"
import {
  createSearchParamsCache,
  parseAsInteger as parseAsIntegerServer,
  parseAsString as parseAsStringServer,
} from "nuqs/server"

export const serverParsers = {
  id: parseAsStringServer.withDefault(""),
  page: parseAsIntegerServer.withDefault(1),
}
export const searchParamsCache = createSearchParamsCache(serverParsers)

export const parsers = {
  id: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
}
