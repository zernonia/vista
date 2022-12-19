import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { chunk } from "@/utils/functions";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

export const useTranscode = createSharedComposable(() => {
  let ffmpeg: FFmpeg;
  const message = ref("Starting");
  const video = ref<string>();
  const progress = ref(0);
  const { config } = useConfig();
  const { ratio } = usePlayback();

  const CHUNK_SIZE = 10;

  onMounted(() => {
    ffmpeg = createFFmpeg({
      log: true,
    });
  });

  const applyOverlay = (overlay: Blob[], starting_index: number, transcribe: any) => {
    const baseCmd = ["-i", starting_index === 0 ? "base.mp4" : `output-${starting_index / CHUNK_SIZE}.mp4`];
    const overlayInput = overlay?.map((b, i) => ["-i", `${i + starting_index}.png`]).flat() ?? [];
    const overlayCmd = overlay
      ? [
          "-filter_complex",
          overlay
            .map(
              (b, i) =>
                `[${i === 0 ? "0:v" : "v" + i}][${i + 1}:v]overlay=${config.value.style.left * ratio.value}:${
                  config.value.style.top * ratio.value
                }:enable='between(t,${transcribe[i + starting_index].start / 1000},${
                  transcribe[i + starting_index].end / 1000
                })'[v${i + 1}]`
            )
            .join("; "),
        ]
      : [];
    const outputCmd = [
      "-map",
      `[v${overlay?.length}]`,
      "-map",
      "0:a",
      "-c:a",
      "copy",
      `output-${starting_index / CHUNK_SIZE + 1}.mp4`,
    ];
    // const outputCmd = ["-c:v", "copy", "-c:a", "copy", "output.mp4"];

    return ffmpeg.run(...baseCmd, ...overlayInput, ...overlayCmd, ...outputCmd);
  };

  const transcode = async (file?: File | Blob, overlay?: Blob[], transcribe?: any) => {
    try {
      if (!file || !overlay || !transcribe) return;

      progress.value = 0.05;
      message.value = "Loading ffmeg-core.js";
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      message.value = "Start saving data in-memory";
      progress.value = 0.1;
      const start_time = new Date().getTime();

      if (overlay) {
        for (let i = 0; i < overlay.length; i++) {
          ffmpeg.FS("writeFile", `${i}.png`, await fetchFile(overlay[i]));
        }
      }
      ffmpeg.FS("writeFile", "base.mp4", await fetchFile(file));

      const overlayChunk = chunk(overlay, CHUNK_SIZE);

      for (let i = 0; i < overlayChunk.length; i++) {
        message.value = `Start trancoding chunk (${i + 1}/${overlayChunk.length})`;
        progress.value = 0.1 + 0.6 * ((i + 1) / overlayChunk.length);
        await applyOverlay(overlayChunk[i], i * CHUNK_SIZE, transcribe);
      }

      progress.value = 1;
      message.value = "Complete transcoding";
      const data = ffmpeg.FS("readFile", `output-${overlayChunk.length}.mp4`);
      video.value = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

      const end_time = new Date().getTime();
      console.log("Time taken", (end_time - start_time) / 1000 / 60, "minutes");

      setTimeout(() => {
        progress.value = 0;
      }, 500);
    } catch (err) {
      console.log(err);
      message.value = "Something wrong. Please contact Zernonia";
      throw Error("Something wrong. Please contact Zernonia");
    }
  };

  return {
    transcode,
    video,
    message,
    progress,
  };
});
