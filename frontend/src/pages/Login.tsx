import { useState, type FormEvent } from "react";
import { useAuth } from "../application/auth/AuthContext";
import { Icon } from "../shared/icons/Icon";

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-label="Inicio de sesión">
        <div className="auth-brand auth-brand--center">
          <div className="auth-brand__mark">
            <Icon name="employees" />
          </div>
          <div>
            <h1>FaceControl</h1>
            <p>Control de Asistencia</p>
          </div>
        </div>

        <div className="auth-panel auth-panel--form auth-panel--solo">
          <div className="auth-form-head">
            <h2>Iniciar sesión</h2>
            <p>Usa tus credenciales autorizadas.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span className="auth-field__label">
                <Icon name="employees" />
                Correo electrónico
              </span>
              <div className="auth-input-wrap">
                <span className="auth-input-wrap__icon" aria-hidden="true">
                  <Icon name="employees" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@facecontrol.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span className="auth-field__label">
                <Icon name="logout" />
                Contraseña
              </span>
              <div className="auth-input-wrap">
                <span className="auth-input-wrap__icon" aria-hidden="true">
                  <Icon name="logout" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" type="submit" disabled={loading}>
              <span className="auth-submit__icon" aria-hidden="true">
                <Icon name="arrowLeft" />
              </span>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
