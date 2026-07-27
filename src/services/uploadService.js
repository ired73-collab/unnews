export class ImageUploadError extends Error {
  constructor(code, message, detail = "") {
    super(message);
    this.name = "ImageUploadError";
    this.code = code;
    this.detail = detail;
  }
}

const getCloudinaryErrorMessage = async (response) => {
  const responseText = await response.text();

  try {
    const parsed = JSON.parse(responseText);
    return parsed?.error?.message || responseText;
  } catch {
    return responseText;
  }
};

const classifyUploadError = (detail = "", status = 0) => {
  const normalized = detail.toLowerCase();

  if (
    normalized.includes("file size") ||
    normalized.includes("too large") ||
    normalized.includes("maximum allowed")
  ) {
    return new ImageUploadError(
      "FILE_TOO_LARGE",
      "허용된 파일 용량을 초과했습니다.",
      detail
    );
  }

  if (
    normalized.includes("dimension") ||
    normalized.includes("width") ||
    normalized.includes("height") ||
    normalized.includes("pixels")
  ) {
    return new ImageUploadError(
      "DIMENSIONS_TOO_LARGE",
      "허용된 이미지 크기(가로·세로)를 초과했습니다.",
      detail
    );
  }

  if (
    normalized.includes("format") ||
    normalized.includes("invalid image") ||
    normalized.includes("unsupported") ||
    normalized.includes("corrupt")
  ) {
    return new ImageUploadError(
      "UNSUPPORTED_FORMAT",
      "지원하지 않거나 손상된 이미지 파일입니다.",
      detail
    );
  }

  if (status === 401 || status === 403) {
    return new ImageUploadError(
      "UPLOAD_CONFIGURATION",
      "이미지 업로드 설정을 확인해야 합니다.",
      detail
    );
  }

  if (status === 429) {
    return new ImageUploadError(
      "RATE_LIMITED",
      "업로드 요청이 많습니다. 잠시 후 다시 시도해주세요.",
      detail
    );
  }

  return new ImageUploadError(
    "UPLOAD_FAILED",
    "이미지 업로드 서버에서 파일을 처리하지 못했습니다.",
    detail
  );
};

const formatBytesInMessage = (message = "") =>
  String(message).replace(/\b(\d{6,})\s*bytes?\b/gi, (_, byteValue) => {
    const megabytes = Number(byteValue) / (1024 * 1024);
    const formatted = megabytes >= 10 ? megabytes.toFixed(1) : megabytes.toFixed(2);
    return `${formatted.replace(/\.0$/, "")}MB`;
  });

export function getImageUploadErrorMessage(error, fileName = "") {
  const name = fileName ? `[${fileName}] ` : "";

  if (error instanceof ImageUploadError) {
    const guidance = {
      FILE_TOO_LARGE: "파일 용량을 줄인 뒤 다시 업로드해주세요.",
      DIMENSIONS_TOO_LARGE: "이미지의 가로·세로 크기를 줄인 뒤 다시 업로드해주세요.",
      UNSUPPORTED_FORMAT: "JPG, PNG, WebP 등 일반 이미지 형식으로 변환해주세요.",
      UPLOAD_CONFIGURATION: "관리자에게 업로드 설정 확인을 요청해주세요.",
      RATE_LIMITED: "잠시 기다린 뒤 다시 업로드해주세요.",
      UPLOAD_FAILED: "파일을 다시 저장하거나 잠시 후 재시도해주세요.",
    };

    const serverLimit =
      ["FILE_TOO_LARGE", "DIMENSIONS_TOO_LARGE"].includes(error.code) &&
      error.detail
        ? ` (서버 제한 안내: ${formatBytesInMessage(error.detail)})`
        : "";

    return `${name}${error.message}${serverLimit} ${guidance[error.code] || ""}`.trim();
  }

  if (
    error instanceof TypeError ||
    (typeof navigator !== "undefined" && !navigator.onLine)
  ) {
    return `${name}네트워크 연결 문제로 업로드하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해주세요.`;
  }

  return `${name}알 수 없는 오류로 업로드하지 못했습니다. 파일을 확인한 뒤 다시 시도해주세요.`;
}

export async function uploadImageToCloudinary(file, cloudName, uploadPreset) {
  if (!file) {
    throw new ImageUploadError("NO_FILE", "선택된 파일이 없습니다.");
  }

  if (!file.type?.startsWith("image/")) {
    throw new ImageUploadError(
      "UNSUPPORTED_FORMAT",
      "이미지 파일만 업로드할 수 있습니다."
    );
  }

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
    const errorDetail = await getCloudinaryErrorMessage(response);
    console.error("Cloudinary upload error:", errorDetail);
    throw classifyUploadError(errorDetail, response.status);
  }

  const data = await response.json();
  if (!data?.secure_url) {
    throw new ImageUploadError(
      "UPLOAD_FAILED",
      "업로드 결과에서 이미지 주소를 확인하지 못했습니다."
    );
  }

  return data.secure_url;
}
