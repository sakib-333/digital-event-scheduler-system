
/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react"
import { ArrowLeft, CalendarDays, Clock, Edit2, Link2, MapPin, Trash2, Users } from "lucide-react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import fallbackBanner from "/images/event-fallback-image.jpg"
import { formatDate, formatTime, getNameInitials, usePageTitle } from "@/utils"
import { useTranslation } from "react-i18next"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { useManageEventsStore } from "@/stores/manage-events-store"
import { useManageUsersStore } from "@/stores/manage-users-store"
import { useManageEventParticipantsStore } from "@/stores/manage-event-participants-store"

/*
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Section comments use U+2500 box drawing characters to visually separate blocks.
*/

export const Route = createFileRoute('/_authenticated/event/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  usePageTitle("Events Details");
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { eventId } = Route.useParams()
  const {user: eventCreator, getUserById } = useManageUsersStore()
  const { event, getEventById, deleteEvent, isLoading, isDeleting, error } = useManageEventsStore()
  const { hasJoined, loading: participationLoading, checkParticipation, joinEvent, leaveEvent } = useManageEventParticipantsStore()

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        await getEventById(eventId)
      }
    }

    fetchEvent()
  }, [eventId, getEventById])

  useEffect(() => {
    const fetchCreator = async () => {
      if (event && event.created_by) {
        await getUserById(event.created_by)
      }
    }
    fetchCreator()
    }, [eventId, event, getUserById])

  useEffect(() => {
    const fetchParticipation = async () => {
      if (user && eventId && event) {
        await checkParticipation(user.uid, eventId)
      }
    }

    fetchParticipation()
  }, [user, eventId, event, checkParticipation])

  const isOwner = Boolean(user && event && event.created_by === user.uid)

  const refreshParticipation = async () => {
    if (!user || !event) {
      return
    }

    await getEventById(event.id)
    await checkParticipation(user.uid, event.id)
  }

  const handleJoin = async () => {
    if (!user || !event) {
      return
    }

    const success = await joinEvent(user.uid, event.id)

    if (!success) {
      return
    }

    await refreshParticipation()
  }

  const handleLeave = async () => {
    if (!user || !event) {
      return
    }

    const success = await leaveEvent(user.uid, event.id)

    if (!success) {
      return
    }

    await refreshParticipation()
  }

  const handleDeleteEvent = async () => {
    if (!event) return

    const success = await deleteEvent(event.id)
    if (success) {
      navigate({ to: "/events" })
    }
  }

  const ctaButton = event ? (
    isOwner ? (
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/event/edit-event/$eventId" params={{ eventId }}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/90 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            aria-label={t("routes.eventDetails.actions.edit")}
          >
            <Edit2 className="size-4" aria-hidden="true" />
            {t("routes.eventDetails.actions.edit")}
          </button>
        </Link>
        <ConfirmationDialog
          actionLabel={isDeleting ? "Deleting..." : "Yes, Delete"}
          cancelLabel="Keep Event"
          description={
            <>
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{event.title}</strong>? This
              action <strong>cannot be undone</strong>.
            </>
          }
          disabled={isDeleting}
          icon={<Trash2 />}
          mediaClassName="bg-destructive/10 text-destructive"
          title="Delete Event"
          variant="destructive"
          onConfirm={handleDeleteEvent}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive transition hover:border-destructive/70 hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50"
            aria-label={t("routes.eventDetails.actions.delete")}
            disabled={isDeleting}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {t("routes.eventDetails.actions.delete")}
          </button>
        </ConfirmationDialog>
      </div>
    ) : hasJoined ? (
      <Button className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
        variant="secondary"
        onClick={handleLeave}
        disabled={participationLoading}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("routes.eventDetails.actions.leave")}
      </Button>
    ) : (
      <Button className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
        onClick={handleJoin}
        disabled={participationLoading}
      >
        <Users className="size-4" aria-hidden="true" />
        {t("routes.eventDetails.actions.join")}
      </Button>
    )
  ) : null

  if (isLoading && !event) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card/80 p-10 text-center shadow-sm backdrop-blur-xl">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <h1 className="text-3xl font-semibold">
            {t("routes.events.loading")}
          </h1>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card/80 p-10 text-center shadow-sm backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-destructive">
            {t("routes.eventDetails.eyebrow")}
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            {t("routes.eventDetails.notFoundTitle")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {error}
          </p>
          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate({ to: "/events" })}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("routes.eventDetails.backToEvents")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card/80 p-10 text-center shadow-sm backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {t("routes.eventDetails.eyebrow")}
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            {t("routes.eventDetails.notFoundTitle")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t("routes.eventDetails.notFoundDescription")}
          </p>
          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate({ to: "/events" })}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("routes.eventDetails.backToEvents")}
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
              {t("routes.eventDetails.backToEvents")}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-border/70 bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {event.category
                ? t(`routes.common.categories.${event.category}`, {
                    defaultValue: event.category,
                  })
                : t("routes.eventDetails.categoryFallback")}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
              {event.status
                ? t(`routes.eventDetails.status.${event.status}`, {
                    defaultValue:
                      event.status.charAt(0).toUpperCase() +
                      event.status.slice(1),
                  })
                : t("routes.eventDetails.status.scheduled")}
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
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200/80">
                {t("routes.eventDetails.organizedBy", {
                  name: event.organizer_name,
                })}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {event.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200/80 sm:text-base">
                {event.description ||
                  t("routes.eventDetails.descriptionFallback")}
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
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {t("routes.eventDetails.labels.eventDate")}
                      </p>
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
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {t("routes.eventDetails.labels.time")}
                      </p>
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
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {event.event_type === "online"
                          ? t("routes.eventDetails.labels.meetingLink")
                          : t("routes.eventDetails.labels.location")}
                      </p>
                      {event.event_type === "online" ? (
                        event.meeting_link ? (
                          <a
                            href={event.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm font-semibold text-primary underline"
                          >
                            {t("routes.eventDetails.openMeetingLink")}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {t("routes.eventDetails.linkNotProvided")}
                          </p>
                        )
                      ) : (
                        <p className="mt-1 text-base font-semibold text-foreground">
                          {event.location || t("routes.eventDetails.tbd")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <Users className="size-5" aria-hidden="true" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {t("routes.eventDetails.labels.attendees")}
                      </p>
                      <p className="mt-1 text-base font-semibold text-foreground">{event.attendee_count ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="rounded-3xl border-border/70 bg-background/90 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>{t("routes.eventDetails.about.title")}</CardTitle>
                  <CardDescription>
                    {t("routes.eventDetails.about.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>
                    {event.description ||
                      t("routes.eventDetails.about.emptyDescription")}
                  </p>
                  <p>
                    {t("routes.eventDetails.about.hostedBy", {
                      organizer: event.organizer_name,
                      category: event.category
                        ? t(`routes.common.categories.${event.category}`, {
                            defaultValue: event.category,
                          })
                        : t("routes.eventDetails.about.topicFallback"),
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6 rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {t("routes.eventDetails.summary.title")}
                </p>
                <div className="rounded-3xl bg-card/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      {t("routes.eventDetails.summary.organizer")}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{event.organizer_name}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      {t("routes.eventDetails.summary.type")}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {event.event_type
                        ? t(`routes.eventForm.eventTypes.${event.event_type}`, {
                            defaultValue: event.event_type,
                          })
                        : t("routes.eventForm.eventTypes.online")}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      {t("routes.eventDetails.summary.capacity")}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {event.capacity ?? t("routes.eventDetails.tbd")}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {t("routes.eventDetails.summary.createdBy")}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden bg-accent text-accent-content font-semibold flex items-center justify-center">
                        {eventCreator?.avatar ? (
                          <img
                            src={eventCreator.avatar}
                            alt={t("routes.eventDetails.creatorAvatarAlt", {
                              name: eventCreator.name,
                            })}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{getNameInitials(eventCreator?.name ?? event.organizer_name ?? "")}</span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">{eventCreator?.name ?? event.organizer_name ?? event.created_by}</p>
                        {eventCreator?.email ? <p className="text-xs text-muted-foreground">{eventCreator.email}</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-card/80 p-5 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {t("routes.eventDetails.action.title")}
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {isOwner
                        ? t("routes.eventDetails.action.owner")
                            : hasJoined
                              ? t("routes.eventDetails.action.joined")
                              : t("routes.eventDetails.action.ready")}
                    </p>
                  </div>
                  <div>{ctaButton}</div>
                </div>
                {isOwner ? (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    {t("routes.eventDetails.action.ownerDescription")}
                  </p>
                ) : hasJoined ? (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    {t("routes.eventDetails.action.leaveDescription")}
                  </p>
                ) : (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    {t("routes.eventDetails.action.joinDescription")}
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
