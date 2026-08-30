import type { RefObject } from "react";

type CameraPanelProps = {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  isRunning: boolean;
  busy: boolean;
  message: string;
  error: string | null;
  toggleCamera: () => void;
  recordCount: number;
  onViewAttendance: () => void;
  onClearRecords: () => Promise<void>;
};

export function CameraPanel({
  videoRef,
  canvasRef,
  isRunning,
  busy,
  message,
  error,
  toggleCamera,
  recordCount,
  onViewAttendance,
  onClearRecords,
}: CameraPanelProps) {
  const isError = Boolean(error);

  async function handleClearRecords() {
    if (!recordCount || !window.confirm("¿Quieres eliminar todos los registros de asistencia?")) {
      return;
    }

    await onClearRecords();
  }

  return (
    <article className="card card__pad camera-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">VERIFICACION BIOMETRICA</span>
          <h2>Captura y reconocimiento</h2>
        </div>
        <span className={`pill ${isRunning ? "pill--live" : ""}`}>{isRunning ? "En vivo" : "Desconectada"}</span>
      </div>
      <div className="camera-feed">
        <span className="camera-feed__corner camera-feed__corner--tl" aria-hidden="true" />
        <span className="camera-feed__corner camera-feed__corner--tr" aria-hidden="true" />
        <span className="camera-feed__corner camera-feed__corner--bl" aria-hidden="true" />
        <span className="camera-feed__corner camera-feed__corner--br" aria-hidden="true" />
        <div className="camera-feed__status">
          <span className={`recognition-status ${isRunning ? "recognition-status--live" : "recognition-status--off"}`}>
            <i />
            {isRunning ? "Escaneo activo" : "Camara apagada"}
          </span>
        </div>
        <video ref={videoRef} autoPlay playsInline muted />
        {isRunning ? <span className="scan-line" aria-hidden="true" /> : null}
        {!isRunning ? (
          <div className="camera-feed__overlay">
            <span className="overlay-icon overlay-icon--biometric" aria-hidden="true">
              <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="80" cy="80" r="58" strokeWidth="1.4" opacity="0.16" />
                <circle cx="80" cy="80" r="46" strokeWidth="1.2" opacity="0.24" />
                <circle cx="80" cy="80" r="33" strokeWidth="1" opacity="0.18" />
                <path d="M52 62c3-16 14-26 28-26s25 10 28 26" strokeWidth="1.4" opacity="0.8" />
                <path d="M55 101c7 10 15 15 25 15s18-5 25-15" strokeWidth="1.4" opacity="0.8" />
                <path d="M46 44l8 8M114 44l-8 8M46 116l8-8M114 116l-8-8" strokeWidth="1.1" opacity="0.18" />
                <path d="M80 34v14M80 112v14M34 80h14M112 80h14" strokeWidth="1.1" opacity="0.18" />
                <path d="M58 72c3-8 11-13 22-13s19 5 22 13" strokeWidth="1.3" opacity="0.55" />
                <path d="M63 88c4 5 9 7 17 7s13-2 17-7" strokeWidth="1.3" opacity="0.55" />
                <path d="M63 70c2-2 5-3 8-3s6 1 8 3" strokeWidth="1.1" opacity="0.5" />
                <path d="M81 70c2-2 5-3 8-3s6 1 8 3" strokeWidth="1.1" opacity="0.5" />
                <circle cx="63" cy="78" r="3.2" fill="currentColor" stroke="none" opacity="0.9" />
                <circle cx="97" cy="78" r="3.2" fill="currentColor" stroke="none" opacity="0.9" />
                <circle cx="80" cy="89" r="2.9" fill="currentColor" stroke="none" opacity="0.85" />
                <path d="M60 78l6 3M100 78l-6 3M74 90l6 0M71 95c3 2 6 2 9 0" strokeWidth="1.1" opacity="0.55" />
                <path d="M54 52c5-5 13-8 26-8s21 3 26 8" strokeWidth="1.1" opacity="0.22" />
                <path d="M50 120c9 6 18 9 30 9s21-3 30-9" strokeWidth="1.1" opacity="0.14" />
              </svg>
            </span>
            <p>Activa la cÃ¡mara para comenzar el reconocimiento facial</p>
          </div>
        ) : null}
        <canvas ref={canvasRef} className="hidden-canvas" />
      </div>
      <div className="camera-actions">
        <button className={`btn ${isRunning ? "btn--secondary" : "btn--primary"} btn--block`} onClick={toggleCamera} type="button" disabled={!isRunning ? busy : false}>
          {isRunning ? "Detener camara" : "Activar camara"}
        </button>
      </div>
      <div
        className={`result ${isError ? "result--error" : "result--success"}`}
        role="status"
        aria-live="polite"
      >
        <i className="result__dot" aria-hidden="true" />
        <span>{error || message}</span>
      </div>
      <div className="camera-record-actions">
        <button className="fc-btn fc-btn--ghost fc-btn--sm" onClick={onViewAttendance} type="button">
          Ver registros ({recordCount})
        </button>
        <button
          className="fc-btn fc-btn--ghost fc-btn--sm fc-btn--danger-text"
          onClick={() => void handleClearRecords()}
          type="button"
          disabled={!recordCount}
        >
          Eliminar registros
        </button>
      </div>
    </article>
  );
}
