import Modal from '../common/Modal.jsx';

export default function AdminModal({ open, onClose, title, size = 'md', children }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size={size}>
      {children}
    </Modal>
  );
}
