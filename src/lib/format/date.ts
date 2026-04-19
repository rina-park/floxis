function isInvalidDate(value: Date): boolean {
  return Number.isNaN(value.getTime());
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateTimeParts(value: string) {
  const date = new Date(value);

  if (isInvalidDate(date)) {
    return null;
  }

  return {
    year: date.getFullYear(),
    month: pad2(date.getMonth() + 1),
    day: pad2(date.getDate()),
    hours: pad2(date.getHours()),
    minutes: pad2(date.getMinutes()),
  };
}

export function formatDateOnly(value: string | null): string {
  if (!value) {
    return "—";
  }

  // due_date is treated as a date-only value, not a datetime.
  return value.slice(0, 10);
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  // created_at and completed_at are treated as datetime values for display.
  const parts = toDateTimeParts(value);

  if (!parts) {
    return value;
  }

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hours}:${parts.minutes}`;
}
