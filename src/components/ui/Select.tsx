"use client";

// Simple native select wrapper components
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

function Select({ value, onValueChange, children }: SelectProps) {
  // Extract options from children
  const options = Array.isArray(children)
    ? children.filter((child) => child?.type?.name === "SelectItem")
    : [];

  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="h-10 px-3 rounded-lg border border-border bg-background text-foreground cursor-pointer hover:bg-foreground/5"
    >
      {options.map((option: any) => (
        <option key={option.props.value} value={option.props.value}>
          {option.props.children}
        </option>
      ))}
    </select>
  );
}

function SelectTrigger({ children, className = "" }: SelectTriggerProps) {
  return null; // Not used with native select
}

function SelectValue({ placeholder }: SelectValueProps) {
  return null; // Not used with native select
}

function SelectContent({ children }: SelectContentProps) {
  return null; // Not used with native select
}

function SelectItem({ value, children }: SelectItemProps) {
  return null; // Rendered by parent Select
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
