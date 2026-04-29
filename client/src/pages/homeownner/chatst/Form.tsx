import { useState } from "react";

interface Props {
  onSubmit: (message: string) => Promise<void> | void;
  disabled?: boolean;
}

const Form: React.FC<Props> = ({ onSubmit, disabled }) => {
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    await onSubmit(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
      >
        Send
      </button>
    </form>
  );
};

export default Form;
