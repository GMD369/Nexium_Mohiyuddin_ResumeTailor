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

    // Assign sections
    const summary = paragraphs[0] || "";
    let experience = paragraphs.slice(1, -1).join("\n\n");
    let skills = paragraphs[paragraphs.length - 1] || "";

    // If only 2 paras, treat last as skills, else experience is middle
    if (paragraphs.length === 2) {
      experience = "";
      skills = paragraphs[1];
    }

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

    // Improved section detection for block text resumes
    function smartSectionSplit(text: string): { name: string; email: string; summary: string; experience: string; skills: string } {
      // Remove extra spaces
      const clean = text.replace(/\s+\|\s+/g, ' | ');
      const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const name = lines[0] || '';
      const email = lines[1] && lines[1].includes('@') ? lines[1] : '';
      let rest = lines.slice(email ? 2 : 1).join(' ');

      // Try to find skills section (comma separated or bulleted)
      let skills = '';
      let experience = '';
      let summary = '';
      // Heuristic: skills are often at the end, comma separated, or after 'Proficient in', 'Skills:', etc.
      const skillsMatch = rest.match(/((Proficient in|Skills:|Expertise:)[^\n]*)$/i);
      if (skillsMatch) {
        skills = skillsMatch[1].replace(/^(Proficient in|Skills:|Expertise:)/i, '').trim();
        rest = rest.replace(skillsMatch[0], '').trim();
      } else {
        // Try last comma-separated line
        const lastCommaIdx = rest.lastIndexOf(',');
        if (lastCommaIdx > 0) {
          const possibleSkills = rest.slice(lastCommaIdx - 30).split(/\.|\n/).pop();
          if (possibleSkills && possibleSkills.split(',').length > 3) {
            skills = possibleSkills.trim();
            rest = rest.replace(possibleSkills, '').trim();
          }
        }
      }
      // Experience: try to find 'Developed', 'Maintained', 'Implemented', etc.
      const expMatch = rest.match(/((Developed|Maintained|Implemented|Migrated|Integrated|Deployed|Successfully|Collaborated|Built|Created)[^]*)/i);
      if (expMatch) {
        experience = expMatch[1].trim();
        summary = rest.replace(expMatch[0], '').trim();
      } else {
        // Fallback: first 3-4 lines as summary, rest as experience
        const words = rest.split(' ');
        summary = words.slice(0, 50).join(' ');
        experience = words.slice(50).join(' ');
      }
      return { name, email, summary, experience, skills };
    }

    // Helper: Parse resume text into structured sections
    function parseResumeSections(text: string) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      let name = '', contact = '', rest = '';
      let sections: { [key: string]: string } = {};
      name = lines[0] || '';
      let contactLines: string[] = [];
      let i = 1;
      while (i < lines.length && !/^Profile|Education|Experience|Projects/i.test(lines[i])) {
        contactLines.push(lines[i]);
        i++;
      }
      contact = contactLines.join(' ');
      let currentSection = '';
      for (; i < lines.length; i++) {
        const line = lines[i];
        const sectionMatch = line.match(/^(Profile|Education|Experience|Projects)/i);
        if (sectionMatch) {
          currentSection = sectionMatch[1];
          sections[currentSection] = '';
        } else if (currentSection) {
          sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
        }
      }
      return { name, contact, sections };
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