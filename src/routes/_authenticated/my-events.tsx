import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/my-events")({
  component: MyEventsPage,
});

type EventStatus = "Registered" | "Organizer" | "Waitlisted";

type EventCard = {
  attendees: string;
  category: string;
  date: string;
  imageAlt: string;
  imageUrl: string;
  location: string;
  status: EventStatus;
  time: string;
  title: string;
};

const events: EventCard[] = [
  {
    attendees: "128 attending",
    category: "Workshop",
    date: "Oct 24, 2024",
    imageAlt:
      "Modern university auditorium prepared for a high-tech conference.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpPxxD60fHdSvub11rZyYB-yiMJnkRusPQfGD1xpK9ZsH_t3OW42gBJNg7ho_nsBtLcGIZGfSGIBGVzdQT0yzzxhs-UXFM3Stud3L4UDCAgzIUar4afdffLBUWavKUyJne9NvQlejHaYE974zTrHqGr-6yYB9fj1JQEsO8kZWBjTYa0HwZaWgvHWSzJQnaTT1_xXdnINCvZNJ_Pb8joAOMe3vM3nYp_JXTQChh6F6HpUTN1cvk0RzuXFnFMGaglLQOdeKRXs_hRJI",
    location: "Main Hall, Engineering Block",
    status: "Registered",
    time: "10:00 AM - 12:30 PM",
    title: "AI Ethics in Modern Research",
  },
  {
    attendees: "45 attending",
    category: "Social",
    date: "Oct 28, 2024",
    imageAlt:
      "Bright university co-working space with students collaborating.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgFrx0NW_5VJCZZHPLDt2XWa5TDHaYKa4CJvxxE5WwcnMJ0OOQeMunyvnkhekFxw71xs7JuuiBO_hy-AN1QXFMR89EXR-NvlPS74CJ9vNwXyLcg9LA9baVrHngdNV6aQTEixxiD3TsGLDWM-04uJroF2zQPo7v10-vWZFVGoPd8cPQ37RGYStMDHiDInZZcdzY0lEGYlzsIHoKtW3vH9os-A2MuOebWoUG8LeiJICFaSQJBu4X7hWNk2ZEO1V6ygk9iuAG72Acv20",
    location: "Faculty Lounge, Level 4",
    status: "Organizer",
    time: "05:00 PM - 07:00 PM",
    title: "Graduate Networking Mixer",
  },
  {
    attendees: "200 attending",
    category: "Lecture",
    date: "Nov 02, 2024",
    imageAlt:
      "Minimal university laboratory with glass equipment and digital displays.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC57jzOjMPJxzMjSZAmpo-pUb95-QhLUwidKFl2Vwk4yvXQM-boiuLjI9N54aLNPgLFRmMqT-T3iUve2mus7CyYINgdAo1yca8D9Wwt8pSfszpHsNsU7fAZqFE4RWMn-MqvxJEu0Iv60pH0Pc2a0eX3C94busmIxczfKAcw1SYTwTmTuQbihX82VNAgfdBldoxChnOsm6CXLKsuY-jh7QuCtQkKgoXEC61NUrRneLnI18w_LRPyVvMF4k3ll1h2axr5y0U3aDPFPS8",
    location: "Physics Lab 302",
    status: "Waitlisted",
    time: "09:00 AM - 11:00 AM",
    title: "Quantum Computing Foundations",
  },
];

function MyEventsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold leading-10 text-foreground">
            My Events
          </h1>
          <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">
            Manage and track your upcoming university schedules and registered
            activities.
          </p>
        </div>
      </header>

      <EventControls />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <MyEventCard event={event} key={event.title} />
        ))}
      </div>
    </div>
  );
}

function EventControls() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm lg:flex-row">
      <label className="relative w-full flex-1">
        <Search
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">Search events</span>
        <input
          className="h-10 w-full rounded-lg border border-transparent bg-muted pl-12 pr-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
          placeholder="Search events by title, organizer, or location..."
          type="search"
        />
      </label>

      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
        <select
          className="h-10 rounded-lg border border-transparent bg-muted px-4 text-sm font-medium leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
          defaultValue="All Categories"
        >
          <option>All Categories</option>
          <option>Workshops</option>
          <option>Lectures</option>
          <option>Social</option>
          <option>Academic</option>
        </select>

        <Button
          className="h-10 justify-center gap-2 rounded-lg bg-muted px-4 text-foreground hover:bg-secondary"
          type="button"
          variant="secondary"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          <span>Date Range</span>
        </Button>

        <Button
          className="h-10 justify-center gap-2 rounded-lg px-4"
          type="button"
          variant="secondary"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span>Filters</span>
        </Button>
      </div>
    </section>
  );
}

function MyEventCard({ event }: { event: EventCard }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-40">
        <img
          alt={event.imageAlt}
          className="h-full w-full object-cover"
          src={event.imageUrl}
        />
        <div className="absolute right-4 top-4">
          <span
            className={cn(
              "rounded-lg px-2 py-1 text-xs font-semibold leading-4 backdrop-blur-sm",
              getStatusClassName(event.status),
            )}
          >
            {event.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <span className="text-xs font-semibold uppercase leading-4 text-primary">
            {event.category}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm leading-5 text-muted-foreground">
            <Users className="size-4" aria-hidden="true" />
            {event.attendees}
          </span>
        </div>

        <h2 className="mb-4 truncate text-xl font-semibold leading-7 text-foreground">
          {event.title}
        </h2>

        <div className="mb-6 space-y-1">
          <EventMeta icon={CalendarDays}>{event.date}</EventMeta>
          <EventMeta icon={Clock}>{event.time}</EventMeta>
          <EventMeta icon={MapPin}>{event.location}</EventMeta>
        </div>

        <div className="border-t border-border/60 pt-4">
          <Button className="h-10 w-full rounded-lg" type="button">
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

function EventMeta({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="flex items-center gap-2 text-sm leading-5 text-muted-foreground">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function getStatusClassName(status: EventStatus) {
  if (status === "Registered") {
    return "bg-primary text-primary-foreground";
  }

  if (status === "Organizer") {
    return "bg-chart-4 text-primary-foreground";
  }

  return "bg-muted text-muted-foreground";
}
