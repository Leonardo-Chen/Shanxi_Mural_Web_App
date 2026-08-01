export default function InteractiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="coloring-root min-h-screen">{children}</div>;
}
