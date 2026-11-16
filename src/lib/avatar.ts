export async function prepareAvatar(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Selecciona una imagen JPEG, PNG o WebP.");
  if (file.size > 3 * 1024 * 1024)
    throw new Error("La imagen original debe pesar menos de 3 MB.");
  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo procesar la imagen.");
    const side = Math.min(image.width, image.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 256, 256);
    context.drawImage(
      image,
      (image.width - side) / 2,
      (image.height - side) / 2,
      side,
      side,
      0,
      0,
      256,
      256,
    );
    const data = canvas.toDataURL("image/jpeg", 0.82);
    if (data.length > 180000)
      throw new Error("La imagen es demasiado grande. Selecciona otra.");
    return data;
  } finally {
    image.close();
  }
}
