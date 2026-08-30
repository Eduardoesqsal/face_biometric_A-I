import { useEffect, useState, type ReactNode } from "react";
import type { PageId } from "../domain/types";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppLayoutProps = {
  page: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
};

export function AppLayout({ page, onNavigate, children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="fc-shell">
      <Sidebar
        current={page}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={onNavigate}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="fc-main">
        <Topbar page={page} onToggleMobileNav={() => setMobileOpen((value) => !value)} />
        <main className="fc-content">{children}</main>
      </div>
    </div>
  );
}
