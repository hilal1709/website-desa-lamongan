const fs = require("fs")

function update(path, transforms) {
  let source = fs.readFileSync(path, "utf8")
  for (const [from, to] of transforms) {
    if (!source.includes(from)) throw new Error(`Target tidak ditemukan: ${path}`)
    source = source.replace(from, to)
  }
  fs.writeFileSync(path, source)
}

update("components/infografis/resident-manager.tsx", [
  ['import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog";', 'import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog";\nimport { PaginationControls } from "@/components/ui/pagination-controls";'],
  ['const [file, setFile] = useState<File | null>(null);', 'const [file, setFile] = useState<File | null>(null);\n    const [page, setPage] = useState(1);\n    const perPage = 10;\n    const totalPages = Math.max(1, Math.ceil(residents.length / perPage));\n    const visibleResidents = residents.slice((Math.min(page, totalPages) - 1) * perPage, Math.min(page, totalPages) * perPage);'],
  ['setResidents(data.residents ?? []);', 'setResidents(data.residents ?? []);\n        setPage(1);'],
  ['residents.map((resident)', 'visibleResidents.map((resident)'],
  ['</tbody></table></div></section><Dialog open={Boolean(pendingDelete)}', '</tbody></table></div><PaginationControls page={page} totalPages={totalPages} totalItems={residents.length} pageSize={perPage} onPageChange={setPage} itemLabel="profil warga" /></section><Dialog open={Boolean(pendingDelete)}'],
])

update("components/infografis/population-event-manager.tsx", [
  ['import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog";', 'import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog";\nimport { PaginationControls } from "@/components/ui/pagination-controls";'],
  ['const [balances, setBalances] = useState<BalanceRecord[]>([]);', 'const [balances, setBalances] = useState<BalanceRecord[]>([]);\n    const [balancePage, setBalancePage] = useState(1);\n    const [eventPage, setEventPage] = useState(1);\n    const perPage = 10;\n    const totalBalancePages = Math.max(1, Math.ceil(balances.length / perPage));\n    const totalEventPages = Math.max(1, Math.ceil(events.length / perPage));\n    const visibleBalances = balances.slice((Math.min(balancePage, totalBalancePages) - 1) * perPage, Math.min(balancePage, totalBalancePages) * perPage);\n    const visibleEvents = events.slice((Math.min(eventPage, totalEventPages) - 1) * perPage, Math.min(eventPage, totalEventPages) * perPage);'],
  ['setEvents(data.events);\n        setBalances(data.balances);', 'setEvents(data.events);\n        setBalances(data.balances);\n        setBalancePage(1);\n        setEventPage(1);'],
  ['balances.map((record)', 'visibleBalances.map((record)'],
  ['events.map((record)', 'visibleEvents.map((record)'],
  ['</tbody></table></div></article>\n    <form onSubmit={saveEvent}', '</tbody></table></div><PaginationControls page={balancePage} totalPages={totalBalancePages} totalItems={balances.length} pageSize={perPage} onPageChange={setBalancePage} itemLabel="data dasar" /></article>\n    <form onSubmit={saveEvent}'],
  ['</tbody></table></div></article>\n    <Dialog open={Boolean(pendingDelete)}', '</tbody></table></div><PaginationControls page={eventPage} totalPages={totalEventPages} totalItems={events.length} pageSize={perPage} onPageChange={setEventPage} itemLabel="catatan peristiwa" /></article>\n    <Dialog open={Boolean(pendingDelete)}'],
])
