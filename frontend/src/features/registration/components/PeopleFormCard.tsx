import { useState, type FormEvent } from "react";

type PeopleFormCardProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  submitting: boolean;
  message: string;
  isError: boolean;
};

export function PeopleFormCard({ onSubmit, submitting, message, isError }: PeopleFormCardProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!image) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    await onSubmit(formData);
    setName("");
    setImage(null);
  }

  return (
    <article className="card card__pad register-card">
      <span className="eyebrow">NUEVO PERFIL</span>
      <h2>Registrar persona</h2>
      <p className="lead">Agrega una foto clara para que el sistema pueda reconocerla.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <label className="field">
          <span className="field__label">Nombre completo</span>
          <input className="input" name="name" required placeholder="Ej. Maria Lopez" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Foto de referencia</span>
          <input className="input" name="image" type="file" accept="image/jpeg,image/png" required onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
        </label>
        <button className="btn btn--secondary btn--block" disabled={submitting} type="submit" style={{ marginTop: 20 }}>
          {submitting ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
      <p className={`form-result ${isError ? "form-result--error" : "form-result--success"}`}>{message}</p>
    </article>
  );
}

