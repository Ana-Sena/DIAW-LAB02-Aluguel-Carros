export default function Stat({ title, value, detail, icon: Icon }) {
  return (
    <article className="stat">
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
      <span className="stat-icon">
        <Icon size={21} />
      </span>
    </article>
  );
}
