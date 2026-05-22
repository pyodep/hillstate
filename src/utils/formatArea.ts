export function formatArea(value: number) {
  const truncated = Math.trunc(value * 100) / 100;

  return truncated.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
