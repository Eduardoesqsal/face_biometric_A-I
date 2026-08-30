import type { AttendanceRecord, RecognitionResponse } from "../domain/types";
import { useCameraRecognition } from "../application/hooks/useCameraRecognition";
import { usePeopleForm } from "../application/hooks/usePeopleForm";
import { CameraPanel } from "../features/registration/components/CameraPanel";
import { PeopleFormCard } from "../features/registration/components/PeopleFormCard";
import { Card } from "../shared/ui";
import { Icon } from "../shared/icons/Icon";

type LiveRegisterProps = {
  onRegistered: (response: RecognitionResponse) => void;
  records: AttendanceRecord[];
  onViewAttendance: () => void;
  onClearRecords: () => Promise<void>;
};

export function LiveRegisterPage({ onRegistered, records, onViewAttendance, onClearRecords }: LiveRegisterProps) {
  const peopleForm = usePeopleForm();
  const camera = useCameraRecognition({
    onRegistered: (response: RecognitionResponse) => onRegistered(response),
  });

  async function handlePeopleSubmit(formData: FormData) {
    await peopleForm.submit(formData);
  }

  return (
    <div className="fc-page">
      <div className="fc-register-banner">
        <span className="fc-banner-icon" aria-hidden="true">
          <Icon name="devices" />
        </span>
        <div>
          <h2 className="fc-card-title">Terminal de reconocimiento</h2>
          <p className="fc-card-desc">
            Activa la cámara y coloca tu rostro frente a ella para registrar tu asistencia en tiempo real.
          </p>
        </div>
      </div>

      <div className="fc-register-grid">
        <CameraPanel
          videoRef={camera.videoRef}
          canvasRef={camera.canvasRef}
          isRunning={camera.isRunning}
          busy={camera.busy}
          message={camera.message}
          error={camera.error}
          toggleCamera={camera.toggleCamera}
          recordCount={records.length}
          onViewAttendance={onViewAttendance}
          onClearRecords={onClearRecords}
        />

        <PeopleFormCard
          onSubmit={handlePeopleSubmit}
          submitting={peopleForm.submitting}
          message={peopleForm.message}
          isError={peopleForm.isError}
        />
      </div>

      <Card className="fc-howto">
        <h3 className="fc-card-title">Cómo funciona</h3>
        <ol className="fc-howto__list">
          <li>Activa la cámara con el botón "Activar cámara".</li>
          <li>
            El sistema compara tu rostro contra los perfiles registrados a través del{" "}
            <code>POST /api/recognize</code>.
          </li>
          <li>
            Si no estás registrado, usa el formulario para agregar tu foto de referencia con{" "}
            <code>POST /api/people</code>.
          </li>
          <li>Una vez reconocido, tu asistencia queda guardada en el historial del backend.</li>
        </ol>
      </Card>
    </div>
  );
}
