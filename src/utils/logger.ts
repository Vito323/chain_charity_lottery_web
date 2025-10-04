const __debug = process.env.NODE_ENV === 'development'


export const log = (message?: unknown, ...optionalParams: unknown[]) => {
  if (!__debug) return
  console.log(message, ...optionalParams);
}

export const error = (message?: unknown, ...optionalParams: unknown[]) => {
  if (!__debug) return
  console.error(message, ...optionalParams);
}

export const warn = (message?: unknown, ...optionalParams: unknown[]) => {
  if (!__debug) return
  console.warn(message, ...optionalParams);
}

export const info = (message?: unknown, ...optionalParams: unknown[]) => {
  if (!__debug) return
  console.info(message, ...optionalParams);
}

const logger = {
  l: log,
  log,
  e: error,
  error,
  w: warn,
  warn,
  i: info,
  info,
}

export default logger