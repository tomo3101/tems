export default function ReserveLauout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-main flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-4 p-8">{children}</div>
    </div>
  );
}
