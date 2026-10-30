// Server-rendered, fixed vector paths: no background image or animation script.
function createDotPaths(scale = 1) {
  const paths = ["", "", ""];
  let seed = 4271;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let index = 0; index < 96; index += 1) {
    const x = (random() * 1000).toFixed(1);
    const y = (random() * 700).toFixed(1);
    const radius = ((1.2 + random() * 1.8) * scale).toFixed(2);
    const diameter = (Number(radius) * 2).toFixed(1);
    paths[index % 3] += `M${x},${y}m-${radius},0a${radius},${radius} 0 1,0 ${diameter},0a${radius},${radius} 0 1,0 -${diameter},0`;
  }
  return paths;
}
const paths = createDotPaths();
const finePaths = createDotPaths(0.3);

export function SpaceDots({ className = "", fine = false }: { className?: string; fine?: boolean }) {
  const dots = fine ? finePaths : paths;
  return (
    <svg className={`space-dots ${className}`} aria-hidden="true" focusable="false" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
      <path d={dots[0]} fill="#FFFFFF" opacity=".3" />
      <path d={dots[1]} fill="#FFFFFF" opacity=".55" />
      <path d={dots[2]} fill="#FFD7C4" opacity=".75" />
    </svg>
  );
}
