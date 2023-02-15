import { persisted } from 'svelte-local-storage-store';

const ratesStored = persisted<Record<string, number[]>>('rates', { USD: [1, 0] });

export default ratesStored;
