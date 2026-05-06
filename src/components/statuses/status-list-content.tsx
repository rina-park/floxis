import type { StatusListRow } from "@/types/status";

type StatusListContentProps = {
  statuses: StatusListRow[];
};

export function StatusListContent({ statuses }: StatusListContentProps) {
  return (
    <ul>
      {statuses.map((status) =>(
        <li key={status.id}>
          <span>{status.key}</span>
          <span>{status.name}</span>
        </li>
      ))}
    </ul>
  );
}
