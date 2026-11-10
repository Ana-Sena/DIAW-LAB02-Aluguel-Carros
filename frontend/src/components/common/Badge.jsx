import { labels } from '../../utils/format.js';

export default function Badge({ status }) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      <i />
      {labels[status]}
    </span>
  );
}
