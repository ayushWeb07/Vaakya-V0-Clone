"use client"
import Prism from "prismjs"

import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import { useEffect } from "react"
import "./theme.css"

type CodeBlockProps = {
  code: string
  language: string
}

export const CodeBlockSnippet = ({ code, language}: CodeBlockProps) =>  {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  return (
    <pre className="bg-transparent text-sm w-full h-full p-5">
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  )
}
