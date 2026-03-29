"use client"

import { useState } from "react"

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea")
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition"
    >
      {copied ? "¡Copiado!" : "Copiar enlace"}
    </button>
  )
}
