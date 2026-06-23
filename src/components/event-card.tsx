import type { ReactNode } from "react"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import fallbackBanner from "/images/event-fallback-image.jpg"

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { EventType } from "@/types/event"

type EventCardProps = {
  event: EventType
  badge?: string
  action?: ReactNode
  className?: string
}

export function EventCard({ event, badge, action, className }: EventCardProps) {
  const eventDate = event.start_date
    ? new Date(event.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "TBD"

  const eventTime = event.start_time ? event.start_time.substring(0, 5) : "TBD"
  const statusLabel = badge ||
    (event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : undefined)

  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-xl", className)}>
      <div className="relative h-40">
        <img
          alt={event.title}
          className="h-full w-full object-cover"
          src={event.banner_image || fallbackBanner}
        />
        {statusLabel ? (
          <span className="absolute right-4 top-4 rounded-lg bg-chart-3/10 px-2 py-1 text-xs font-semibold leading-4 text-chart-3">
            {statusLabel}
          </span>
        ) : null}
      </div>

      <CardHeader className="flex-col gap-3 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.organizer_name}</CardDescription>
          </div>
          <span className="rounded-full border border-border/70 bg-muted px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
            {event.category || "Event"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-6">
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            {eventDate}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            {eventTime}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {event.location || "Location TBD"}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 text-primary" aria-hidden="true" />
          <span>
            {event.attendee_count ?? 0} attendee{(event.attendee_count ?? 0) !== 1 ? "s" : ""}
          </span>
        </div>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardFooter>
    </Card>
  )
}
