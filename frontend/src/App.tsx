import { useState } from "react";
import type { PageId, RecognitionResponse } from "./domain/types";
import { useTheme } from "./application/hooks/useTheme";
import { useLinkedData } from "./application/hooks/useLinkedData";
import { AppLayout } from "./layouts/AppLayout";
import { ThemeToggle } from "./shared/ui/ThemeToggle";
import { AuthProvider, useAuth } from "./application/auth/AuthContext";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
import { AttendancePage } from "./pages/Attendance";
import { EmployeesPage } from "./pages/Employees";
import { EmployeeDetailPage } from "./pages/EmployeeDetail";
import { DevicesPage } from "./pages/Devices";
import { ReportsPage } from "./pages/Reports";
import { SettingsPage } from "./pages/Settings";
import { LiveRegisterPage } from "./pages/LiveRegister";

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { session, loading, signOut } = useAuth();
  const [page, setPage] = useState<PageId>("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const linked = useLinkedData();

  if (loading) {
    return (
      <main className="auth-shell">
        <section className="auth-card auth-card--loading">
          <span className="auth-kicker">FaceControl</span>
          <h1>Cargando sesión...</h1>
          <p>Verificando acceso con Supabase.</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  const presentToday = linked.summary?.today ?? 0;
  const registeredPeople = linked.summary?.people ?? 0;
  const liveRecords = linked.summary?.records ?? [];

  function navigate(next: PageId) {
    setPage(next);
    if (next !== "employeeDetail") {
      setSelectedEmployee(null);
    }
  }

  function openEmployee(id: string) {
    setSelectedEmployee(id);
    setPage("employeeDetail");
  }

  function handleRegistered(response: RecognitionResponse) {
    if (response.recognized && response.name && response.timestamp) {
      linked.addLiveRecord({ name: response.name, timestamp: response.timestamp });
    }
  }

  function renderPage() {
    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            onNavigate={navigate}
            presentToday={presentToday}
            registeredPeople={registeredPeople}
            records={liveRecords}
            source={linked.source}
          />
        );
      case "attendance":
        return (
          <AttendancePage
            liveRecords={liveRecords}
            source={linked.source}
            onDelete={linked.removeRecord}
            onClear={linked.clearRecords}
          />
        );
      case "liveRegister":
        return (
          <LiveRegisterPage
            onRegistered={handleRegistered}
            records={liveRecords}
            onViewAttendance={() => navigate("attendance")}
            onClearRecords={linked.clearRecords}
          />
        );
      case "employees":
        return (
          <EmployeesPage
            people={linked.people}
            onSelect={openEmployee}
            onNavigate={navigate}
          />
        );
      case "employeeDetail":
        return (
          <EmployeeDetailPage
            personName={selectedEmployee ?? ""}
            people={linked.people}
            liveRecords={liveRecords}
            source={linked.source}
            onBack={() => navigate("employees")}
          />
        );
      case "devices":
        return <DevicesPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
    }
  }

  return (
    <AppLayout page={page} onNavigate={navigate}>
      <div className="fc-session-bar">
        <span>Sesión activa</span>
        <button className="fc-session-bar__action" onClick={() => void signOut()} type="button">
          Cerrar sesión
        </button>
      </div>
      {renderPage()}
      <div className="fc-floating-theme">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </AppLayout>
  );
}
