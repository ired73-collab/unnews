export async function uploadImageToCloudinary(
  file,
  cloudName,
  uploadPreset
) {
  if (!file || !file.type.startsWith("image/")) return "";

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudinary upload error:", errorText);
    throw new Error("이미지 업로드 실패");
  }

  const data = await response.json();
  return data.secure_url;
}