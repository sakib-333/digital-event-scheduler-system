import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useManageEventsStore } from '@/stores/manage-events-store'
import type { EventType } from '@/types/event'

export const Route = createFileRoute('/_authenticated/events')({
  component: ApprovedEventsPage,
})

function EventControls({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: {
  selectedCategory: string
  searchQuery: string
  onCategoryChange: (category: string) => void
  onSearchChange: (query: string) => void
}) {
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
          placeholder="Search approved events by title, organizer, or location..."
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
        <select
          className="h-10 rounded-lg border border-transparent bg-muted px-4 text-sm font-medium leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="exam">Exam</option>
          <option value="contest">Contest</option>
          <option value="game">Game</option>
          <option value="feast">Feast</option>
          <option value="tour">Tour</option>
          <option value="concert">Concert</option>
          <option value="others">Others</option>
        </select>
      </div>
    </section>
  )
}

function ApprovedEventCard({ event }: { event: EventType }) {
  const eventDate = event.start_date
    ? new Date(event.start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'TBD'

  const eventTime = event.start_time ? event.start_time.substring(0, 5) : 'TBD'

  return (
    <article className="group overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-40">
        <img
          alt={event.title}
          className="h-full w-full object-cover"
          src={event.banner_image || 'https://via.placeholder.com/400x200'}
        />
        <div className="absolute right-4 top-4">
          <span className="rounded-lg bg-chart-3/10 px-2 py-1 text-xs font-semibold leading-4 text-chart-3">
            Approved
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <span className="text-xs font-semibold uppercase leading-4 text-primary">
            {event.category || 'Event'}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm leading-5 text-muted-foreground">
            <Users className="size-4" aria-hidden="true" />
            {event.capacity || 0} spots
          </span>
        </div>

        <h2 className="mb-4 truncate text-xl font-semibold leading-7 text-foreground">
          {event.title}
        </h2>

        <div className="mb-6 space-y-1">
          <EventMeta icon={CalendarDays}>{eventDate}</EventMeta>
          <EventMeta icon={Clock}>{eventTime}</EventMeta>
          <EventMeta icon={MapPin}>{event.location || 'Location TBD'}</EventMeta>
        </div>

        <div className="border-t border-border/60 pt-4">
          <Button className="h-10 w-full rounded-lg" type="button">
            View Details
          </Button>
        </div>
      </div>
    </article>
  )
}

function EventMeta({
  children,
  icon: Icon,
}: {
  children: React.ReactNode
  icon: typeof CalendarDays
}) {
  return (
    <div className="flex items-center gap-2 text-sm leading-5 text-muted-foreground">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

function ApprovedEventsPage() {
  const { events, isLoading, getApprovedEvents } = useManageEventsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    getApprovedEvents()
  }, [getApprovedEvents])

  const filteredEvents = events.filter((event) => {
    const categoryMatch =
      selectedCategory === 'all' || event.category === selectedCategory

    const lowerQuery = searchQuery.toLowerCase()
    const searchMatch =
      event.title.toLowerCase().includes(lowerQuery) ||
      event.organizer_name.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery)

    return categoryMatch && searchMatch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading approved events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold leading-10 text-foreground">
            Approved Events
          </h1>
          <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">
            Browse all approved events available to your university community.
            Total: {filteredEvents.length} approved event
            {filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <EventControls
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
      />

      {filteredEvents.length === 0 ? (
        <div className="rounded-lg border border-border/60 bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">
            {events.length === 0
              ? 'No approved events are available right now.'
              : 'No approved events match your filters. Try another search or category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <ApprovedEventCard event={event} key={event.id} />
          ))}
        </div>
      )}
    </div>
  )
}
