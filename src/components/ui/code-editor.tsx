'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Copy, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Download,
  Upload
} from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: 'css' | 'javascript' | 'html'
  placeholder?: string
  className?: string
  readOnly?: boolean
  showLineNumbers?: boolean
  height?: string
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = '',
  className = '',
  readOnly = false,
  showLineNumbers = true,
  height = '400px'
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lineNumbers, setLineNumbers] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Update line numbers when value changes
  useEffect(() => {
    const lines = value.split('\n')
    const numbers = lines.map((_, index) => (index + 1).toString())
    setLineNumbers(numbers)
  }, [value])

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
  }

  const clearContent = () => {
    onChange('')
  }

  const downloadCode = () => {
    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${language === 'javascript' ? 'js' : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const uploadCode = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = `.${language === 'javascript' ? 'js' : language}`
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          onChange(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const getLanguageClass = () => {
    switch (language) {
      case 'css':
        return 'language-css'
      case 'javascript':
        return 'language-javascript'
      case 'html':
        return 'language-html'
      default:
        return ''
    }
  }

  const editorClasses = `
    relative font-mono text-sm leading-relaxed
    ${isFullscreen ? 'fixed inset-0 z-50' : ''}
    ${className}
  `.trim()

  return (
    <div className={editorClasses}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 glass border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {language}
          </span>
          {showLineNumbers && (
            <span className="text-xs text-muted-foreground">
              {lineNumbers.length} lines
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearContent}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={downloadCode}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={uploadCode}
            className="h-8 w-8 p-0"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative flex">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="flex-shrink-0 w-12 px-3 py-4 text-xs text-muted-foreground select-none overflow-hidden"
            style={{ height }}
          >
            {lineNumbers.map((number, index) => (
              <div key={index} className="leading-relaxed">
                {number}
              </div>
            ))}
          </div>
        )}

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`
              w-full h-full p-4 bg-transparent text-foreground
              resize-none outline-none border-none
              ${readOnly ? 'cursor-default' : 'cursor-text'}
              ${getLanguageClass()}
            `}
            style={{ 
              height,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              lineHeight: '1.5'
            }}
            spellCheck={false}
          />
          
          {/* Syntax highlighting overlay */}
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ height }}
          >
            <pre className="p-4 text-transparent">
              <code className={getLanguageClass()}>
                {value}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground glass border-t border-white/10">
        <div className="flex items-center space-x-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{value.length} characters</span>
          <span>•</span>
          <span>{lineNumbers.length} lines</span>
        </div>
      </div>
    </div>
  )
}
