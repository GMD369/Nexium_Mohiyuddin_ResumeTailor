import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const { resume } = await req.json();
    if (!resume || typeof resume !== "string") {
      return new Response("Missing or invalid resume text.", { status: 400 });
    }

    // Parse the resume text into sections (without changing text)
    // Heuristic: Name/Email (first 1-2 lines), then summary (first para), then experience (middle), then skills (last para)
    const lines = resume.split(/\r?\n/).map(l => l.trim());
    const rest = lines.slice(lines[1] && lines[1].includes("@") ? 2 : 1).join("\n");
    const paragraphs = rest.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = height - 50;
    const left = 50;
    const lineHeight = 18;
    const sectionSpacing = 24;

    // Helper to wrap text to fit page width
    function wrapText(text: string, fontObj: typeof font, fontSize: number, maxWidth: number): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = fontObj.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }

    // Helper to draw text with wrapping and page break support, using correct font
    function drawText(text: string, opts: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> } = {}): void {
      const { bold, size = 12, color = rgb(0,0,0) } = opts;
      const fontObj = bold ? fontBold : font;
      const paragraphs = text.split(/\r?\n/);
      for (const para of paragraphs) {
        const wrappedLines = wrapText(para, fontObj, size, width - left * 2);
        for (const line of wrappedLines) {
          if (y < 60) {
            const newPage = pdfDoc.addPage();
            y = height - 50;
            page = newPage;
          }
          page.drawText(line, {
            x: left,
            y,
            size,
            font: fontObj, // always use correct font
            color,
          });
          y -= lineHeight;
        }
      }
    }

    // Helper to draw section text with preserved line breaks and always normal font
    function drawSectionText(text: string): void {
      const paragraphs = text.split(/\n{2,}/);
      for (const para of paragraphs) {
        const lines = para.split(/\r?\n/);
        for (const line of lines) {
          drawText(line, { size: 12, bold: false }); // always normal font
        }
        y -= 4; // extra space between paragraphs
      }
    }

    // Simple approach: Use the raw resume text directly with proper paragraph formatting
    const resumeParagraphs = resume.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    
    // Draw each paragraph with proper spacing
    for (const paragraph of resumeParagraphs) {
      drawSectionText(paragraph);
      y -= sectionSpacing - 4; // Extra space between paragraphs
    }

    // Finalize PDF
    const pdfBytes = await pdfDoc.save();
    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf"
      }
    });
  } catch (e) {
    console.error("[API/tailor/pdf] Error generating PDF:", e);
    return new Response("Failed to generate PDF.", { status: 500 });
  }
} 