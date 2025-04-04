interface ButtonProps {
  name: string;
}

export default function Button({ name }: ButtonProps) {
  return (
    <button className="p-2 h-full w-full bg-gray-100 rounded-md">{name}</button>
  );
}
