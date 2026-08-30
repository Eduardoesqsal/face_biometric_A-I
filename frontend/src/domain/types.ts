export type AttendanceRecord = {
  name: string;
  timestamp: string;
};

export type DashboardSummary = {
  records: AttendanceRecord[];
  today: number;
  people: number;
};

export type RecognitionResponse = {
  recognized: boolean;
  name?: string | null;
  timestamp?: string | null;
  registered?: boolean;
  message: string;
};

export type MessageResponse = {
  message: string;
  people?: number | null;
};

export type DeleteAttendanceRequest = {
  all?: boolean;
  name?: string;
  timestamp?: string;
};

/** FaceControl —— entidades de dominio */

export type EmployeeStatus = "Activo" | "Inactivo";

export type Employee = {
  id: string;
  name: string;
  area: string;
  position: string;
  status: EmployeeStatus;
  hireDate: string;
  phone: string;
  email: string;
  avatarColor: string;
};

export type Person = {
  name: string;
  filename: string;
  image_url: string;
};

export type PeopleResponse = {
  people: Person[];
  count: number;
};

export type AttendanceChartPoint = {
  label: string;
  value: number;
};

export type AttendanceEntryType = "Entrada" | "Salida";

export type AttendanceState = "A tiempo" | "Retardo" | "Falta";

export type AttendanceEntry = {
  id: string;
  employeeId: string;
  name: string;
  type: AttendanceEntryType;
  time: string;
  date: string;
  state: AttendanceState;
};

export type DeviceStatus = "En línea" | "Sin conexión";

export type BiometricDevice = {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  lastConnection: string;
  associatedEmployees: number;
};

export type PageId =
  | "dashboard"
  | "attendance"
  | "liveRegister"
  | "employees"
  | "employeeDetail"
  | "devices"
  | "reports"
  | "settings";
