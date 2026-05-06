import { StatusListContent } from "@/components/statuses/status-list-content";
import { getStatuses } from "@/lib/statuses/queries";

export default async function StatusesPage() {
  const statuses = await getStatuses();
  return <StatusListContent statuses={statuses} />
}
