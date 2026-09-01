import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex" style={{ gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
        {danger && (
          <span style={{ color: 'var(--color-red)', flexShrink: 0 }}>
            <AlertTriangle size={22} />
          </span>
        )}
        <p style={{ margin: 0 }}>{message}</p>
      </div>
      <div className="flex" style={{ gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
