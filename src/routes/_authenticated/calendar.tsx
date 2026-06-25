import { useEffect, useMemo } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

import { useManageEventsStore } from "@/stores/manage-events-store";
import type { EventType } from "@/types/event";
import { usePageTitle } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";

const localizer = momentLocalizer(moment);

const calendarStyles = `
.event-calendar,
.event-calendar .rbc-calendar {
  color: var(--card-foreground);
  background: var(--card);
}

.event-calendar .rbc-toolbar {
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.event-calendar .rbc-toolbar-label {
  color: var(--foreground);
  font-weight: 600;
}

.event-calendar .rbc-btn-group {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}

.event-calendar .rbc-btn-group button {
  border: 0;
  border-right: 1px solid var(--border);
  color: var(--foreground);
  background: var(--card);
  box-shadow: none;
}

.event-calendar .rbc-btn-group button:last-child {
  border-right: 0;
}

.event-calendar .rbc-btn-group button:hover,
.event-calendar .rbc-btn-group button:focus {
  color: var(--accent-foreground);
  background: var(--accent);
  box-shadow: none;
}

.event-calendar .rbc-btn-group button.rbc-active,
.event-calendar .rbc-btn-group button.rbc-active:hover,
.event-calendar .rbc-btn-group button.rbc-active:focus {
  color: var(--primary-foreground);
  background: var(--primary);
  box-shadow: none;
}

.event-calendar .rbc-month-view,
.event-calendar .rbc-time-view,
.event-calendar .rbc-agenda-view {
  border-color: var(--border);
  color: var(--card-foreground);
  background: var(--card);
}

.event-calendar .rbc-month-header,
.event-calendar .rbc-header,
.event-calendar .rbc-time-header,
.event-calendar .rbc-time-content,
.event-calendar .rbc-month-row,
.event-calendar .rbc-row-bg,
.event-calendar .rbc-day-bg,
.event-calendar .rbc-time-slot,
.event-calendar .rbc-timeslot-group,
.event-calendar .rbc-agenda-view table.rbc-agenda-table,
.event-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td,
.event-calendar .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
  border-color: var(--border);
}

.event-calendar .rbc-month-header,
.event-calendar .rbc-header,
.event-calendar .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
  color: var(--foreground);
  background: var(--muted);
}

.event-calendar .rbc-row-content,
.event-calendar .rbc-date-cell,
.event-calendar .rbc-button-link {
  color: var(--card-foreground);
}

.event-calendar .rbc-off-range,
.event-calendar .rbc-off-range .rbc-button-link,
.event-calendar .rbc-time-gutter,
.event-calendar .rbc-label {
  color: var(--muted-foreground);
}

.event-calendar .rbc-off-range-bg {
  background: color-mix(in srgb, var(--muted) 72%, var(--card));
}

.event-calendar .rbc-today {
  background: var(--accent);
}

.event-calendar .rbc-now .rbc-button-link,
.event-calendar .rbc-current .rbc-button-link {
  color: var(--primary);
  font-weight: 700;
}

.event-calendar .rbc-event,
.event-calendar .rbc-event.rbc-selected,
.event-calendar .rbc-day-slot .rbc-background-event {
  border: 0;
  color: var(--primary-foreground);
  background: var(--primary);
}

.event-calendar .rbc-event-content {
  color: inherit;
}

.event-calendar .rbc-event:focus {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.event-calendar .rbc-event-allday {
  background: var(--chart-2);
  color: var(--primary-foreground);
}

.event-calendar .rbc-show-more {
  color: var(--primary);
  background: transparent;
  font-weight: 600;
}

.event-calendar .rbc-show-more:hover,
.event-calendar .rbc-show-more:focus {
  color: var(--accent-foreground);
  background: var(--accent);
}

.event-calendar .rbc-current-time-indicator {
  background: var(--destructive);
}

.event-calendar .rbc-overlay {
  border: 1px solid var(--border);
  color: var(--popover-foreground);
  background: var(--popover);
  box-shadow: 0 12px 32px rgb(0 0 0 / 18%);
}
`;

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
};

export const Route = createFileRoute("/_authenticated/calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Calendar");

  const events = useManageEventsStore((state) => state.events);
  const isLoading = useManageEventsStore((state) => state.isLoading);
  const error = useManageEventsStore((state) => state.error);
  const getApprovedEvents = useManageEventsStore(
    (state) => state.getApprovedEvents
  );

  useEffect(() => {
    getApprovedEvents();
  }, [getApprovedEvents]);

  const calendarEvents = useMemo(
    () =>
      events
        .filter((event) => event.status === "approved")
        .map(toCalendarEvent)
        .filter(Boolean) as CalendarEvent[],
    [events]
  );

  return (
    <>
      <style>{calendarStyles}</style>
      <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approved events are shown by title.
        </p>
      </header>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="event-calendar h-180 overflow-hidden rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading approved events...
          </div>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            views={["month", "week", "day"]}
            defaultView="month"
            popup
            components={{
              event: TitleOnlyEvent,
            }}
          />
        )}
      </div>
      </section>
    </>
  );
}

function TitleOnlyEvent({ title }: { title?: string }) {
  return <span className="block truncate text-xs font-medium">{title}</span>;
}

function toCalendarEvent(event: EventType): CalendarEvent | null {
  const start = buildEventDate(event.start_date, event.start_time);
  const end = buildEventDate(event.end_date, event.end_time);

  if (!start) {
    return null;
  }

  return {
    title: event.title,
    start,
    end: end && end > start ? end : new Date(start.getTime() + 60 * 60 * 1000),
  };
}

function buildEventDate(date?: string, time?: string) {
  if (!date) {
    return null;
  }

  const eventDate = new Date(`${date}T${time || "00:00:00"}`);
  return Number.isNaN(eventDate.getTime()) ? null : eventDate;
}
