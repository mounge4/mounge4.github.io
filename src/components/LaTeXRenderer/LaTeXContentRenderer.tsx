import React, { useMemo } from 'react';
import katex from 'katex';

interface LaTeXContentRendererProps {
  content: string;
  contentType?: 'plain' | 'latex';
  className?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safely render KaTeX math with fallback
 */
export function renderKatexToHtml(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), {
      displayMode,
      throwOnError: false,
      trust: false,
      strict: false,
      output: 'htmlAndMathml'
    });
  } catch (e: any) {
    return `<span class="katex-error text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-mono border border-amber-200">[LaTeX: ${escapeHtml(math)}]</span>`;
  }
}

/**
 * Auto-detect if content contains LaTeX math or structural markup
 */
export function isLikelyLatex(text?: string): boolean {
  if (!text) return false;
  return (
    /\\(section|subsection|subsubsection|paragraph|begin|end|textbf|textit|underline|text|frac|sqrt|sum|int|alpha|beta|theta|lambda|pi|infty|times|div|pm|leq|geq|neq|approx|rightarrow|leftarrow|partial|nabla|cdot|in|notin|subset|cup|cap|to|lim|log|sin|cos|tan|exp|mathbf|mathit|mathrm|cal)/.test(text) ||
    /\\\[[\s\S]*?\\\]/.test(text) ||
    /\$\$[\s\S]*?\$\$/.test(text) ||
    /\$[^\$\n]+\$/.test(text) ||
    /\\\([\s\S]*?\\\)/.test(text) ||
    /^\s*\[\s*[\r\n]+[\s\S]+?[\r\n]+\s*\]/m.test(text)
  );
}

/**
 * Parses and formats inline LaTeX markup (inline math $...$, \(...\), \textbf, \textit, \text, URLs)
 */
export function formatInlineLatex(line: string): string {
  let result = line;

  // 1. Convert display/inline \( ... \)
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    return renderKatexToHtml(math, false);
  });

  // 2. Convert standard inline math $...$
  result = result.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return renderKatexToHtml(math, false);
  });

  // 3. Convert \textbf{...}
  result = result.replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>');
  result = result.replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>'); // nested pass

  // 4. Convert \textit{...} or \emph{...}
  result = result.replace(/\\(?:textit|emph)\{([^{}]+)\}/g, '<em>$1</em>');
  result = result.replace(/\\(?:textit|emph)\{([^{}]+)\}/g, '<em>$1</em>');

  // 5. Convert \underline{...}
  result = result.replace(/\\underline\{([^{}]+)\}/g, '<u>$1</u>');

  // 6. Convert \textsf{...} or \texttt{...}
  result = result.replace(/\\textsf\{([^{}]+)\}/g, '<span class="font-sans">$1</span>');
  result = result.replace(/\\texttt\{([^{}]+)\}/g, '<code class="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-emerald-800 font-mono">$1</code>');

  // 7. Convert \href{url}{label} or \url{url}
  result = result.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" target="_blank" rel="noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-900">$2</a>');
  result = result.replace(/\\url\{([^}]+)\}/g, '<a href="$1" target="_blank" rel="noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-900">$1</a>');

  // 8. Convert LaTeX line break \\ or \newline
  result = result.replace(/\\\\|\\newline/g, '<br />');

  // 9. Unescape special LaTeX chars: \%, \$, \&, \_, \#
  result = result.replace(/\\([%$&_#])/g, '$1');

  return result;
}

interface BlockItem {
  type: 'section' | 'subsection' | 'subsubsection' | 'block-math' | 'paragraph' | 'itemize' | 'enumerate' | 'quote' | 'center' | 'hr';
  content: string;
  items?: string[];
}

/**
 * Tokenizes and parses document-level LaTeX or mixed text content
 */
export function parseLatexDocument(raw: string): BlockItem[] {
  if (!raw) return [];

  // Strip LaTeX document preamble if full tex was pasted
  let cleaned = raw
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\begin\{document\}/g, '')
    .replace(/\\end\{document\}/g, '')
    .replace(/\\maketitle/g, '')
    .trim();

  const blocks: BlockItem[] = [];
  const lines = cleaned.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines or full-line comments
    if (!line || line.startsWith('%')) {
      i++;
      continue;
    }

    // 1. Horizontal rule \hrule or \rule{...}{...}
    if (/^\\hrule(\s|$)|\\rule\{/.test(line)) {
      blocks.push({ type: 'hr', content: '' });
      i++;
      continue;
    }

    // 2. Sections: \section{...}, \subsection{...}, \subsubsection{...}
    const secMatch = line.match(/^\\section\*?\{([^}]+)\}/);
    if (secMatch) {
      blocks.push({ type: 'section', content: secMatch[1] });
      i++;
      continue;
    }

    const subSecMatch = line.match(/^\\subsection\*?\{([^}]+)\}/);
    if (subSecMatch) {
      blocks.push({ type: 'subsection', content: subSecMatch[1] });
      i++;
      continue;
    }

    const subSubSecMatch = line.match(/^\\subsubsection\*?\{([^}]+)\}/);
    if (subSubSecMatch) {
      blocks.push({ type: 'subsubsection', content: subSubSecMatch[1] });
      i++;
      continue;
    }

    // 3. Block Math: \[ ... \] or $$ ... $$ or \begin{equation} ... \end{equation} or \begin{align} ...
    if (
      line.startsWith('\\[') || 
      line.startsWith('$$') || 
      line.startsWith('\\begin{equation}') || 
      line.startsWith('\\begin{equation*}') ||
      line.startsWith('\\begin{align}') || 
      line.startsWith('\\begin{align*}') ||
      line.startsWith('\\begin{gather}') ||
      line.startsWith('\\begin{gather*}') ||
      line === '['
    ) {
      let mathLines: string[] = [];
      let isSingleLine = false;

      // Check if closing is on the same line
      if (line.startsWith('\\[') && line.endsWith('\\]') && line.length > 2) {
        mathLines.push(line.slice(2, -2));
        isSingleLine = true;
      } else if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
        mathLines.push(line.slice(2, -2));
        isSingleLine = true;
      }

      if (!isSingleLine) {
        if (line.startsWith('\\[')) {
          mathLines.push(line.slice(2));
        } else if (line.startsWith('$$')) {
          mathLines.push(line.slice(2));
        } else if (line === '[') {
          // user syntax: [\n V = IR \n]
        } else {
          mathLines.push(line);
        }

        i++;
        while (i < lines.length) {
          const mLine = lines[i];
          if (mLine.trim().endsWith('\\]')) {
            mathLines.push(mLine.replace(/\\\]$/, ''));
            break;
          } else if (mLine.trim().endsWith('$$')) {
            mathLines.push(mLine.replace(/\$\$$/, ''));
            break;
          } else if (
            mLine.includes('\\end{equation}') || 
            mLine.includes('\\end{equation*}') ||
            mLine.includes('\\end{align}') ||
            mLine.includes('\\end{align*}') ||
            mLine.includes('\\end{gather}') ||
            mLine.includes('\\end{gather*}')
          ) {
            mathLines.push(mLine);
            break;
          } else if (mLine.trim() === ']') {
            break;
          } else {
            mathLines.push(mLine);
          }
          i++;
        }
      }

      blocks.push({
        type: 'block-math',
        content: mathLines.join('\n').trim()
      });
      i++;
      continue;
    }

    // 4. Lists: \begin{itemize} ... \end{itemize} or \begin{enumerate} ... \end{enumerate}
    if (line.startsWith('\\begin{itemize}') || line.startsWith('\\begin{enumerate}')) {
      const isEnumerate = line.startsWith('\\begin{enumerate}');
      const endTag = isEnumerate ? '\\end{enumerate}' : '\\end{itemize}';
      const items: string[] = [];
      let currentItem = '';

      i++;
      while (i < lines.length && !lines[i].includes(endTag)) {
        const l = lines[i].trim();
        if (l.startsWith('\\item')) {
          if (currentItem) items.push(currentItem);
          currentItem = l.replace(/^\\item\s*/, '');
        } else if (currentItem) {
          currentItem += ' ' + l;
        }
        i++;
      }
      if (currentItem) items.push(currentItem);

      blocks.push({
        type: isEnumerate ? 'enumerate' : 'itemize',
        content: '',
        items
      });
      i++;
      continue;
    }

    // 5. Blockquote: \begin{quote} ... \end{quote}
    if (line.startsWith('\\begin{quote}') || line.startsWith('\\begin{quotation}')) {
      const quoteLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('\\end{quote}') && !lines[i].includes('\\end{quotation}')) {
        quoteLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'quote',
        content: quoteLines.join('\n').trim()
      });
      i++;
      continue;
    }

    // 6. Centered: \begin{center} ... \end{center}
    if (line.startsWith('\\begin{center}')) {
      const centerLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('\\end{center}')) {
        centerLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'center',
        content: centerLines.join('\n').trim()
      });
      i++;
      continue;
    }

    // 7. Regular paragraph (accumulate consecutive non-empty lines until blank line or command)
    const pLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine) break;
      if (
        nextLine.startsWith('\\section') ||
        nextLine.startsWith('\\subsection') ||
        nextLine.startsWith('\\subsubsection') ||
        nextLine.startsWith('\\[') ||
        nextLine.startsWith('$$') ||
        nextLine.startsWith('\\begin{') ||
        nextLine === '[' ||
        nextLine.startsWith('\\hrule')
      ) {
        break;
      }
      pLines.push(lines[i]);
      i++;
    }

    blocks.push({
      type: 'paragraph',
      content: pLines.join('\n')
    });
  }

  return blocks;
}

export const LaTeXContentRenderer: React.FC<LaTeXContentRendererProps> = ({
  content,
  contentType,
  className = ''
}) => {
  const isLatex = useMemo(() => {
    if (contentType === 'latex') return true;
    if (contentType === 'plain') return false;
    return isLikelyLatex(content);
  }, [content, contentType]);

  const blocks = useMemo(() => {
    if (!content || !content.trim()) return [];
    if (!isLatex) {
      // Pure plain text: split into paragraphs preserving whitespace
      return content.split(/\n{2,}/).map(para => ({
        type: 'paragraph' as const,
        content: para.trim()
      }));
    }
    return parseLatexDocument(content);
  }, [content, isLatex]);

  if (!content || !content.trim()) {
    return <span className="text-slate-400 italic">কোনো বিবরণ উপলব্ধ নেই।</span>;
  }

  // If simple plain text without LaTeX
  if (!isLatex) {
    return (
      <div className={`space-y-4 text-slate-700 leading-relaxed font-serif-bn ${className}`}>
        {blocks.map((block, idx) => (
          <p key={idx} className="whitespace-pre-line leading-relaxed">
            {block.content}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 text-slate-800 leading-relaxed font-serif-bn latex-rendered-content ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'section':
            return (
              <div key={idx} className="pt-4 pb-1 border-b-2 border-emerald-600/30">
                <h2 className="text-lg sm:text-xl font-bold text-emerald-950 font-serif-bn flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-600 rounded-full inline-block"></span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }} />
                </h2>
              </div>
            );

          case 'subsection':
            return (
              <div key={idx} className="pt-3 pb-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-bn flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block"></span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }} />
                </h3>
              </div>
            );

          case 'subsubsection':
            return (
              <div key={idx} className="pt-2">
                <h4 className="text-sm sm:text-base font-semibold text-emerald-900 font-serif-bn">
                  <span dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }} />
                </h4>
              </div>
            );

          case 'block-math': {
            const rendered = renderKatexToHtml(block.content, true);
            return (
              <div
                key={idx}
                className="my-4 py-3 px-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 overflow-x-auto text-center shadow-2xs"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            );
          }

          case 'itemize':
            return (
              <ul key={idx} className="my-3 space-y-1.5 list-none pl-1">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: formatInlineLatex(item) }}
                    />
                  </li>
                ))}
              </ul>
            );

          case 'enumerate':
            return (
              <ol key={idx} className="my-3 space-y-2 list-none pl-1">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-sans-bn flex items-center justify-center shrink-0 mt-0.5">
                      {itemIdx + 1}
                    </span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: formatInlineLatex(item) }}
                    />
                  </li>
                ))}
              </ol>
            );

          case 'quote':
            return (
              <blockquote
                key={idx}
                className="my-3 p-4 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-600 text-slate-800 italic font-serif-bn leading-relaxed text-sm sm:text-base shadow-2xs"
              >
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
                />
              </blockquote>
            );

          case 'center':
            return (
              <div
                key={idx}
                className="my-3 text-center"
                dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
              />
            );

          case 'hr':
            return <hr key={idx} className="my-4 border-t border-slate-200" />;

          case 'paragraph':
          default:
            return (
              <p
                key={idx}
                className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
              />
            );
        }
      })}
    </div>
  );
};
