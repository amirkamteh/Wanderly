import { LoadingRow } from "@/components/LoadingCard";

export default function Loading() {
  return (
    <div className="space-y-10 py-8">
      {Array.from({ length: 3 }, (_, i) => (
        <LoadingRow key={i} />
      ))}
    </div>
  );
}
