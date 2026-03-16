import { useState, useCallback } from 'react';

interface CodeBlockProps {
  readonly code: string;
  readonly language?: string;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="demo-code">
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  );
}
