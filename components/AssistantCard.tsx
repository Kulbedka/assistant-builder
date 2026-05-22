import Link from "next/link";

type AssistantCardProps = {
  id: number;
  title: string;
  description: string;
};

export default function AssistantCard({
  id,
  title,
  description,
}: AssistantCardProps) {
  return (
    <Link href={`/chat/${id}`}>
      <div className="border rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
      </div>
    </Link>
  );
}