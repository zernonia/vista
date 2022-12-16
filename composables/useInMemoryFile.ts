export const useInMemoryFile = () => useState<{ [key: string]: File }>("new-upload", () => ({}));
