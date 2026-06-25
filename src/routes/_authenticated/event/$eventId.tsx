
/* eslint-disable react-refresh/only-export-components */
import { ArrowLeft, CalendarDays, Check, Clock, Edit2, MapPin, Trash2, Users, Link2 } from "lucide-react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/context/auth-context"
import { useManageEventsStore } from "@/stores/manage-events-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import fallbackBanner from "/images/event-fallback-image.jpg"
import { formatDate, formatTime, getNameInitials } from "@/utils"
import { useEffect, useState } from "react"
import type { UserType } from "@/types/user"
import manageUsers from "@/api/manage-users"

/*
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Section comments use U+2500 box drawing characters to visually separate blocks.
*/

export const Route = createFileRoute('/_authenticated/event/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const [creator, setCreator] = useState<UserType | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { eventId } = Route.useParams()

  const event = useManageEventsStore((state) =>
    state.events.find((item) => item.id === eventId),
  )

  const isOwner = Boolean(user && event && event.created_by === user.uid)
  const hasJoined = Boolean(event && !isOwner && false)

  useEffect(() => {
    const fetchCreator = async () => {
      if (event && event.created_by) {
        const user = await manageUsers.getUserByUid(event.created_by)
        setCreator(user)
      }
    }

    fetchCreator()
  }, [eventId])

  const ctaButton = event ? (
    isOwner ? (
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/event/edit-event/$eventId" params={{ eventId }}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/90 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            aria-label="Edit event"
          >
            <Edit2 className="size-4" aria-hidden="true" />
            Edit event
          </button>
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive transition hover:border-destructive/70 hover:bg-destructive/20"
          aria-label="Delete event"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete event
        </button>
      </div>
    ) : hasJoined ? (
      <Button className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
        variant="secondary"
      >
        <Check className="size-4" aria-hidden="true" />
        Already joined
      </Button>
    ) : (
      <Button className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
        <Users className="size-4" aria-hidden="true" />
        Join event
      </Button>
    )
  ) : null

  if (!event) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card/80 p-10 text-center shadow-sm backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Event details</p>
          <h1 className="mt-4 text-3xl font-semibold">Event not found</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We could not locate the event details. Please return to the event list and try again.
          </p>
          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate({ to: "/events" })}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/events" })}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to events
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-border/70 bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {event.category || "Event"}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
              {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : "Scheduled"}
            </span>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm shadow-slate-900/5">
          <div className="relative overflow-hidden bg-slate-950/5">
            <img
              src={event.banner_image || fallbackBanner}
              alt={event.title}
              className="h-85 w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 text-white sm:px-10">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200/80">Organized by {event.organizer_name}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {event.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200/80 sm:text-base">
                {event.description || "A polished overview of this event with essential details for attendees."}
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.6fr_0.9fr] lg:p-8">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <CalendarDays className="size-5" aria-hidden="true" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Event date</p>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {formatDate(event.start_date)}
                        {event.end_date ? (
                          <span className="text-sm font-medium text-muted-foreground">{' '}—{' '}{formatDate(event.end_date)}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <Clock className="size-5" aria-hidden="true" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Time</p>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {formatTime(event.start_time)}{event.end_time ? (
                          <span className="text-sm font-medium text-muted-foreground">{' '}—{' '}{formatTime(event.end_time)}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
                {/* ────────────────────────────────────────────────────────────────────────────── */}
                {/* Location / Meeting link card - shows meeting link for online events */}
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    {event.event_type === "online" ? (
                      <Link2 className="size-5" aria-hidden="true" />
                    ) : (
                      <MapPin className="size-5" aria-hidden="true" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{event.event_type === "online" ? "Meeting link" : "Location"}</p>
                      {event.event_type === "online" ? (
                        event.meeting_link ? (
                          <a
                            href={event.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm font-semibold text-primary underline"
                          >
                            Open meeting link
                          </a>
                        ) : (
                          <p className="mt-1 text-sm font-semibold text-foreground">Link not provided</p>
                        )
                      ) : (
                        <p className="mt-1 text-base font-semibold text-foreground">{event.location || "TBD"}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <Users className="size-5" aria-hidden="true" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Attendees</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{event.attendee_count ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="rounded-3xl border-border/70 bg-background/90 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>About this event</CardTitle>
                  <CardDescription>
                    A quick summary of what attendees can expect from this session.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>{event.description || "No event description is available yet."}</p>
                  <p>
                    Hosted by {event.organizer_name}, this session is designed for anyone interested
                    in {event.category || "a compelling topic"} with a clean, engaging event flow.
                  </p>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6 rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Event summary</p>
                <div className="rounded-3xl bg-card/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p className="text-sm font-semibold text-foreground">{event.organizer_name}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-sm font-semibold text-foreground">{event.event_type || "Online"}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="text-sm font-semibold text-foreground">{event.capacity ?? "TBD"}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden bg-accent text-accent-content font-semibold flex items-center justify-center">
                        {creator?.avatar ? (
                          <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{getNameInitials(creator?.name ?? event.organizer_name ?? "")}</span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">{creator?.name ?? event.organizer_name ?? event.created_by}</p>
                        {creator?.email ? <p className="text-xs text-muted-foreground">{creator.email}</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-card/80 p-5 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Action</p>
                    <p className="text-base font-semibold text-foreground">
                      {isOwner ? "Event owner" : hasJoined ? "Already joined" : "Ready to join"}
                    </p>
                  </div>
                  <div>{ctaButton}</div>
                </div>
                {isOwner ? (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    As the creator of this event, you can review the details and prepare the content
                    before launching it to the wider audience.
                  </p>
                ) : (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    Join or review this event once you are ready. The button is a visual placeholder
                    until the join experience is implemented.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}
