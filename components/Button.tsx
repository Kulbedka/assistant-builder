import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-teal-600 text-white shadow-sm shadow-teal-900/10 hover:bg-teal-700 focus-visible:outline-teal-600 disabled:bg-teal-300",
    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-300/40 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-teal-600 disabled:bg-slate-100 disabled:text-slate-400",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-teal-600 disabled:text-slate-400",
  };

  return (
    <button
      className={`inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
