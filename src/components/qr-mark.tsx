function cellsFromCode(code: string) {
  const size = 21;
  const cells: boolean[] = [];
  let h = 2166136261;
  for (let i = 0; i < code.length; i++) h = Math.imul(h ^ code.charCodeAt(i), 16777619);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const finder =
        (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      if (finder) {
        const dx = x < 7 ? x : x >= size - 7 ? x - (size - 7) : x;
        const dy = y < 7 ? y : y >= size - 7 ? y - (size - 7) : y;
        const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
        cells.push(ring);
      } else {
        const bit = (h ^ Math.imul(x + 3, y + 11) ^ code.charCodeAt((x + y) % code.length)) & 1;
        cells.push(bit === 1);
      }
    }
  }
  return { size, cells };
}

export function QrMark({ value, className }: { value: string; className?: string }) {
  const { size, cells } = cellsFromCode(value);
  const s = 10;
  return (
    <svg
      viewBox={`0 0 ${size * s} ${size * s}`}
      className={className}
      role="img"
      aria-label={`Código visual ${value}`}
    >
      <rect width={size * s} height={size * s} fill="#0b0912" />
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={(i % size) * s}
            y={Math.floor(i / size) * s}
            width={s}
            height={s}
            fill={i % 17 === 0 ? "#22d3ee" : "#e8e4ff"}
          />
        ) : null,
      )}
    </svg>
  );
}
