import { writable, type Writable } from "svelte/store";

export const draggingSource: Writable<string> = writable(null);
