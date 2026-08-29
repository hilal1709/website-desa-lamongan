import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsTextField({ id, label, value, required, wide, onChange }: { id: string; label: string; value: string; required?: boolean; wide?: boolean; onChange: (value: string) => void }) {
  return <div data-settings-field className={wide ? "md:col-span-2" : ""}><Label htmlFor={id}>{label}</Label><Input id={id} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2" /></div>
}
