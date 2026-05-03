import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

/**
 * lib/utils/export-docx.ts
 * Generates a DOCX file from script content.
 */

export async function exportToDOCX(title: string, scriptContent: string) {
  const cleanScript = scriptContent || "SCENE 1\n\nINT. EMPTY ROOM - DAY\n\nNo script content generated yet.";
  const lines = cleanScript.split('\n');
  
  const paragraphs: Paragraph[] = [];
  
  // Title Page
  paragraphs.push(
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 4000, after: 1000 },
    }),
    new Paragraph({
      text: "A Directors Arena Export",
      alignment: AlignmentType.CENTER,
      pageBreakBefore: false,
    })
  );

  // Script Content
  let expectDialogue = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) {
      if (expectDialogue) expectDialogue = false;
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    let indentLeft = 0;
    let isBold = false;
    let isAllCaps = line === line.toUpperCase();

    if (line.toUpperCase().startsWith("INT.") || line.toUpperCase().startsWith("EXT.") || line.match(/^S#\s*\d+/)) {
      isBold = true;
      expectDialogue = false;
    } else if (expectDialogue) {
      if (line.startsWith('(') && line.endsWith(')')) {
        indentLeft = 1440 * 1.5; // ~1.5 inches
      } else {
        indentLeft = 1440 * 1; // ~1 inch
      }
    } else if (isAllCaps && line.length < 40 && !line.match(/^[0-9]/)) {
      // Character
      indentLeft = 1440 * 2; // ~2 inches
      expectDialogue = true;
    }

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            bold: isBold,
            font: "Courier New",
            size: 24, // 12pt
          }),
        ],
        indent: { left: indentLeft },
        spacing: { after: 200 }, // Minor spacing
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_')}_script.docx`);
}
