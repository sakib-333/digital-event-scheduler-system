import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CalendarPlus, ImagePlus, Link2, X } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  useForm,
  useWatch,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import manageEvents from '@/api/manage-events'
import { useManageEventsStore } from '@/stores/manage-events-store'
import type { EventType } from '@/types/event'
import { uploadImage } from '@/utils'

export const Route = createFileRoute(
  '/_authenticated/event/edit-event/$eventId',
)({
  component: RouteComponent,
})

type EventCategory =
  | 'exam'
  | 'contest'
  | 'game'
  | 'feast'
  | 'tour'
  | 'concert'
  | 'others'

const EVENT_CATEGORIES: { label: string; value: EventCategory }[] = [
  { label: 'Exam', value: 'exam' },
  { label: 'Contest', value: 'contest' },
  { label: 'Game', value: 'game' },
  { label: 'Feast', value: 'feast' },
  { label: 'Tour', value: 'tour' },
  { label: 'Concert', value: 'concert' },
  { label: 'Others', value: 'others' },
]

type EventFormValues = Omit<
  EventType,
  'id' | 'created_at' | 'created_by' | 'banner_image' | 'category'
> & {
  banner_image: FileList | null
  category: EventCategory | ''
}

const defaultEventValues: EventFormValues = {
  title: '',
  description: '',
  category: '',
  event_type: 'offline',
  location: '',
  meeting_link: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  capacity: 0,
  banner_image: null,
  organizer_name: '',
}

function RouteComponent() {
  const { eventId } = Route.useParams()
  const navigate = useNavigate()
  const storeEvent = useManageEventsStore((state) =>
    state.events.find((item) => item.id === eventId),
  )
  const [fetchedEvent, setFetchedEvent] = useState<EventType | null>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(false)

  const event = storeEvent ?? fetchedEvent

  const updateEvent = useManageEventsStore((state) => state.updateEvent)
  const isUpdating = useManageEventsStore((state) => state.isUpdating)

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<EventFormValues>({
    defaultValues: defaultEventValues,
  })

  const event_type = useWatch({ control, name: 'event_type' })
  const isOnline = event_type === 'online'

  const [imagePreviewOverride, setImagePreviewOverride] = useState<{
    eventId: string
    preview: string | null
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imagePreview =
    imagePreviewOverride && imagePreviewOverride.eventId === event?.id
      ? imagePreviewOverride.preview
      : event?.banner_image ?? null

  useEffect(() => {
    if (storeEvent) {
      return
    }

    let isMounted = true

    const fetchEvent = async () => {
      setIsLoadingEvent(true)

      try {
        const eventData = await manageEvents.getEventById(eventId)
        if (isMounted) {
          setFetchedEvent(eventData)
        }
      } catch (error) {
        console.error('Failed to load event:', error)
        toast.error('Failed to load event details.')
      } finally {
        if (isMounted) {
          setIsLoadingEvent(false)
        }
      }
    }

    fetchEvent()

    return () => {
      isMounted = false
    }
  }, [eventId, storeEvent])

  useEffect(() => {
    if (!event) return

    const categoryValue = EVENT_CATEGORIES.some(
      (item) => item.value === event.category,
    )
      ? (event.category as EventCategory)
      : ''

    reset({
      title: event.title,
      description: event.description,
      category: categoryValue,
      event_type: event.event_type,
      location: event.location,
      meeting_link: event.meeting_link ?? '',
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
      capacity: event.capacity,
      banner_image: null,
      organizer_name: event.organizer_name,
    })

  }, [event, reset])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreviewOverride({
        eventId: event?.id ?? eventId,
        preview: URL.createObjectURL(file),
      })
    } else {
      setImagePreviewOverride({
        eventId: event?.id ?? eventId,
        preview: null,
      })
    }
  }

  const clearImage = () => {
    setImagePreviewOverride({
      eventId: event?.id ?? eventId,
      preview: null,
    })
    setValue('banner_image', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEditEvent: SubmitHandler<EventFormValues> = async (data) => {
    if (!event) {
      toast.error('Event not found.')
      return
    }

    let bannerImageUrl =
      imagePreviewOverride?.eventId === event.id &&
      imagePreviewOverride.preview === null
        ? null
        : event.banner_image

    try {
      if (data.banner_image && data.banner_image.length > 0) {
        bannerImageUrl = await uploadImage(data.banner_image[0])
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error('Failed to upload banner image.')
      return
    }

    const updates = {
      title: data.title,
      description: data.description,
      category: data.category,
      event_type: data.event_type,
      location: data.event_type === 'online' ? '' : data.location || '',
      meeting_link:
        data.event_type === 'online' ? data.meeting_link || null : null,
      start_date: data.start_date,
      end_date: data.end_date,
      start_time: data.start_time,
      end_time: data.end_time,
      capacity: Number(data.capacity),
      banner_image: bannerImageUrl,
      organizer_name: data.organizer_name,
    }

    const success = await updateEvent(event.id, updates)
    if (success) {
      navigate({ to: '/event/manage-events' })
    }
  }

  if (isLoadingEvent && !event) {
    return (
      <div className="space-y-6">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-semibold leading-10 text-foreground">Edit Event</h1>
          <p className="mt-1 text-base leading-6 text-muted-foreground">
            Loading event details...
          </p>
        </header>

        <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="h-44 animate-pulse rounded-xl bg-muted/60" />
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                className={cn(
                  'h-16 animate-pulse rounded-xl bg-muted/60',
                  index === 0 || index === 3 ? 'md:col-span-2' : '',
                )}
                key={index}
              />
            ))}
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
            Edit event
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Event not found</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We could not locate the event you want to edit. Please return to the event list and try again.
          </p>
          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate({ to: '/event/manage-events' })}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">Edit Event</h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          Update event details, schedule, capacity, and banner image.
        </p>
      </header>

      <form
        className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl"
        onSubmit={handleSubmit(handleEditEvent)}
      >
        <div className="mb-6">
          <span className="mb-2 block text-sm font-semibold leading-5 text-muted-foreground">
            Banner Image
          </span>

          {imagePreview ? (
            <div className="relative w-full overflow-hidden rounded-xl border border-border/60">
              <img
                alt="Banner preview"
                className="h-52 w-full object-cover"
                src={imagePreview}
              />
              <button
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                onClick={clearImage}
                title="Remove image"
                type="button"
              >
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Remove image</span>
              </button>
            </div>
          ) : (
            <label
              className="flex h-44 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/40 transition-colors hover:border-primary/60 hover:bg-primary/5"
              htmlFor="banner_image"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImagePlus className="size-6" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Click to upload banner image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — max 5 MB</p>
              </div>
            </label>
          )}

          <input
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            id="banner_image"
            type="file"
            {...register('banner_image')}
            onChange={handleImageChange}
            ref={(el) => {
              register('banner_image').ref(el)
              fileInputRef.current = el
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <EventField
            className="md:col-span-2"
            label="Title"
            registration={register('title', { required: true })}
          />

          <label className="space-y-2">
            <span className="text-sm font-semibold leading-5 text-muted-foreground">Category</span>
            <select
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
              {...register('category', { required: true })}
            >
              <option value="" disabled>
                Select a category
              </option>
              {EVENT_CATEGORIES.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-destructive">Category is required.</p>
            )}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold leading-5 text-muted-foreground">Event Type</span>
            <select
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
              {...register('event_type', { required: true })}
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </label>

          {isOnline && (
            <div className="space-y-2 md:col-span-2">
              <label
                className="flex items-center gap-1.5 text-sm font-semibold leading-5 text-muted-foreground"
                htmlFor="meeting_link"
              >
                <Link2 className="size-4 text-primary" aria-hidden="true" />
                Meeting Link
                <span className="text-destructive">*</span>
              </label>
              <input
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm leading-5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
                id="meeting_link"
                placeholder="https://zoom.us/j/... or Google Meet link"
                type="url"
                {...register('meeting_link', {
                  required: isOnline ? 'Meeting link is required for online events.' : false,
                })}
              />
              {errors.meeting_link && (
                <p className="text-xs text-destructive">{errors.meeting_link.message}</p>
              )}
            </div>
          )}

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold leading-5 text-muted-foreground">Description</span>
            <textarea
              className="min-h-32 w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
              placeholder="Write a short event description"
              {...register('description', { required: true })}
            />
          </label>

          {!isOnline && (
            <EventField
              label="Location"
              placeholder="Auditorium, room number, venue..."
              registration={register('location')}
            />
          )}

          <EventField
            label="Start Date"
            registration={register('start_date', { required: true })}
            type="date"
          />

          <EventField
            label="End Date"
            registration={register('end_date', { required: true })}
            type="date"
          />

          <EventField
            label="Start Time"
            registration={register('start_time', { required: true })}
            type="time"
          />

          <EventField
            label="End Time"
            registration={register('end_time', { required: true })}
            type="time"
          />

          <EventField
            label="Capacity"
            min={0}
            registration={register('capacity', {
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
          />

          <EventField
            label="Organizer Name"
            registration={register('organizer_name', { required: true })}
          />
        </div>

        <div className="mt-6 flex justify-end border-t border-border/60 pt-5">
          <Button className="h-11 gap-2 rounded-xl px-6" disabled={isUpdating} type="submit">
            <CalendarPlus className="size-4" aria-hidden="true" />
            <span>{isUpdating ? 'Saving...' : 'Save changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

type EventFieldProps = {
  className?: string
  label: string
  min?: number
  placeholder?: string
  registration: UseFormRegisterReturn
  type?: string
}

function EventField({
  className,
  label,
  min,
  placeholder,
  registration,
  type = 'text',
}: EventFieldProps) {
  const id = registration.name

  return (
    <label className={cn('space-y-2', className)} htmlFor={id}>
      <span className="text-sm font-semibold leading-5 text-muted-foreground">{label}</span>
      <Input
        className="h-11 rounded-xl bg-background"
        id={id}
        min={min}
        placeholder={placeholder}
        type={type}
        {...registration}
      />
    </label>
  )
}
