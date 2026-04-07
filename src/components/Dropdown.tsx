
interface DropdownProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onChange: (val: T) => void;
  disabled?: boolean;
}

export const Dropdown = <T extends string>({
  label,
  options,
  value,
  onChange,
  disabled
}: DropdownProps<T>) => {
  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as T)}
        className="dropdown-select"
        disabled={disabled}
      >
        {options.length === 0 && <option value="" disabled>Loading...</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
