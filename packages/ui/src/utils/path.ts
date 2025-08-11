/**
 * Normalizes a path by removing trailing slashes and ensuring consistent formatting
 *
 * @param path The path to normalize
 * @returns The normalized path
 */
export const normalizePath = (path: string): string => {
  return path.replace(/\/+$/, "") || "/"
}

/**
 * Checks if two paths are equivalent, handling trailing slashes
 *
 * @param path1 The first path to compare
 * @param path2 The second path to compare
 * @returns True if the paths are equivalent
 */
export const isPathEqual = (path1: string, path2: string): boolean => {
  return normalizePath(path1) === normalizePath(path2)
}

/**
 * Checks if a path is active by comparing it with the current path
 *
 * @param currentPath The current pathname from usePathname()
 * @param targetPath The path to check if it's active
 * @returns True if the target path is active
 */
export const isPathActive = (currentPath: string, targetPath: string): boolean => {
  return isPathEqual(currentPath, targetPath)
}
