import type { StatusListRow } from "@/types/status";

export async function getStatuses(): Promise<StatusListRow[]> {
  const statuses: StatusListRow[] = [
    {
      id: "status-pending",
      key: "pending",
      name: "未着手",
    },
    {
      id: "status-in-progress",
      key: "in_progress",
      name: "進行中",
    },
  ];
  return statuses;
}
