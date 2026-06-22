/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, ImagePlus, Link2, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  useForm,
  useWatch,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Route Definition ───
export const Route = createFileRoute("/_authenticated/create-event")({
  component: CreateEventPage,
});

// ─── Types and Constants ───
type EventCategory =
  | "exam"
  | "contest"
  | "game"
  | "feast"
  | "tour"
  | "concert"
  | "others";

const EVENT_CATEGORIES: { label: string; value: EventCategory }[] = [
  { label: "Exam", value: "exam" },
  { label: "Contest", value: "contest" },
  { label: "Game", value: "game" },
  { label: "Feast", value: "feast" },
  { label: "Tour", value: "tour" },
  { label: "Concert", value: "concert" },
  { label: "Others", value: "others" },
];

type EventFormValues = {
  bannerImage: FileList | null;
  capacity: number;
  category: EventCategory | "";
  description: string;
  endDate: string;
  endTime: string;
  eventType: "online" | "offline";
  location: string;
  meetingLink: string;
  organizerName: string;
  startDate: string;
  startTime: string;
  title: string;
};

const defaultEventValues: EventFormValues = {
  title: "",
  description: "",
  category: "",
  eventType: "offline",
  location: "",
  meetingLink: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  capacity: 0,
  bannerImage: null,
  organizerName: "",
};

function CreateEventPage() {
  // ─── Hooks and State ───
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<EventFormValues>({
    defaultValues: defaultEventValues,
  });

  const eventType = useWatch({ control, name: "eventType" });
  const isOnline = eventType === "online";

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ─── Image Upload Helpers ───
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setValue("bannerImage", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Form Submission ───
  const handleCreateEvent: SubmitHandler<EventFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          Create Event
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          Add the event details, schedule, capacity, and publication assets.
        </p>
      </header>

      <form
        className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl"
        onSubmit={handleSubmit(handleCreateEvent)}
      >
        {/* ─── Banner Image Upload ─── */}
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
              htmlFor="bannerImage"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImagePlus className="size-6" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click to upload banner image
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP — max 5 MB
                </p>
              </div>
            </label>
          )}

          <input
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            id="bannerImage"
            type="file"
            {...register("bannerImage")}
            onChange={handleImageChange}
            ref={(el) => {
              register("bannerImage").ref(el);
              fileInputRef.current = el;
            }}
          />
        </div>

        {/* ─── Form Fields ─── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <EventField
            className="md:col-span-2"
            label="Title"
            registration={register("title", { required: true })}
          />

          {/* ─── Category Dropdown ─── */}
          <label className="space-y-2">
            <span className="text-sm font-semibold leading-5 text-muted-foreground">
              Category
            </span>
            <select
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
              {...register("category", { required: true })}
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

          {/* ─── Event Type Dropdown ─── */}
          <label className="space-y-2">
            <span className="text-sm font-semibold leading-5 text-muted-foreground">
              Event Type
            </span>
            <select
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
              {...register("eventType", { required: true })}
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </label>

          {/* ─── Meeting Link ─── */}
          {isOnline && (
            <div className="space-y-2 md:col-span-2">
              <label
                className="flex items-center gap-1.5 text-sm font-semibold leading-5 text-muted-foreground"
                htmlFor="meetingLink"
              >
                <Link2 className="size-4 text-primary" aria-hidden="true" />
                Meeting Link
                <span className="text-destructive">*</span>
              </label>
              <input
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm leading-5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
                id="meetingLink"
                placeholder="https://zoom.us/j/... or Google Meet link"
                type="url"
                {...register("meetingLink", {
                  required: isOnline ? "Meeting link is required for online events." : false,
                })}
              />
              {errors.meetingLink && (
                <p className="text-xs text-destructive">
                  {errors.meetingLink.message}
                </p>
              )}
            </div>
          )}

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold leading-5 text-muted-foreground">
              Description
            </span>
            <textarea
              className="min-h-32 w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
              placeholder="Write a short event description"
              {...register("description", { required: true })}
            />
          </label>

          {/* ─── Location ─── */}
          {!isOnline && (
            <EventField
              label="Location"
              placeholder="Auditorium, room number, venue..."
              registration={register("location")}
            />
          )}

          <EventField
            label="Start Date"
            registration={register("startDate", { required: true })}
            type="date"
          />

          <EventField
            label="End Date"
            registration={register("endDate", { required: true })}
            type="date"
          />

          <EventField
            label="Start Time"
            registration={register("startTime", { required: true })}
            type="time"
          />

          <EventField
            label="End Time"
            registration={register("endTime", { required: true })}
            type="time"
          />

          <EventField
            label="Capacity"
            min={0}
            registration={register("capacity", {
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
          />

          <EventField
            label="Organizer Name"
            registration={register("organizerName", { required: true })}
          />
        </div>

        <div className="mt-6 flex justify-end border-t border-border/60 pt-5">
          <Button
            className="h-11 gap-2 rounded-xl px-6"
            disabled={isSubmitting}
            type="submit"
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            <span>{isSubmitting ? "Creating..." : "Create Event"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

type EventFieldProps = {
  className?: string;
  label: string;
  min?: number;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  type?: string;
};

function EventField({
  className,
  label,
  min,
  placeholder,
  registration,
  type = "text",
}: EventFieldProps) {
  const id = registration.name;

  return (
    <label className={cn("space-y-2", className)} htmlFor={id}>
      <span className="text-sm font-semibold leading-5 text-muted-foreground">
        {label}
      </span>
      <Input
        className="h-11 rounded-xl bg-background"
        id={id}
        min={min}
        placeholder={placeholder}
        type={type}
        {...registration}
      />
    </label>
  );
}
