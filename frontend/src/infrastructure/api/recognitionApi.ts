import type { RecognitionResponse } from "../../domain/types";
import { requestJson } from "./http";

export async function recognizeFace(blob: Blob): Promise<RecognitionResponse> {
  const formData = new FormData();
  formData.append("image", blob, "camera.jpg");

  return requestJson<RecognitionResponse>("/api/recognize", {
    method: "POST",
    body: formData,
  });
}

