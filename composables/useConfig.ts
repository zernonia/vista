export const useConfig = () => {
  const defaultConfig = {
    style: {
      left: 100,
      top: 100,
      paddingX: 14,
      paddingY: 8,
      borderRadius: 8,
      fontSize: 20,
      fontWeight: 500,
      backgroundColor: "#3b82f6",
      color: "#d1d5db",
    },
    highlight_style: {
      color: "#ffffff",
    },
  };

  const config = useState(() => defaultConfig);

  const computedStyle = computed(() => ({
    ...config.value.style,
    left: config.value.style.left + "px",
    top: config.value.style.top + "px",
    padding: `${config.value.style.paddingY}px  ${config.value.style.paddingX}px`,
    borderRadius: config.value.style.borderRadius + "px",
    fontSize: config.value.style.fontSize + "px",
  }));

  const computedHighlightStyle = computed(() => config.value.highlight_style);

  const resetConfig = () => (config.value = defaultConfig);

  return {
    config,
    computedStyle,
    computedHighlightStyle,
    resetConfig,
  };
};
