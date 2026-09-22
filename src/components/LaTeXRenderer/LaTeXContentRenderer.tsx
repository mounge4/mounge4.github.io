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
 * Convert LaTeX length units (cm, mm, in, pt, em, px) to valid CSS length
 */
export function convertLatexLength(lenStr: string): string {
  if (!lenStr) return '0.5rem';
  const clean = lenStr.trim().toLowerCase();
  // If already standard CSS dimension like 0.4cm, 10mm, 15px, 1.5em, 12pt
  if (/^[0-9.]+(cm|mm|in|pt|px|em|rem)$/.test(clean)) {
    return clean;
  }
  // If pure number like 10, default to px
  if (/^[0-9.]+$/.test(clean)) {
    return `${clean}px`;
  }
  return '0.75rem';
}

/**
 * Auto-detect if content contains LaTeX markup, math, or document commands
 */
export function isLikelyLatex(text?: string): boolean {
  if (!text) return false;
  return (
    /\\(section|subsection|subsubsection|paragraph|begin|end|textbf|textit|underline|text|frac|sqrt|sum|int|alpha|beta|theta|lambda|pi|infty|times|div|pm|leq|geq|neq|approx|rightarrow|leftarrow|partial|nabla|cdot|in|notin|subset|cup|cap|to|lim|log|sin|cos|tan|exp|mathbf|mathit|mathrm|cal)/.test(text) ||
    /\\(vspace|hspace|noindent|fontsize|selectfont|bfseries|large|Large|LARGE|huge|Huge|small|footnotesize|href|url|hrule|rule|bigskip|medskip|smallskip|centering|flushright|flushleft)/.test(text) ||
    /\\\[[\s\S]*?\\\]/.test(text) ||
    /\$\$[\s\S]*?\$\$/.test(text) ||
    /\$[^\$\n]+\$/.test(text) ||
    /\\\([\s\S]*?\\\)/.test(text) ||
    /\{\\fontsize\{/.test(text) ||
    /^\s*\[\s*[\r\n]+[\s\S]+?[\r\n]+\s*\]/m.test(text)
  );
}

/**
 * Parses and formats inline LaTeX markup:
 * - \underline{\hspace{6cm}} (fillable form blanks)
 * - \href{url}{label}, \url{url}
 * - {\fontsize{20}{24}\selectfont\bfseries Text}
 * - \large, \Large, \LARGE, \huge, \Huge, \small
 * - \textbf, \textit, \underline, \emph, \texttt, \textsf
 * - \vspace{...} inline spacers
 * - \noindent, \par, \vfill, \centering (stripped cleanly)
 * - KaTeX math ($...$, \(...\))
 * - Line breaks \\, \newline
 */
export function formatInlineLatex(raw: string): string {
  if (!raw) return '';
  let result = raw;

  // 1. Strip \noindent & \par
  result = result.replace(/\\noindent\s*/g, '');
  result = result.replace(/\\par\b/g, '');

  // 2. Strip \vfill, \hfill, \centering
  result = result.replace(/\\vfill\b/g, '');
  result = result.replace(/\\hfill\b/g, '');
  result = result.replace(/\\centering\b/g, '');
  result = result.replace(/\\today\b/g, () => new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }));

  // 3. Handle fillable form blank underlines: \underline{\hspace{...}} or \underline{\hspace*{...}}
  result = result.replace(/\\underline\{\\hspace\*?\{([^}]+)\}\}/g, (_, length) => {
    const widthCss = convertLatexLength(length);
    return `<span class="inline-block border-b-2 border-slate-700 mx-1 align-baseline" style="min-width: ${widthCss}; width: ${widthCss}; height: 1.1em;">&nbsp;</span>`;
  });

  // 4. Standalone \hspace{...} or \hspace*{...}
  result = result.replace(/\\hspace\*?\{([^}]+)\}/g, (_, length) => {
    const widthCss = convertLatexLength(length);
    return `<span class="inline-block" style="width: ${widthCss};"></span>`;
  });

  // 5. Convert display/inline math \( ... \)
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    return renderKatexToHtml(math, false);
  });

  // 6. Convert standard inline math $...$
  result = result.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return renderKatexToHtml(math, false);
  });

  // 7. Handle {\fontsize{size}{skip}\selectfont\bfseries ...} or {\fontsize{size}{skip}\selectfont ...}
  result = result.replace(
    /\{\\fontsize\{([0-9.]+)\}(?:\{[0-9.]+\})?\\selectfont(?:\\bfseries)?\s*([^{}]+)\}/g,
    (_, size, text) => {
      const numSize = parseFloat(size) || 16;
      let sizeClass = 'text-base font-bold text-slate-900';
      if (numSize >= 22) sizeClass = 'text-2xl sm:text-3xl font-black text-emerald-950';
      else if (numSize >= 18) sizeClass = 'text-xl sm:text-2xl font-bold text-emerald-900';
      else if (numSize >= 15) sizeClass = 'text-lg sm:text-xl font-bold text-slate-900';
      else if (numSize <= 12) sizeClass = 'text-xs text-slate-600';
      return `<span class="${sizeClass} block my-1">${text.trim()}</span>`;
    }
  );

  // 8. Handle {\Huge\bfseries ...} or {\LARGE\bfseries ...}
  result = result.replace(/\{\\Huge\\bfseries\s*([^{}]+)\}/g, '<span class="text-2xl sm:text-3xl font-black text-emerald-950 block my-1">$1</span>');
  result = result.replace(/\{\\LARGE\\bfseries\s*([^{}]+)\}/g, '<span class="text-xl sm:text-2xl font-bold text-emerald-900 block my-1">$1</span>');
  result = result.replace(/\{\\Large\\bfseries\s*([^{}]+)\}/g, '<span class="text-lg sm:text-xl font-bold text-slate-900 block my-0.5">$1</span>');
  result = result.replace(/\{\\large\\bfseries\s*([^{}]+)\}/g, '<span class="text-base sm:text-lg font-bold text-slate-900 block my-0.5">$1</span>');

  // 9. Handle {\Huge ...}, {\LARGE ...}, {\Large ...}, {\large ...}
  result = result.replace(/\{\\Huge\s*([^{}]+)\}/g, '<span class="text-2xl sm:text-3xl font-black text-slate-900 block my-1">$1</span>');
  result = result.replace(/\{\\LARGE\s*([^{}]+)\}/g, '<span class="text-xl sm:text-2xl font-bold text-emerald-950 block my-1">$1</span>');
  result = result.replace(/\{\\Large\s*([^{}]+)\}/g, '<span class="text-lg sm:text-xl font-bold text-slate-900 block my-0.5">$1</span>');
  result = result.replace(/\{\\large\s*([^{}]+)\}/g, '<span class="text-base sm:text-[17px] font-semibold text-slate-900">$1</span>');

  // 10. Handle \href{url}{label} & \url{url}
  result = result.replace(
    /\\href\{([^}]+)\}\{([^}]+)\}/g,
    '<a href="$1" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 my-1 rounded-lg bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-2xs font-sans-bn underline"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg><span>$2</span></a>'
  );
  result = result.replace(
    /\\url\{([^}]+)\}/g,
    '<a href="$1" target="_blank" rel="noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-900 text-xs sm:text-sm font-sans">$1</a>'
  );

  // 11. Font size switches without braces: \large, \Large, \LARGE, \huge, \Huge, \small
  result = result.replace(/\\Huge\s+([^\n\\]+)/g, '<span class="text-2xl sm:text-3xl font-black text-slate-900 block my-1">$1</span>');
  result = result.replace(/\\huge\s+([^\n\\]+)/g, '<span class="text-xl sm:text-2xl font-bold text-slate-900 block my-1">$1</span>');
  result = result.replace(/\\LARGE\s+([^\n\\]+)/g, '<span class="text-lg sm:text-xl font-bold text-emerald-950 block my-1">$1</span>');
  result = result.replace(/\\Large\s+([^\n\\]+)/g, '<span class="text-base sm:text-lg font-bold text-slate-900 block my-0.5">$1</span>');
  result = result.replace(/\\large\s+([^\n\\]+)/g, '<span class="text-base sm:text-[17px] font-semibold text-slate-900">$1</span>');
  result = result.replace(/\\small\s+([^\n\\]+)/g, '<span class="text-xs text-slate-600">$1</span>');

  // 12. Bold: \textbf{...} and {\bfseries ...} and {\bf ...}
  result = result.replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>');
  result = result.replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>'); // nested pass
  result = result.replace(/\{\\bfseries\s*([^{}]+)\}/g, '<strong>$1</strong>');
  result = result.replace(/\{\\bf\s*([^{}]+)\}/g, '<strong>$1</strong>');

  // 13. Italic: \textit{...}, \emph{...}, {\it ...}
  result = result.replace(/\\(?:textit|emph)\{([^{}]+)\}/g, '<em>$1</em>');
  result = result.replace(/\\(?:textit|emph)\{([^{}]+)\}/g, '<em>$1</em>');
  result = result.replace(/\{\\it\s*([^{}]+)\}/g, '<em>$1</em>');

  // 14. Underline: \underline{...}
  result = result.replace(/\\underline\{([^{}]+)\}/g, '<u class="underline underline-offset-4 decoration-emerald-600">$1</u>');

  // 15. Monospace & Sans: \texttt{...}, \textsf{...}
  result = result.replace(/\\texttt\{([^{}]+)\}/g, '<code class="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-emerald-800 font-mono">$1</code>');
  result = result.replace(/\\textsf\{([^{}]+)\}/g, '<span class="font-sans">$1</span>');

  // 16. Inline \vspace{...} or \vspace*{...}
  result = result.replace(/\\vspace\*?\{([^}]+)\}/g, (_, length) => {
    const cssHeight = convertLatexLength(length);
    return `<span class="block w-full" style="height: ${cssHeight};"></span>`;
  });

  // 17. LaTeX line break \\ or \newline
  result = result.replace(/\\\\|\\newline/g, '<br />');

  // 18. Unwrap standalone grouped text like `{ প্রতিষ্ঠা: ২০২৪ }` or `{মূলনীতি: ...}`
  result = result.replace(/^\{\s*([^{}\n]+)\s*\}$/gm, '$1');

  // 19. Unescape special LaTeX chars: \%, \$, \&, \_, \#
  result = result.replace(/\\([%$&_#])/g, '$1');

  return result;
}

export interface BlockItem {
  type: 
    | 'titlepage'
    | 'pagebreak'
    | 'section' 
    | 'subsection' 
    | 'subsubsection' 
    | 'block-math' 
    | 'paragraph' 
    | 'itemize' 
    | 'enumerate' 
    | 'quote' 
    | 'center' 
    | 'flushright' 
    | 'flushleft' 
    | 'vspace' 
    | 'hr';
  content: string;
  items?: string[];
  extraHeight?: string;
}

/**
 * Tokenizes and parses document-level LaTeX or mixed text content into clean structured blocks
 */
export function parseLatexDocument(raw: string): BlockItem[] {
  if (!raw) return [];

  // Strip LaTeX document preamble & non-rendering directives cleanly
  let cleaned = raw
    // Document class, packages, geometry, page styles
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\geometry\{[^}]*\}/g, '')
    .replace(/\\pagestyle\{[^}]*\}/g, '')
    .replace(/\\thispagestyle\{[^}]*\}/g, '')
    // Polyglossia, babel, fonts
    .replace(/\\setmainlanguage(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\setotherlanguage(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\newfontfamily\\[a-zA-Z]+(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\setmainfont(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\setsansfont(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\setmonofont(\[[^\]]*\])?\{[^}]*\}/g, '')
    // Spacing & header/footer setup
    .replace(/\\onehalfspacing/g, '')
    .replace(/\\doublespacing/g, '')
    .replace(/\\singlespacing/g, '')
    .replace(/\\fancyhf\{[^}]*\}/g, '')
    .replace(/\\fancyhead(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\fancyfoot(\[[^\]]*\])?\{[^}]*\}/g, '')
    // Title formatting & spacing
    .replace(/\\titleformat\*?\{[^}]*\}(\[[^\]]*\])?\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}(\{[^{}]*\})?/g, '')
    .replace(/\\titlespacing\*?\{[^}]*\}(\{[^{}]*\}){1,4}/g, '')
    // Hypersetup block
    .replace(/\\hypersetup\{[\s\S]*?\}/g, '')
    // Standard environment bookends
    .replace(/\\begin\{document\}/g, '')
    .replace(/\\end\{document\}/g, '')
    .replace(/\\maketitle/g, '')
    // Table of contents, toc additions, appendix marker
    .replace(/\\tableofcontents/g, '')
    .replace(/\\addcontentsline\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, '')
    .replace(/\\appendix\b/g, '')
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

    // 1. Explicit pagebreak / newpage
    if (line === '\\newpage' || line === '\\pagebreak' || line === '\\clearpage') {
      blocks.push({ type: 'pagebreak', content: '' });
      i++;
      continue;
    }

    // 2. Titlepage environment: \begin{titlepage} ... \end{titlepage}
    if (line.startsWith('\\begin{titlepage}')) {
      const tpLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('\\end{titlepage}')) {
        tpLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'titlepage',
        content: tpLines.join('\n').trim()
      });
      i++;
      continue;
    }

    // 3. Standalone \vspace{...} or \vspace*{...}
    const vspaceMatch = line.match(/^\\vspace\*?\{([^}]+)\}\s*$/);
    if (vspaceMatch) {
      blocks.push({
        type: 'vspace',
        content: '',
        extraHeight: convertLatexLength(vspaceMatch[1])
      });
      i++;
      continue;
    }

    // 4. Horizontal rule \hrule or \rule{...}{...}
    if (/^\\hrule(\s|$)|\\rule\{/.test(line)) {
      blocks.push({ type: 'hr', content: '' });
      i++;
      continue;
    }

    // 5. Sections: \section{...}, \subsection{...}, \subsubsection{...}
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

    // 6. Block Math: \[ ... \] or $$ ... $$ or \begin{equation} ...
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
      const mathLines: string[] = [];
      let isSingleLine = false;

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
          // bracket format
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

    // 7. Lists: \begin{itemize} ... \end{itemize} or \begin{enumerate} ...
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
          currentItem += '\n' + l;
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

    // 8. Blockquote: \begin{quote} ... \end{quote}
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

    // 9. Right-aligned block: \begin{flushright} ... \end{flushright}
    if (line.startsWith('\\begin{flushright}')) {
      const frLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('\\end{flushright}')) {
        frLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'flushright',
        content: frLines.join('\n').trim()
      });
      i++;
      continue;
    }

    // 10. Left-aligned block: \begin{flushleft} ... \end{flushleft}
    if (line.startsWith('\\begin{flushleft}')) {
      const flLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('\\end{flushleft}')) {
        flLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'flushleft',
        content: flLines.join('\n').trim()
      });
      i++;
      continue;
    }

    // 11. Centered: \begin{center} ... \end{center}
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

    // 12. Regular paragraph (accumulate consecutive non-empty lines until blank line or major command)
    const pLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine) break;
      if (
        nextLine === '\\newpage' ||
        nextLine === '\\pagebreak' ||
        nextLine === '\\clearpage' ||
        nextLine.startsWith('\\section') ||
        nextLine.startsWith('\\subsection') ||
        nextLine.startsWith('\\subsubsection') ||
        nextLine.startsWith('\\[') ||
        nextLine.startsWith('$$') ||
        nextLine.startsWith('\\begin{') ||
        nextLine === '[' ||
        nextLine.startsWith('\\hrule') ||
        /^\\vspace\*?\{[^}]+\}\s*$/.test(nextLine)
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
  // Always render as LaTeX if contentType is 'latex' OR if content actually contains LaTeX syntax
  const isLatex = useMemo(() => {
    if (contentType === 'latex') return true;
    return isLikelyLatex(content);
  }, [content, contentType]);

  const blocks = useMemo(() => {
    if (!content || !content.trim()) return [];
    if (!isLatex) {
      return content.split(/\n{2,}/).map(para => ({
        type: 'paragraph' as const,
        content: para.trim()
      }));
    }
    return parseLatexDocument(content);
  }, [content, isLatex]);

  if (!content || !content.trim()) {
    return <span className="text-slate-400 italic font-sans-bn text-xs">কোনো বিবরণ উপলব্ধ নেই।</span>;
  }

  // Pure plain text fallback
  if (!isLatex) {
    return (
      <div className={`space-y-3.5 text-slate-700 leading-relaxed font-serif-bn break-inside-avoid ${className}`}>
        {blocks.map((block, idx) => (
          <p key={idx} className="whitespace-pre-line leading-relaxed break-inside-avoid">
            {block.content}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3.5 text-slate-800 leading-relaxed font-serif-bn latex-rendered-content ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'pagebreak':
            return (
              <div key={idx} className="my-6 border-b-2 border-dashed border-emerald-400/40 text-center py-1 page-break-marker">
                <span className="text-[11px] text-emerald-700 font-sans-bn bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium shadow-2xs">
                  পৃষ্ঠা পরিবর্তন
                </span>
              </div>
            );

          case 'titlepage':
            return (
              <div key={idx} className="my-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-white border border-emerald-200/80 text-center space-y-4 break-inside-avoid shadow-xs">
                <div
                  className="space-y-3 font-serif-bn"
                  dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
                />
              </div>
            );

          case 'vspace':
            return (
              <div 
                key={idx} 
                className="w-full" 
                style={{ height: block.extraHeight || '0.75rem' }} 
              />
            );

          case 'section':
            return (
              <div key={idx} className="pt-3 pb-1 border-b-2 border-emerald-600/30 break-inside-avoid">
                <h2 className="text-lg sm:text-xl font-bold text-emerald-950 font-serif-bn flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-600 rounded-full inline-block shrink-0"></span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }} />
                </h2>
              </div>
            );

          case 'subsection':
            return (
              <div key={idx} className="pt-2 pb-0.5 break-inside-avoid">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-bn flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block shrink-0"></span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }} />
                </h3>
              </div>
            );

          case 'subsubsection':
            return (
              <div key={idx} className="pt-1.5 break-inside-avoid">
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
                className="my-3 py-3 px-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 overflow-x-auto text-center shadow-2xs break-inside-avoid"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            );
          }

          case 'itemize':
            return (
              <ul key={idx} className="my-2.5 space-y-1.5 list-none pl-1 break-inside-avoid">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed break-inside-avoid">
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
              <ol key={idx} className="my-2.5 space-y-2 list-none pl-1 break-inside-avoid">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed break-inside-avoid">
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
                className="my-2.5 p-3.5 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-600 text-slate-800 italic font-serif-bn leading-relaxed text-sm sm:text-base shadow-2xs break-inside-avoid"
              >
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
                />
              </blockquote>
            );

          case 'flushright':
            return (
              <div
                key={idx}
                className="my-3 text-right font-serif-bn break-inside-avoid space-y-1"
              >
                <div
                  className="whitespace-pre-line inline-block text-right"
                  dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
                />
              </div>
            );

          case 'flushleft':
            return (
              <div
                key={idx}
                className="my-2 text-left font-serif-bn break-inside-avoid"
              >
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
                />
              </div>
            );

          case 'center':
            return (
              <div
                key={idx}
                className="my-2.5 text-center font-serif-bn break-inside-avoid"
                dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
              />
            );

          case 'hr':
            return <hr key={idx} className="my-3 border-t border-slate-200" />;

          case 'paragraph':
          default:
            return (
              <div
                key={idx}
                className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-800 font-serif-bn break-inside-avoid"
                dangerouslySetInnerHTML={{ __html: formatInlineLatex(block.content) }}
              />
            );
        }
      })}
    </div>
  );
};
