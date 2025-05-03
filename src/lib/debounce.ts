type DebounceFunction<T extends unknown[]> = (...args: T) => void

export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number,
): DebounceFunction<T> => {
  let timeoutId: NodeJS.Timeout

  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
