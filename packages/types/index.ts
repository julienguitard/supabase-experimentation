export type Option<T> = T | null;
export type Env = {
    get(key: string): string | undefined;
    // ...other methods like set, delete, toObject, etc.
  }
// Shared TypeScript types will go here 