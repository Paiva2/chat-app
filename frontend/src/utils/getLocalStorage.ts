export default function getLocalStorage<T>(key: string): T | null {
  const localItem = localStorage.getItem(key)

  if (!localItem) return null

  return JSON.parse(localItem) as T
}
