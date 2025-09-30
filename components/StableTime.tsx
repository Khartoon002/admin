"use client";
import { format } from "date-fns";

export default function StableTime({ iso }: { iso: string }) {
  return <time dateTime={iso}>{format(new Date(iso), "yyyy-MM-dd HH:mm")}</time>;
}
