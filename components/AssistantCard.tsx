import Link from "next/link";

type AssistantCardProps = {
  id: number;
  title: string;
  description: string;
  onDelete?: (id: number) => void;
};

export default function AssistantCard({
  id,
  title,
  description,
  onDelete,
}: AssistantCardProps) {
  const initial = title.trim().charAt(0).toUpperCase() || "A";

  return (
    <Link
      href={`/chat/${id}`}
      className="group flex min-h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-300/35 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-400/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-700 ring-1 ring-teal-100">
            {initial}
          </div>
          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition group-hover:border-teal-200 group-hover:text-teal-700">
            Assistant
          </span>
        </div>

        <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-2 max-h-24 overflow-hidden text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-teal-700">
          Открыть чат
        </span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              className="rounded-lg border border-red-100 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete(id);
              }}
              type="button"
            >
              Удалить
            </button>
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition group-hover:bg-teal-600 group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
