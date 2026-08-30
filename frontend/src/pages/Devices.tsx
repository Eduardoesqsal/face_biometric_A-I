import { Card } from "../shared/ui";
import { Icon } from "../shared/icons/Icon";

export function DevicesPage() {
  return (
    <div className="fc-page">
      <div className="fc-source-banner">
        <span className="fc-source-pill fc-source-pill--live">
          <i />
          Datos reales del backend
        </span>
      </div>

      <Card className="fc-table-card">
        <div className="fc-empty" style={{ padding: 48 }}>
          <Icon name="devices" />
          <p>No hay dispositivos biométricos registrados todavía.</p>
        </div>
      </Card>
    </div>
  );
}
