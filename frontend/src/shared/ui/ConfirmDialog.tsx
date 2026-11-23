import { useEffect, useRef, type MouseEvent } from "react";
import { Icon } from "../icons/Icon";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const clickedBackdrop =
      event.target === event.currentTarget &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom);

    if (clickedBackdrop) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className="fc-modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fc-confirm-title"
      aria-describedby="fc-confirm-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={handleDialogClick}
    >
      <div className="fc-modal__icon" aria-hidden="true">
        <Icon name="trash" />
      </div>
      <div className="fc-modal__head">
        <h2 id="fc-confirm-title">{title}</h2>
      </div>
      <p id="fc-confirm-description">{description}</p>
      <div className="fc-modal__actions">
        <button className="fc-btn fc-btn--secondary" onClick={onCancel} type="button">
          Cancelar
        </button>
        <button className="fc-btn fc-btn--danger" onClick={onConfirm} type="button">
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
