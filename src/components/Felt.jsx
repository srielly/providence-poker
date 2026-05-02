export default function Felt() {
  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      pointerEvents:   'none',
      zIndex:          0,
      opacity:         0.025,
      backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
      backgroundSize:  '8px 8px',
    }} />
  );
}
