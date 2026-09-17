import { forwardRef, useState, type InputHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

/* ─── Auth Button ─── */
interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ variant = "primary", size = "md", loading, children, disabled, className = "", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dim)] active:scale-[0.98] focus-visible:ring-[var(--color-border-focus)]",
      secondary:
        "bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)] active:scale-[0.98] focus-visible:ring-[var(--color-border-focus)]",
      ghost:
        "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] active:scale-[0.98] focus-visible:ring-[var(--color-border-focus)]",
      danger:
        "bg-[var(--color-critical)] text-white hover:opacity-90 active:scale-[0.98] focus-visible:ring-[var(--color-critical)]",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-5 text-[15px] gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
AuthButton.displayName = "AuthButton";

/* ─── Auth Input ─── */
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-10 w-full rounded border px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? "border-[var(--color-critical)] focus:ring-[var(--color-critical-subtle)] bg-[var(--color-critical-subtle)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-border-focus)] focus:ring-[var(--color-brand-mist)]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-critical-text)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

/* ─── PasswordInput ─── */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<AuthInputProps, "type">>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || "password";
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            className={`h-10 w-full rounded border px-3 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              error
                ? "border-[var(--color-critical)] focus:ring-[var(--color-critical-subtle)] bg-[var(--color-critical-subtle)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-border-focus)] focus:ring-[var(--color-brand-mist)]"
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {error && <p className="text-xs text-[var(--color-critical-text)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/* ─── Checkbox ─── */
interface CheckboxProps {
  label: string;
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ label, id, checked, onChange }: CheckboxProps) {
  const checkId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={checkId} className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        id={checkId}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`flex items-center justify-center w-4 h-4 rounded border transition-colors duration-150 ${
          checked
            ? "bg-[var(--color-brand)] border-[var(--color-brand)]"
            : "bg-[var(--color-surface)] border-[var(--color-border-strong)] group-hover:border-[var(--color-text-muted)]"
        }`}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
    </label>
  );
}

/* ─── Divider ─── */
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px bg-[var(--color-border)] my-1" />;
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-xs text-[var(--color-text-muted)] font-medium">{label}</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

/* ─── AuthCard ─── */
export function AuthCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── PasswordStrength ─── */
export function PasswordStrength({ password }: { password: string }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 4);
  })();

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "var(--color-critical)", "var(--color-warning)", "var(--color-verified)", "var(--color-verified)"];

  if (!password) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-200"
            style={{ background: i <= score ? colors[score] : "var(--color-border)" }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color: colors[score] || "#A1A1AA" }}>
        {labels[score]}
      </span>
    </div>
  );
}

/* ─── AlertBanner ─── */
export function AlertBanner({ type, message }: { type: "error" | "success" | "info"; message: string }) {
  const styles = {
    error:   { bg: "var(--color-critical-subtle)",  border: "var(--color-critical)",  text: "var(--color-critical-text)",  dot: "var(--color-critical)" },
    success: { bg: "var(--color-verified-subtle)",  border: "var(--color-verified)",  text: "var(--color-verified-text)",  dot: "var(--color-verified)" },
    info:    { bg: "var(--color-info-subtle)",      border: "var(--color-info)",      text: "var(--color-info-text)",      dot: "var(--color-info)" },
  };
  const s = styles[type];
  return (
    <div
      className="flex items-start gap-2.5 rounded px-3 py-2.5 text-sm border"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}
    >
      <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: s.dot }} />
      <span>{message}</span>
    </div>
  );
}
