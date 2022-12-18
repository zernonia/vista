export const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (value, index) =>
    array.slice(index * size, index * size + size)
  );

export const wait = (m: number) => new Promise((r) => setTimeout(r, m));

export const toBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      resolve(result as Blob);
    });
  });

export const downloadBlob = (blobUrl: string, name = "output.mp4") => {
  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
};
