import type { PageId } from "../domain/types";
import { Icon, type IconName } from "../shared/icons/Icon";

type NavEntry = { id: PageId; label: string; icon: IconName };

const MAIN_NAV: NavEntry[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "attendance", label: "Asistencias", icon: "attendance" },
  { id: "liveRegister", label: "Registro de asistencia", icon: "camera" },
  { id: "employees", label: "Empleados", icon: "employees" },
  { id: "devices", label: "Dispositivos", icon: "devices" },
  { id: "reports", label: "Reportes", icon: "reports" },
  { id: "settings", label: "Configuración", icon: "settings" },
];

type SidebarProps = {
  current: PageId;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: (page: PageId) => void;
  onCloseMobile: () => void;
};

export function Sidebar({ current, collapsed, mobileOpen, onNavigate, onCloseMobile }: SidebarProps) {
  function handleNavigate(page: PageId) {
    onNavigate(page);
    onCloseMobile();
  }

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? "sidebar-overlay--open" : ""}`} onClick={onCloseMobile} aria-hidden="true" />
      <aside className={`fc-sidebar ${collapsed ? "fc-sidebar--collapsed" : ""} ${mobileOpen ? "fc-sidebar--mobile-open" : ""}`}>
        <div className="fc-sidebar__brand">
          <span className="fc-sidebar__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <circle cx="9" cy="10" r="1.5" />
              <circle cx="15" cy="10" r="1.5" />
              <path d="M12 13.5a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2z" />
            </svg>
          </span>
          {!collapsed ? (
            <div className="fc-sidebar__brand-text">
              <div className="fc-sidebar__brand-name">FaceControl</div>
              <div className="fc-sidebar__brand-sub">Control de Asistencia</div>
            </div>
          ) : null}
        </div>

        <nav className="fc-sidebar__nav" aria-label="Navegación principal">
          {MAIN_NAV.map((entry) => (
            <button
              key={entry.id}
              className={`fc-nav-item ${current === entry.id ? "fc-nav-item--active" : ""}`}
              onClick={() => handleNavigate(entry.id)}
              type="button"
              aria-current={current === entry.id ? "page" : undefined}
              title={collapsed ? entry.label : undefined}
            >
              <span className="fc-nav-item__icon">
                <Icon name={entry.icon} />
              </span>
              {!collapsed ? <span className="fc-nav-item__label">{entry.label}</span> : null}
            </button>
          ))}
        </nav>

        <div className="fc-sidebar__footer" />
      </aside>
    </>
  );
}
