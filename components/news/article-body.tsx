import Image from "next/image"

const imageLine = /^!\[([^\]]*)\]\((\/[^)]+)\)$/

export function ArticleBody({ content }: { content: string }) {
  return <div className="space-y-5 text-[1.05rem] leading-8 text-slate-700">
    {content.split(/\n{2,}/).map((block, index) => {
      const image = block.trim().match(imageLine)
      if (image) return <figure key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><Image src={image[2]} alt={image[1] || "Gambar artikel"} width={1200} height={800} sizes="(max-width: 768px) calc(100vw - 2.5rem), 768px" className="h-auto w-full object-cover" />{image[1] ? <figcaption className="px-4 py-3 text-center text-sm leading-6 text-slate-500">{image[1]}</figcaption> : null}</figure>
      return <p key={index} className="whitespace-pre-wrap">{block}</p>
    })}
  </div>
}
