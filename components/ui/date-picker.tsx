"use client"

import * as React from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import * as Popover from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function toDate(value?: string) { return value ? new Date(`${value}T00:00:00`) : undefined }
function toValue(date?: Date) { return date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "" }

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", required, disabled, className, id, name }: { value?: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; disabled?: boolean; className?: string; id?: string; name?: string }) {
  const [open, setOpen] = React.useState(false)
  const selected = toDate(value)
  const label = selected ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(selected) : placeholder
  return <Popover.Root open={open} onOpenChange={setOpen}><Popover.Trigger asChild><button id={id} type="button" disabled={disabled} aria-required={required} className={cn("flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50", !selected && "text-slate-400", className)}><span>{label}</span><CalendarDays className="size-4 shrink-0 text-slate-500" /></button></Popover.Trigger>{name ? <input type="hidden" name={name} value={value ?? ""} /> : null}<Popover.Portal><Popover.Content align="start" sideOffset={8} className="z-[100] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"><DayPicker mode="single" selected={selected} onSelect={(date) => { onChange(toValue(date)); setOpen(false) }} captionLayout="dropdown" classNames={{ months: "flex", month: "space-y-3", caption_label: "text-sm font-bold", nav: "flex items-center gap-1", button_previous: "absolute left-0 rounded-lg p-1 hover:bg-emerald-50", button_next: "absolute right-0 rounded-lg p-1 hover:bg-emerald-50", month_grid: "w-full border-collapse", weekdays: "text-slate-500", weekday: "w-9 pb-1 text-center text-xs font-medium", week: "", day: "p-0.5 text-center", day_button: "grid size-9 place-items-center rounded-lg text-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500", selected: "[&>button]:bg-emerald-700 [&>button]:text-white hover:[&>button]:bg-emerald-700", today: "[&>button]:font-black [&>button]:text-emerald-700" }} components={{ Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" /> }} /></Popover.Content></Popover.Portal></Popover.Root>
}

/** Compatibility layer used while migrating forms from native date inputs. */
export function LegacyDatePicker({ value, defaultValue, onChange, ...props }: Omit<React.ComponentProps<"input">, "type" | "onChange"> & { onChange?: React.ChangeEventHandler<HTMLInputElement> }) {
  const currentValue = String(value ?? defaultValue ?? "")
  return <DatePicker value={currentValue} onChange={(nextValue) => onChange?.({ target: { value: nextValue, name: props.name ?? "" } } as React.ChangeEvent<HTMLInputElement>)} {...props} />
}
