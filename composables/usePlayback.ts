export const usePlayback = () => {
  const el = useState<HTMLVideoElement | null>("video-element", () => null);
  const ratio = useState("video-ratio", () => 0);

  const controls = useMediaControls(el);

  return {
    el,
    ratio,
    ...controls,
  };
};
