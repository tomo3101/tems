export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="w-full max-w-4xl flex flex-col gap-8 p-8">{children}</div>
    </>
  );
}
