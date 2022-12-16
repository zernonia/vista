import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

export const useTranscode = () => {
  let ffmpeg: FFmpeg;
  const message = ref("Click Start to Transcode");
  const video = ref<string>();
  const { config } = useConfig();
  const { ratio } = usePlayback();

  onMounted(() => {
    ffmpeg = createFFmpeg({
      log: true,
    });
  });

  onUnmounted(() => {
    ffmpeg?.exit();
  });

  const transcode = async (file?: File | Blob, overlay?: Blob[], transcribe?: any) => {
    try {
      if (!file || !overlay || !transcribe) return;
      message.value = "Loading ffmeg-core.js";
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      message.value = "Start transcoding";

      if (overlay) {
        for (let i = 0; i < overlay.length; i++) {
          ffmpeg.FS("writeFile", `${i}.png`, await fetchFile(overlay[i]));
        }
      }

      ffmpeg.FS("writeFile", "base.mp4", await fetchFile(file));
      // overlay && ffmpeg.FS("writeFile", "overlay.mp4", await fetchFile(overlay));

      const baseCmd = ["-i", "base.mp4"];
      const overlayInput = overlay?.map((b, i) => ["-i", `${i}.png`]).flat() ?? [];
      const overlayCmd = overlay
        ? [
            "-filter_complex",
            overlay
              .map(
                (b, i) =>
                  `[${i === 0 ? "0:v" : "v" + i}][${i + 1}:v]overlay=${config.value.style.left * ratio.value}:${
                    config.value.style.top * ratio.value
                  }:enable='between(t,${transcribe[i].start / 1000},${transcribe[i].end / 1000})'[v${i + 1}]`
              )
              .join("; "),
          ]
        : [];
      const outputCmd = ["-map", `[v${overlay?.length}]`, "-map", "0:a", "-c:a", "copy", "output.mp4"];
      // const outputCmd = ["-c:v", "copy", "-c:a", "copy", "output.mp4"];

      await ffmpeg.run(...baseCmd, ...overlayInput, ...overlayCmd, ...outputCmd);

      message.value = "Complete transcoding";
      const data = ffmpeg.FS("readFile", "output.mp4");
      video.value = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    } catch (err) {
      console.log(err);
    }
  };

  return {
    transcode,
    video,
  };
};
