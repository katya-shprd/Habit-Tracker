"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  /** What is about to happen, in plain words. */
  title: string;
  /** What the user loses if they go ahead. */
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * A confirmation for an action the user cannot undo.
 *
 * It uses the native dialog element, so the browser traps focus inside it and
 * closes it on Escape without any code here. The only rule it adds is that
 * nothing closes the dialog except the user. The state stays with the caller.
 */
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      // Escape closes the dialog. We stop the browser closing it on its own,
      // so the caller stays the single source of truth for open state.
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself. A click
        // inside the panel lands on the panel, so it is left alone.
        if (event.target === ref.current) onCancel();
      }}
    >
      <div className="dialog-panel">
        <h2 className="text-[1rem] font-semibold leading-snug text-[var(--color-ink)]">
          {title}
        </h2>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
          {body}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="btn-outline"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}