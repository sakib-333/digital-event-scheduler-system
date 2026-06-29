import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EventCard } from '@/components/event-card'
import { useManageEventsStore } from '@/stores/manage-events-store'
import { usePageTitle } from '@/utils'

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
  const { t } = useTranslation()

  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm lg:flex-row">
      <label className="relative w-full flex-1">
        <Search
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">{t('routes.events.searchAria')}</span>
        <input
          className="h-10 w-full rounded-lg border border-transparent bg-muted pl-12 pr-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
          placeholder={t('routes.events.searchPlaceholder')}
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
          <option value="all">{t('routes.common.categories.all')}</option>
          <option value="exam">{t('routes.common.categories.exam')}</option>
          <option value="contest">{t('routes.common.categories.contest')}</option>
          <option value="game">{t('routes.common.categories.game')}</option>
          <option value="feast">{t('routes.common.categories.feast')}</option>
          <option value="tour">{t('routes.common.categories.tour')}</option>
          <option value="concert">{t('routes.common.categories.concert')}</option>
          <option value="others">{t('routes.common.categories.others')}</option>
        </select>
      </div>
    </section>
  )
}

function ApprovedEventsPage() {
  usePageTitle("Events");
  const { t } = useTranslation()
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
          <p className="text-muted-foreground">{t('routes.events.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold leading-10 text-foreground">
            {t('routes.events.title')}
          </h1>
          <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">
            {t('routes.events.description', { count: filteredEvents.length })}
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
              ? t('routes.events.empty')
              : t('routes.events.noMatches')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              event={event}
              key={event.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
