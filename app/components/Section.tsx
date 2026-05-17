export function Section({
  children,
  className = "",
  id,
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag id={id} className={`section-aysar ${className}`}>
      {children}
    </Tag>
  );
}
