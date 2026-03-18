type ShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

type SectionProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { label: string; value: string }[];
};

export function DashboardShell({ title, description, children }: ShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(149,106,250,0.16),_transparent_38%),linear-gradient(180deg,rgba(149,106,250,0.08),transparent_28%)] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-[28px] border border-white/10 bg-background/90 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur">
          <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
            EventEase Booking Hub
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/70 md:text-base">
            {description}
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
}: SectionProps) {
  return (
    <section className="rounded-[24px] border border-black/5 bg-background/95 p-6 shadow-[0_14px_50px_rgba(149,106,250,0.12)]">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-foreground/65">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ActionButton({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles = {
    primary:
      "bg-primary text-white hover:opacity-90 disabled:bg-primary/50 disabled:text-white/80",
    secondary:
      "border border-primary/25 bg-primary/8 text-primary hover:bg-primary/14 disabled:border-primary/10 disabled:text-primary/40",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function TextInput({ label, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-foreground/80">
      <span className="font-medium">{label}</span>
      <input
        {...props}
        className={`rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ""}`}
      />
    </label>
  );
}

export function SelectInput({ label, options, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-foreground/80">
      <span className="font-medium">{label}</span>
      <select
        {...props}
        className={`rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ""}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextArea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-foreground/80">
      <span className="font-medium">{label}</span>
      <textarea
        {...props}
        className={`min-h-32 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ""}`}
      />
    </label>
  );
}

export function StatusBadge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
}) {
  const tones = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    neutral: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white/90 p-5 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/45">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-foreground/60">{hint}</p>
    </div>
  );
}

export function MessageBanner({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-primary/20 bg-primary/5 px-5 py-8 text-center">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/65">
        {description}
      </p>
    </div>
  );
}
