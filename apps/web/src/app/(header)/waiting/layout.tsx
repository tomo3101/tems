export default function WaitingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-main flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8 p-8">{children}</div>
    </div>
  );
}
