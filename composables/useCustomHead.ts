import { ComputedRef } from "vue";

export const useCustomHead = (
  title?: string | ComputedRef<string>,
  description?: string | ComputedRef<string>,
  image?: string | ComputedRef<string>
) => {
  useHead({
    title,
    meta: [
      {
        name: "description",
        content: description ?? "An app that turns your plain video into perfect video with animated subtitle!",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@zernonia" },
      { name: "twitter:title", content: title ?? "Vista | Add animated subtitle to your video automatically" },
      {
        name: "twitter:description",
        content: description ?? "An app that turns your plain video into perfect video with animated subtitle!",
      },
      { name: "twitter:image", content: image ?? "https://www.vistaeditor.com/og.png" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title ?? "Vista | Add animated subtitle to your video automatically" },
      { property: "og:url", content: "https://www.vistaeditor.com/" },
      { property: "og:image", content: image ?? "https://www.vistaeditor.com/og.png" },
      { property: "og:image:secure_url", content: image ?? "https://www.vistaeditor.com/og.png" },
      { property: "og:image:type", content: "image/png" },
      {
        property: "og:description",
        content: description ?? "An app that turns your plain video into perfect video with animated subtitle!",
      },
    ],
  });
};
