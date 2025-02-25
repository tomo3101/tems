export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-main flex items-center justify-center">
      {children}
    </div>
  );
}
