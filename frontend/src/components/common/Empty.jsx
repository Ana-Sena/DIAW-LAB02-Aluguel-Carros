import { FileText } from 'lucide-react';

export default function Empty({ text }) {
  return (
    <div className="empty">
      <FileText size={28} />
      <h3>Nada por aqui ainda</h3>
      <p>{text}</p>
    </div>
  );
}
