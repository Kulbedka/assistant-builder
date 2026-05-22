type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="cursor-pointer rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-gray-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}