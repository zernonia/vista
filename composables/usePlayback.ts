export const usePlayback = () => {
  const el = useState<HTMLVideoElement | null>("video-element", () => null);
  const videoWidth = useState("video-width", () => 0);
  const videoHeight = useState("video-height", () => 0);

  const ratio = computed(() => videoWidth.value / 480);
  const controls = useMediaControls(el);

  return {
    el,
    ratio,
    videoWidth,
    videoHeight,
    ...controls,
  };
};
