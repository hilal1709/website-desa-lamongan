"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger ref={ref} className={cn("flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition data-[placeholder]:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>
      {children}<SelectPrimitive.Icon asChild><ChevronDown className="size-4 shrink-0 text-slate-500" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal><SelectPrimitive.Content ref={ref} position={position} className={cn("z-[100] max-h-72 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out", position === "popper" && "translate-y-1", className)} {...props}>
      <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center"><ChevronUp className="size-4" /></SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center"><ChevronDown className="size-4" /></SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content></SelectPrimitive.Portal>
  ),
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item ref={ref} className={cn("relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm font-medium outline-none focus:bg-emerald-50 focus:text-emerald-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
      <span className="absolute left-2 flex size-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="size-4" /></SelectPrimitive.ItemIndicator></span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
)
SelectItem.displayName = SelectPrimitive.Item.displayName

export { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue }

type NativeLikeOption = React.ReactElement<{ value?: string | number; disabled?: boolean; children?: React.ReactNode }>

/**
 * Compatibility layer for legacy forms. It consumes option elements but renders
 * a Radix/shadcn select, so no browser select control reaches the DOM.
 */
export function BrowserlessSelect({ children, value, defaultValue, onChange, className, disabled, required, name }: Omit<React.ComponentProps<"select">, "onChange"> & { onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void }) {
  const options = React.Children.toArray(children).filter(React.isValidElement) as NativeLikeOption[]
  const optionValue = (option: NativeLikeOption) => String(option.props.value ?? option.props.children ?? "")
  const currentValue = value ?? defaultValue
  const selected = options.find((option) => optionValue(option) === String(currentValue))
  const placeholder = options.find((option) => option.props.value === "")?.props.children ?? "Pilih opsi"
  const [open, setOpen] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open || !contentRef.current) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!contentRef.current) return
      context = gsap.context(() => gsap.fromTo(contentRef.current, { autoAlpha: 0, y: -6, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" }))
    })
    return () => context?.revert()
  }, [open])

  const choose = (nextValue: string) => {
    onChange?.({ target: { value: nextValue, name: name ?? "" } } as React.ChangeEvent<HTMLSelectElement>)
    setOpen(false)
  }

  return <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
    <PopoverPrimitive.Trigger asChild><button type="button" disabled={disabled} aria-required={required} className={cn("flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50", !selected && "text-slate-400", className)}><span className="truncate">{selected?.props.children ?? placeholder}</span><ChevronDown className="size-4 shrink-0 text-slate-500" /></button></PopoverPrimitive.Trigger>
    <PopoverPrimitive.Portal><PopoverPrimitive.Content ref={contentRef} align="start" sideOffset={8} className="z-[200] max-h-72 min-w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{options.filter((option) => option.props.value !== "").map((option) => { const nextValue = optionValue(option); const active = nextValue === String(currentValue ?? ""); return <button key={String(option.key ?? nextValue)} type="button" disabled={option.props.disabled} onClick={() => choose(nextValue)} className={cn("flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 outline-none hover:bg-emerald-50 focus:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50", active && "bg-emerald-50 text-emerald-900")}>{active ? <Check className="mr-2 size-4 shrink-0" /> : <span className="mr-2 size-4 shrink-0" />}{option.props.children}</button> })}</PopoverPrimitive.Content></PopoverPrimitive.Portal>
    {name ? <input type="hidden" name={name} value={currentValue ?? ""} /> : null}
  </PopoverPrimitive.Root>
}

