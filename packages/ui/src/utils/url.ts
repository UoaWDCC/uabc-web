export type SerializableQuery = Record<string, unknown>

const serializeQuery = (params: SerializableQuery): string => {
  const search = new URLSearchParams()
  for (const [key, raw] of Object.entries(params)) {
    if (raw == null) continue
    if (Array.isArray(raw)) {
      for (const v of raw) {
        if (v == null) continue
        search.append(key, String(v))
      }
    } else {
      search.append(key, String(raw))
    }
  }
  return search.toString()
}

export const buildExternalHref = (base: string, params: SerializableQuery): string => {
  const qs = serializeQuery(params)
  if (!qs) return base

  const hashIndex = base.indexOf("#")
  const hasHash = hashIndex !== -1
  const urlWithoutHash = hasHash ? base.slice(0, hashIndex) : base
  const hash = hasHash ? base.slice(hashIndex) : ""

  const separator = urlWithoutHash.includes("?") ? "&" : "?"
  return `${urlWithoutHash}${separator}${qs}${hash}`
}
