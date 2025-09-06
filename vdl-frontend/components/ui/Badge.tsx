export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
      {children}
    </span>
  );
}
