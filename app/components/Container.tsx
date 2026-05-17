export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`container-aysar ${className}`}>
      {children}
    </div>
  );
}
