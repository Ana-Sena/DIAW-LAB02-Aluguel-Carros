export default function VehicleArt({ index = 0 }) {
  const colors = ['#8caba2', '#bfbbac', '#818f9d'];
  return (
    <svg viewBox="0 0 400 180" className="vehicle-art" aria-hidden="true">
      <defs>
        <linearGradient id={`paint${index}`} x2="0.2" y2="1">
          <stop stopColor="#f5f6f3" />
          <stop offset="1" stopColor={colors[index % 3]} />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="153" rx="156" ry="11" fill="#153f35" opacity=".08" />
      <path
        d="M47 105 73 93 112 50Q120 42 138 42h100q17 0 27 12l44 40 44 13q11 5 13 18v15H44v-21q0-8 3-14"
        fill={`url(#paint${index})`}
        stroke="#53665e"
        strokeWidth="2"
      />
      <path d="m89 92 34-39h53v39zm98-39h47q8 0 14 7l31 32h-92z" fill="#28433e" />
      <path d="M181 98v43m110-43 9 42" stroke="#53665e" fill="none" />
      <path d="M53 111h34l-10 14H48m285-18 21 8v10h-25" fill="#f4efcd" />
      <path d="M202 106h19" stroke="#53665e" strokeWidth="3" strokeLinecap="round" />
      {[105, 301].map((x) => (
        <g key={x}>
          <circle cx={x} cy="140" r="26" fill="#29342e" />
          <circle cx={x} cy="140" r="15" fill="#d3dad3" />
          <circle cx={x} cy="140" r="7" fill="#64756b" />
        </g>
      ))}
    </svg>
  );
}
