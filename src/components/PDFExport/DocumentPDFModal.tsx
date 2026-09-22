import React, { useRef, useState } from 'react';
import { SiteSettings } from '../../types';
import { LaTeXContentRenderer } from '../LaTeXRenderer/LaTeXContentRenderer';
import { 
  Download, 
  Printer, 
  X, 
  Check, 
  Loader2, 
  Calendar, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  BookOpen,
  Sparkles,
  Sliders,
  Maximize2
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { formatDriveImageUrl } from '../../utils/imageHelper';

export interface DocumentPDFData {
  type: 'notice' | 'blog';
  title: string;
  category: string;
  date: string;
  author?: string;
  authorRole?: string;
  readTime?: string;
  isImportant?: boolean;
  content: string;
  contentType?: 'plain' | 'latex';
  fileUrl?: string;
  linkUrl?: string;
}

interface DocumentPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: DocumentPDFData | null;
  settings?: SiteSettings;
}

// Convert English numerals to Bengali digits
const toBengaliNumber = (num: number): string => {
  return num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);
};

// Render page number as a crisp Canvas image to ensure 100% font support without mojibake
const createPageNumberImage = (pageNum: number, totalPages: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 50;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '500 22px "Hind Siliguri", "Tiro Bangla", "SolaimanLipi", sans-serif';
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const pageStr = totalPages > 1
      ? `পৃষ্ঠা ${toBengaliNumber(pageNum)} / ${toBengaliNumber(totalPages)}`
      : `পৃষ্ঠা ${toBengaliNumber(pageNum)}`;
      
    ctx.fillText(pageStr, 150, 25);
  }
  return canvas.toDataURL('image/png');
};

export const DocumentPDFModal: React.FC<DocumentPDFModalProps> = ({
  isOpen,
  onClose,
  documentData,
  settings
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // User-controllable PDF Settings & Customization
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [includeOfficialHeader, setIncludeOfficialHeader] = useState(true);
  const [includeBorders, setIncludeBorders] = useState(true);
  const [fitSinglePage, setFitSinglePage] = useState(true); // Default to true to prevent unnecessary extra pages
  const [marginTopMm, setMarginTopMm] = useState<number>(14);
  const [marginBottomMm, setMarginBottomMm] = useState<number>(14);

  if (!isOpen || !documentData) return null;

  const isNotice = documentData.type === 'notice';

  // Dynamic Header & Footer info pulled directly from SiteSettings
  const foundationName = settings?.foundationName || 'স্টেশন পাড়া দাওয়াহ্ কমিউনিটি';
  const slogan = settings?.slogan || 'দ্বীনের দাওয়াহ, ভ্রাতৃত্ব ও মানবসেবায় নিয়োজিত';
  const phone = settings?.phone || '+৮৮০১৭১২-৩৪৫৬৭৮';
  const altPhone = settings?.altPhone;
  const email = settings?.email || 'stationparadawahcommunity@gmail.com';
  const address = settings?.address || 'নীলফামারী পুরাতন রেলওয়ে স্টেশন, নীলফামারী সদর-৫৩০০, বাংলাদেশ';
  const logoUrl = settings?.logoUrl ? formatDriveImageUrl(settings.logoUrl) : '';

  const fontClasses = {
    sm: 'text-xs sm:text-[13px] leading-normal',
    md: 'text-sm sm:text-[15px] leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed'
  };

  const handleDownloadPDF = async () => {
    if (!printContainerRef.current) return;

    try {
      setIsGenerating(true);
      setDownloadSuccess(false);

      const sourceElement = printContainerRef.current;

      // Fixed standard A4 width in pixels (794px at 96 DPI matches 210mm A4 width)
      const A4_WIDTH_PX = 794;

      // Margins in mm: Configurable top & bottom with safe bounds
      const MARGIN_TOP_MM = Math.max(10, marginTopMm);
      const MARGIN_BOTTOM_MM = Math.max(10, marginBottomMm);
      const MARGIN_SIDE_MM = 12;

      const PDF_PAGE_WIDTH_MM = 210;
      const PDF_PAGE_HEIGHT_MM = 297;

      const PRINT_WIDTH_MM = PDF_PAGE_WIDTH_MM - (MARGIN_SIDE_MM * 2); // 186mm
      const PRINT_HEIGHT_MM = PDF_PAGE_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM; // ~269mm

      // Standard viewport height in pixels per page
      const pxPerMm = A4_WIDTH_PX / PRINT_WIDTH_MM;
      const printablePageHeightPx = Math.floor(PRINT_HEIGHT_MM * pxPerMm); // ~1148px

      // Setup an off-screen viewport container with fixed page-slice height
      const viewportContainer = document.createElement('div');
      viewportContainer.style.position = 'fixed';
      viewportContainer.style.left = '-9999px';
      viewportContainer.style.top = '0';
      viewportContainer.style.width = `${A4_WIDTH_PX}px`;
      viewportContainer.style.height = `${printablePageHeightPx}px`;
      viewportContainer.style.overflow = 'hidden';
      viewportContainer.style.backgroundColor = '#ffffff';
      viewportContainer.style.zIndex = '-9999';
      viewportContainer.style.opacity = '1';
      viewportContainer.style.pointerEvents = 'none';

      // Inner scrolling element that holds cloned content
      const innerContent = sourceElement.cloneNode(true) as HTMLElement;
      innerContent.style.width = `${A4_WIDTH_PX}px`;
      innerContent.style.maxWidth = `${A4_WIDTH_PX}px`;
      innerContent.style.height = 'auto';
      innerContent.style.minHeight = '0';
      innerContent.style.overflow = 'visible';
      innerContent.style.margin = '0';
      innerContent.style.padding = '28px 36px';
      innerContent.style.boxShadow = 'none';
      innerContent.style.border = 'none';
      innerContent.style.position = 'relative';

      // CRITICAL: Ensure logo or any images in header never blow up to natural dimensions in html2canvas
      innerContent.querySelectorAll('img').forEach((img) => {
        img.style.width = '56px';
        img.style.height = '56px';
        img.style.maxWidth = '56px';
        img.style.maxHeight = '56px';
        img.style.objectFit = 'contain';
        img.style.flexShrink = '0';
        img.style.display = 'inline-block';
        img.setAttribute('width', '56');
        img.setAttribute('height', '56');
      });

      viewportContainer.appendChild(innerContent);
      document.body.appendChild(viewportContainer);

      // Allow fonts/KaTeX math to settle
      await new Promise(resolve => setTimeout(resolve, 200));

      const rawScrollHeight = Math.max(
        innerContent.scrollHeight,
        innerContent.offsetHeight
      );

      // Check if document can fit onto a single page to prevent unnecessary 2nd page
      // If content is within 125% of single-page height, we scale it gracefully into 1 page
      const canAutoFitSingle = fitSinglePage && rawScrollHeight <= printablePageHeightPx * 1.25;

      let effectiveScrollHeight = rawScrollHeight;
      if (canAutoFitSingle && rawScrollHeight > printablePageHeightPx) {
        const scaleFactor = (printablePageHeightPx - 20) / rawScrollHeight;
        innerContent.style.transform = `scale(${scaleFactor})`;
        innerContent.style.transformOrigin = 'top center';
        effectiveScrollHeight = printablePageHeightPx;
        await new Promise(resolve => setTimeout(resolve, 60));
      }

      // Initialize portrait A4 PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // SMART PARAGRAPH-AWARE PAGINATION:
      // Prevent cutting through paragraphs or headings when multi-page document is rendered
      const containerRect = innerContent.getBoundingClientRect();
      const elementsToAvoidBreaking = innerContent.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, li, hr, .page-break-marker, [class*="break-inside-avoid"], .latex-rendered-content > div, .latex-rendered-content > p, .latex-rendered-content > blockquote, .latex-rendered-content > ul, .latex-rendered-content > ol'
      );

      // Pre-calculate smart slice breaks so paragraphs are never cut in half
      const pageBreaks: { startY: number; height: number }[] = [];

      if (canAutoFitSingle) {
        pageBreaks.push({ startY: 0, height: printablePageHeightPx });
      } else {
        let scanY = 0;
        while (scanY < effectiveScrollHeight) {
          const remaining = effectiveScrollHeight - scanY;
          if (remaining <= printablePageHeightPx) {
            // Check if there is an explicit page-break within remaining
            let explicitBreakY: number | null = null;
            for (let j = 0; j < elementsToAvoidBreaking.length; j++) {
              const el = elementsToAvoidBreaking[j];
              if (el.classList.contains('page-break-marker')) {
                const rect = el.getBoundingClientRect();
                const elTop = rect.top - containerRect.top;
                if (elTop > scanY + 40 && elTop < scanY + remaining - 40) {
                  explicitBreakY = elTop;
                  break;
                }
              }
            }
            if (explicitBreakY !== null) {
              pageBreaks.push({ startY: scanY, height: explicitBreakY - scanY });
              scanY = explicitBreakY;
              continue;
            }

            pageBreaks.push({ startY: scanY, height: remaining });
            break;
          }

          const targetBoundary = scanY + printablePageHeightPx;
          let safeCutY = targetBoundary;

          // Check each paragraph / heading / block element
          for (let j = 0; j < elementsToAvoidBreaking.length; j++) {
            const el = elementsToAvoidBreaking[j];
            const rect = el.getBoundingClientRect();
            const elTop = rect.top - containerRect.top;
            const elBottom = rect.bottom - containerRect.top;

            // 1. Explicit page break marker (\newpage / \pagebreak)
            if (el.classList.contains('page-break-marker')) {
              if (elTop > scanY + 40 && elTop <= targetBoundary) {
                safeCutY = elTop;
                break;
              }
            }

            // 2. If an element crosses the boundary line (starts before, ends after)
            if (elTop < targetBoundary && elBottom > targetBoundary) {
              const elementHeight = elBottom - elTop;
              // Push the entire element to the next page if there's already content on this page
              // and the element itself can fit on the next page
              if (elTop - scanY >= 50 && elementHeight < printablePageHeightPx) {
                safeCutY = elTop;
                break;
              }
            }

            // 3. Prevent orphan headings: if a heading starts near the bottom (within 130px)
            if (
              el.tagName.match(/^H[1-6]$/i) &&
              elTop < targetBoundary &&
              targetBoundary - elTop < 130
            ) {
              if (elTop - scanY >= 50) {
                safeCutY = elTop;
                break;
              }
            }
          }

          const sliceHeight = Math.min(printablePageHeightPx, safeCutY - scanY);
          pageBreaks.push({ startY: scanY, height: sliceHeight });
          scanY += sliceHeight;

          // If remaining height is negligible (< 50px), avoid trailing blank page
          if (effectiveScrollHeight - scanY < 50) {
            break;
          }
        }
      }

      const totalPages = pageBreaks.length;

      // Render each page cleanly
      for (let pIndex = 0; pIndex < pageBreaks.length; pIndex++) {
        const pageInfo = pageBreaks[pIndex];
        const pageNumber = pIndex + 1;

        if (pageNumber > 1) {
          pdf.addPage('a4', 'portrait');
        }

        const currentSliceHeight = pageInfo.height;

        // Shift inner content up to show current page slice (unless single-page scale fit)
        if (!canAutoFitSingle) {
          innerContent.style.transform = `translateY(-${pageInfo.startY}px)`;
        }
        viewportContainer.style.height = `${currentSliceHeight}px`;

        await new Promise(resolve => setTimeout(resolve, 60));

        // Capture only the fixed-size viewport element
        const canvas = await html2canvas(viewportContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: A4_WIDTH_PX,
          height: currentSliceHeight,
          windowWidth: A4_WIDTH_PX,
          windowHeight: printablePageHeightPx
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const sliceHeightMm = (currentSliceHeight / pxPerMm);

        // Render document slice onto PDF with configured top margin
        pdf.addImage(
          imgData,
          'JPEG',
          MARGIN_SIDE_MM,
          MARGIN_TOP_MM,
          PRINT_WIDTH_MM,
          sliceHeightMm,
          undefined,
          'FAST'
        );

        // FOOTER: ONLY page number as explicitly requested by user
        // Using crisp canvas image to ensure 100% font support without mojibake
        const pageNumberImg = createPageNumberImage(pageNumber, totalPages);
        pdf.addImage(
          pageNumberImg,
          'PNG',
          (PDF_PAGE_WIDTH_MM - 35) / 2,
          PDF_PAGE_HEIGHT_MM - (MARGIN_BOTTOM_MM / 2) - 4,
          35,
          6
        );
      }

      // Remove staging viewport DOM element
      if (document.body.contains(viewportContainer)) {
        document.body.removeChild(viewportContainer);
      }

      const safeTitle = (documentData.title || 'Document')
        .replace(/[/\\?%*:|"<>]/g, '-')
        .slice(0, 40)
        .trim();
      const fileName = `${isNotice ? 'Notice' : 'Islamic_Blog'}_${safeTitle}.pdf`;

      pdf.save(fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      const stray = document.querySelectorAll('div[style*="left: -9999px"]');
      stray.forEach(el => el.remove());
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in font-serif-bn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header / Actions Bar */}
        <div className="px-5 py-3.5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isNotice ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-emerald-800 text-emerald-200 border border-emerald-700'}`}>
              {isNotice ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-bn">
                  {isNotice ? 'নোটিস পিডিএফ প্রিন্ট ও পেজ সেটআপ' : 'ইসলামিক ব্লগ পিডিএফ প্রিন্ট ও পেজ সেটআপ'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                  A4 স্ট্যান্ডার্ড
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-sans-bn">
                স্মার্ট সিঙ্গেল-পেজ ফিটিং ও মার্জিন সুরক্ষিত ফরম্যাট
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold font-sans-bn ${
                showSettingsPanel 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200'
              }`}
              title="পিডিএফ পেজ ও মার্জিন সেটিংস কাস্টমাইজ করুন"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">পেজ সেটিংস</span>
            </button>
            <button
              onClick={handleBrowserPrint}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors cursor-pointer"
              title="ব্রাউজার থেকে সরাসরি প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-rose-600 text-emerald-200 hover:text-white transition-colors cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible PDF Page Settings Panel */}
        {showSettingsPanel && (
          <div className="px-6 py-4 bg-emerald-50/95 border-b border-emerald-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans-bn shrink-0 animate-fade-in">
            {/* Font Size Setup */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 font-serif-bn">
                ফন্ট সাইজ (টেক্সট আকার):
              </label>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-200">
                {(['sm', 'md', 'lg'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`flex-1 py-1 rounded-lg font-bold text-center cursor-pointer transition-all ${
                      fontSize === sz 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sz === 'sm' ? 'ছোট' : sz === 'md' ? 'মাঝারি' : 'বড়'}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Margin Setup */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 font-serif-bn">
                উপরের মার্জিন (Top): {marginTopMm} mm
              </label>
              <input
                type="range"
                min="10"
                max="24"
                step="2"
                value={marginTopMm}
                onChange={(e) => setMarginTopMm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>১০ mm (কম্প্যাক্ট)</span>
                <span>২৪ mm (প্রশস্ত)</span>
              </div>
            </div>

            {/* Bottom Margin Setup */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 font-serif-bn">
                নিচের মার্জিন (Bottom): {marginBottomMm} mm
              </label>
              <input
                type="range"
                min="10"
                max="24"
                step="2"
                value={marginBottomMm}
                onChange={(e) => setMarginBottomMm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>১০ mm (কম্প্যাক্ট)</span>
                <span>২৪ mm (প্রশস্ত)</span>
              </div>
            </div>

            {/* Smart Page Fit & Toggles */}
            <div className="flex flex-col justify-center space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={fitSinglePage}
                  onChange={(e) => setFitSinglePage(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-slate-900 font-bold flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-emerald-700" />
                  <span>১ পাতায় অটো-ফিট (অতিরিক্ত পেজ রোধ)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeOfficialHeader}
                  onChange={(e) => setIncludeOfficialHeader(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-slate-800 font-medium">অফিসিয়াল লেটারহেড যুক্ত রাখুন</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeBorders}
                  onChange={(e) => setIncludeBorders(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-slate-800 font-medium">আলংকারিক বর্ডার ফ্রেম</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-sans-bn flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isNotice ? 'নোটিস প্রিন্ট ও ডাউনলোড প্রিভিউ' : 'ইসলামিক ব্লগ আর্টিকেল প্রিভিউ'} (A4 ফরম্যাট)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                downloadSuccess 
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-102'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A4 পিডিএফ প্রস্তুত হচ্ছে...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ডাউনলোড সম্পন্ন!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>A4 PDF ডাউনলোড করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/90 flex justify-center">
          
          {/* Printable A4 Sheet container with fixed 794px A4 width */}
          <div
            ref={printContainerRef}
            id="printable-a4-document"
            className={`w-full max-w-[794px] bg-white rounded-xl shadow-xl p-6 sm:p-10 text-slate-800 font-serif-bn flex flex-col justify-between relative ${
              includeBorders ? 'border-2 border-emerald-900/40 ring-4 ring-emerald-50' : 'border border-slate-300'
            }`}
          >
            <div>
              {/* Official Letterhead Top Header - Dignified & Space-Efficient */}
              {includeOfficialHeader && (
                <div className="pb-4 border-b-2 border-emerald-800 text-center relative">
                  <div className="flex items-center justify-center gap-3.5 mb-1.5">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={foundationName} 
                        width="56"
                        height="56"
                        style={{
                          width: '56px',
                          height: '56px',
                          maxWidth: '56px',
                          maxHeight: '56px',
                          objectFit: 'contain',
                          flexShrink: 0,
                          display: 'inline-block'
                        }}
                        className="w-14 h-14 object-contain rounded-full border border-emerald-200 p-0.5 shadow-xs shrink-0"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-emerald-300 flex items-center justify-center shadow-xs">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}
                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif-bn leading-tight">
                        {foundationName}
                      </h1>
                      {slogan && (
                        <p className="text-xs font-bold text-emerald-700 font-serif-bn mt-0.5">
                          {slogan}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Header Contact Bar */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-[11px] text-slate-600 font-sans-bn pt-1.5 border-t border-emerald-100 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>{phone}</span>
                    </span>
                    {altPhone && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span>{altPhone}</span>
                        </span>
                      </>
                    )}
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-emerald-700" />
                      <span>{email}</span>
                    </span>
                  </div>

                  {/* Full Address */}
                  <div className="text-[11px] text-slate-600 font-sans-bn mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{address}</span>
                  </div>

                  {/* Document type specific badge */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>
                      {isNotice ? 'দাপ্তরিক ও সর্বজনীন নোটিস' : 'ইসলামিক দাওয়াহ ও প্রবন্ধ'}
                    </span>
                  </div>
                </div>
              )}

              {/* Document Category & Metadata Bar */}
              <div className="py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs font-sans-bn">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs font-serif-bn ${
                    documentData.isImportant
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isNotice ? 'অফিসিয়াল নোটিস' : 'ইসলামিক প্রবন্ধ'} • {documentData.category}
                  </span>
                  {documentData.isImportant && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                      জরুরি
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-600 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>তারিখ: {documentData.date}</span>
                  </span>
                  {documentData.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span>লেখক: {documentData.author} {documentData.authorRole ? `(${documentData.authorRole})` : ''}</span>
                    </span>
                  )}
                  {documentData.readTime && (
                    <span>• {documentData.readTime}</span>
                  )}
                </div>
              </div>

              {/* Document Title */}
              <div className="pt-4 pb-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-serif-bn">
                  {documentData.title}
                </h2>
              </div>

              {/* Document Body with LaTeX + Bengali text rendering - Full content */}
              <div className={`py-3 text-slate-800 font-serif-bn ${fontClasses[fontSize]}`}>
                <LaTeXContentRenderer
                  content={documentData.content}
                  contentType={documentData.contentType}
                  className="leading-relaxed"
                />
              </div>

              {/* Associated External Link or File Link if any */}
              {(documentData.fileUrl || documentData.linkUrl) && (
                <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans-bn space-y-1">
                  <p className="font-bold text-slate-700 font-serif-bn text-[11px]">সংযুক্ত তথ্য ও লিংক:</p>
                  {documentData.fileUrl && (
                    <p className="text-slate-600 truncate flex items-center gap-1">
                      <span className="font-semibold">ডাউনলোড/ছবি লিংক:</span> 
                      <a href={documentData.fileUrl} target="_blank" rel="noreferrer" className="text-emerald-700 underline truncate">
                        {documentData.fileUrl}
                      </a>
                    </p>
                  )}
                  {documentData.linkUrl && (
                    <p className="text-slate-600 truncate flex items-center gap-1">
                      <span className="font-semibold">রেফারেন্স/ভিডিও লিংক:</span> 
                      <a href={documentData.linkUrl} target="_blank" rel="noreferrer" className="text-emerald-700 underline truncate">
                        {documentData.linkUrl}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Document End / Official Authorization (Compact, Clean, No wasteful huge box) */}
            {isNotice ? (
              <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-sans-bn text-slate-600">
                <div className="text-[10px] text-slate-400">
                  মুদ্রণ তারিখ: {new Date().toLocaleDateString('bn-BD')}
                </div>
                <div className="text-center">
                  <div className="border-b border-dashed border-slate-400 pb-1 px-4 inline-block">
                    <span className="text-[10px] text-slate-400 block">অনুমোদিত স্বাক্ষর</span>
                    <span className="text-xs font-bold text-emerald-950 font-serif-bn">দপ্তর ও প্রশাসন</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-sans-bn text-slate-500">
                <span className="text-[11px] font-medium">
                  {documentData.author ? `লেখক: ${documentData.author}` : foundationName}
                </span>
                <span className="text-[10px] text-slate-400">
                  {foundationName} • অনলাইন সংস্করণ
                </span>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
