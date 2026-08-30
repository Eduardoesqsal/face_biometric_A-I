import { useState } from "react";
import { addPerson } from "../../infrastructure/api/peopleApi";

export function usePeopleForm() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setIsError(false);
    try {
      const response = await addPerson(formData);
      setMessage(response.message);
      return response;
    } catch (err) {
      const text = err instanceof Error ? err.message : "No se pudo guardar el perfil";
      setMessage(text);
      setIsError(true);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    message,
    submitting,
    isError,
    submit,
    setMessage,
  };
}

