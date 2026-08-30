import type { MessageResponse, PeopleResponse } from "../../domain/types";
import { requestJson } from "./http";

export function addPerson(formData: FormData): Promise<MessageResponse> {
  return requestJson<MessageResponse>("/api/people", {
    method: "POST",
    body: formData,
  });
}

export function getPeople(): Promise<PeopleResponse> {
  return requestJson<PeopleResponse>("/api/people");
}


