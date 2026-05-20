export function MockField({
  label,
  placeholder,
  type = "text",
  textarea = false
}: {
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      {textarea ? (
        <textarea
          className="mt-2 min-h-28 w-full border border-line bg-white px-3 py-3 text-sm outline-none transition focus:border-green"
          placeholder={placeholder}
        />
      ) : (
        <input
          className="mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
          placeholder={placeholder}
          type={type}
        />
      )}
    </label>
  );
}
