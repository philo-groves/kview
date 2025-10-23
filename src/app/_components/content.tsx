type Props = {
  children: React.ReactNode
}

export default function Content({ children }: Props) {
  return (
    <div className="w-full h-full p-5 rounded-lg overflow-hidden bg-surface">
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
