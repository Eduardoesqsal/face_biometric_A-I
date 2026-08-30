import type { PageId } from "../domain/types";
import { Icon } from "../shared/icons/Icon";

type TopbarProps = {
  page: PageId;
  onToggleMobileNav: () => void;
};

const PAGE_TITLES: Record<Exclude<PageId, "employeeDetail">, { title: string; desc: string }> = {
  dashboard: { title: "Dashboard", desc: "Resumen general del sistema de asistencia" },
  attendance: { title: "Asistencias", desc: "Registros de entrada y salida" },
  liveRegister: { title: "Registro en vivo", desc: "Reconocimiento facial de asistencia" },
  employees: { title: "Empleados", desc: "Gestión de tu plantilla" },
  devices: { title: "Dispositivos", desc: "Terminales biométricos conectados" },
  reports: { title: "Reportes", desc: "Genera y exporta reportes" },
  settings: { title: "Configuración", desc: "Ajustes generales del sistema" },
};

export function Topbar({ page, onToggleMobileNav }: TopbarProps) {
  const meta = (PAGE_TITLES as Record<string, { title: string; desc: string }>)[page] ?? { title: "Empleado", desc: "Detalle del empleado" };
  return (
    <header className="fc-topbar">
      <button className="fc-mobile-menu" onClick={onToggleMobileNav} type="button" aria-label="Abrir menú">
        <Icon name="menu" />
      </button>
      <div className="fc-topbar__titles">
        <h1>{meta.title}</h1>
        <p>{meta.desc}</p>
      </div>
      <div className="fc-topbar__actions">
        <button className="fc-icon-btn" type="button" aria-label="Notificaciones">
          <Icon name="bell" />
          <span className="fc-icon-btn__dot" aria-hidden="true" />
        </button>
        <div className="fc-admin">
          <span className="fc-admin__avatar" aria-hidden="true">A</span>
          <div className="fc-admin__info">
            <div className="fc-admin__name">Administrador</div>
            <div className="fc-admin__email">admin@facecontrol.com</div>
          </div>
          <Icon name="chevronDown" className="fc-admin__chevron" />
        </div>
      </div>
    </header>
  );
}

