import { Transcribe } from "~~/utils/interface";

export const useTranscription = () => {
  const transcribe = useState<Transcribe[]>("transcribe", () => []);

  return transcribe;
};
