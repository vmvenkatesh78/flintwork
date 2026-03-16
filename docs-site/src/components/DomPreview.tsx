interface DomPreviewProps {
  readonly html: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function DomPreview({ html }: DomPreviewProps) {
  const escaped = escapeHtml(html);

  const highlighted = escaped
    .replace(/(data-[\w-]+="[^"]*")/g, '<span class="dom-attr-data">$1</span>')
    .replace(/(aria-[\w-]+="[^"]*")/g, '<span class="dom-attr-aria">$1</span>')
    .replace(/(role="[^"]*")/g, '<span class="dom-attr-aria">$1</span>')
    .replace(/(tabindex="[^"]*")/g, '<span class="dom-attr-aria">$1</span>');

  return (
    <pre className="dom-preview">
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}