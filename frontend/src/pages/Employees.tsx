import { useMemo, useState } from "react";
import type { PageId, Person } from "../domain/types";
import { Badge, Card } from "../shared/ui";
import { Icon } from "../shared/icons/Icon";

type EmployeesPageProps = {
  people: Person[];
  onSelect: (name: string) => void;
  onNavigate: (page: PageId) => void;
};

const AVATAR_FALLBACKS = ["#2ecc71", "#3aa7ff", "#f5a623", "#9b59b6", "#1abc9c", "#e74c3c"];

export function EmployeesPage({ people, onSelect, onNavigate }: EmployeesPageProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((person) => (q ? person.name.toLowerCase().includes(q) : true));
  }, [people, query]);

  return (
    <div className="fc-page">
      <div className="fc-source-banner">
        <span className="fc-source-pill fc-source-pill--live">
          <i />
          {people.length} personas registradas con imagen
        </span>
      </div>

      <div className="fc-page-toolbar">
        <label className="fc-search fc-search--wide">
          <Icon name="search" className="fc-search__icon" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre..."
            aria-label="Buscar empleado"
          />
        </label>

        <button
          className="fc-btn fc-btn--primary"
          onClick={() => onNavigate("liveRegister")}
          type="button"
        >
          <Icon name="plus" />
          Registrar persona
        </button>
      </div>

      <Card className="fc-table-card">
        <div className="fc-employees-grid">
          {filtered.length === 0 ? (
            <div className="fc-empty" style={{ gridColumn: "1 / -1" }}>
              Aún no hay personas registradas con imagen.
            </div>
          ) : (
            filtered.map((person, index) => (
              <div
                key={person.name}
                className="fc-employee-card"
                onClick={() => onSelect(person.name)}
                role="button"
                tabIndex={0}
              >
                <img
                  className="fc-employee-card__photo"
                  src={person.image_url}
                  alt={person.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.nextElementSibling?.classList.add("fc-avatar--visible");
                  }}
                />
                <span
                  className="fc-employee-card__fallback"
                  style={{ background: AVATAR_FALLBACKS[index % AVATAR_FALLBACKS.length] }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </span>
                <div className="fc-employee-card__info">
                  <strong className="fc-employee-card__name">{person.name}</strong>
                  <span className="fc-employee-card__file">{person.filename}</span>
                </div>
                <Badge tone="success">Activo</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
