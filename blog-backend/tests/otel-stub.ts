// The real package imports `cloudflare:*` modules that only exist inside workerd.
export const instrument = <T>(handler: T) => handler;
