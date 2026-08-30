import { useEffect, useState } from "react";
import type { Person } from "../../domain/types";
import { useAttendanceDashboard } from "./useAttendanceDashboard";
import { getPeople } from "../../infrastructure/api/peopleApi";

export type DataSource = "live";

export function useLinkedData() {
  const dashboard = useAttendanceDashboard();
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    getPeople()
      .then((response) => setPeople(response.people))
      .catch(() => setPeople([]));
  }, []);

  return { ...dashboard, people, source: "live" as const };
}
