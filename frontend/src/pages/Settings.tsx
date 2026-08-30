import { useState, type ReactNode } from "react";
import { Card, Switch } from "../shared/ui";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="fc-settings-section">
      <h2 className="fc-card-title">{title}</h2>
      {children}
    </Card>
  );
}

export function SettingsPage() {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="fc-page fc-settings-grid">
      <Section title="Información de empresa">
        <div className="fc-field-row">
          <label className="fc-field">
            <span>Nombre de la empresa</span>
            <input defaultValue="FaceControl S.A." />
          </label>
          <label className="fc-field">
            <span>Industria</span>
            <select defaultValue="Tecnología">
              <option>Tecnología</option>
              <option>Manufactura</option>
              <option>Servicios</option>
            </select>
          </label>
        </div>
        <div className="fc-actions">
          <button className="fc-btn fc-btn--primary" type="button">
            Guardar cambios
          </button>
        </div>
      </Section>

      <Section title="Preferencias de asistencia">
        <label className="fc-field">
          <span>Horario de entrada (tolerancia)</span>
          <input type="time" defaultValue="08:30" />
        </label>
        <label className="fc-field">
          <span>Umbral de retardo (minutos)</span>
          <input type="number" defaultValue={10} />
        </label>
      </Section>

      <Section title="Configuración biométrica">
        <div className="fc-switch-row">
          <div>
            <strong>Reconocimiento automático</strong>
            <p>Captura y registra sin intervención manual.</p>
          </div>
          <Switch checked={notifyEmail} onChange={setNotifyEmail} label="Reconocimiento automático" />
        </div>
        <div className="fc-switch-row">
          <div>
            <strong>Detección de rostro en vivo</strong>
            <p>Verifica que haya una persona real frente a la cámara.</p>
          </div>
          <Switch checked={notifySms} onChange={setNotifySms} label="Detección de rostro en vivo" />
        </div>
      </Section>

      <Section title="Notificaciones">
        <div className="fc-switch-row">
          <div>
            <strong>Alertas por correo</strong>
            <p>Notifica retardos y faltas por email.</p>
          </div>
          <Switch checked={notifyEmail} onChange={setNotifyEmail} label="Alertas por correo" />
        </div>
        <div className="fc-switch-row">
          <div>
            <strong>Alertas por SMS</strong>
            <p>Envía un mensaje de texto al supervisor.</p>
          </div>
          <Switch checked={notifySms} onChange={setNotifySms} label="Alertas por SMS" />
        </div>
      </Section>

      <Section title="Seguridad">
        <div className="fc-switch-row">
          <div>
            <strong>Inicio de sesión automático</strong>
            <p>Cierra sesión tras un período de inactividad.</p>
          </div>
          <Switch checked={autoLogout} onChange={setAutoLogout} label="Inicio de sesión automático" />
        </div>
        <div className="fc-switch-row">
          <div>
            <strong>Verificación en dos pasos</strong>
            <p>Requerir un código adicional al iniciar sesión.</p>
          </div>
          <Switch checked={twoFactor} onChange={setTwoFactor} label="Verificación en dos pasos" />
        </div>
        <div className="fc-actions">
          <button className="fc-btn fc-btn--secondary" type="button">
            Cambiar contraseña
          </button>
        </div>
      </Section>
    </div>
  );
}
