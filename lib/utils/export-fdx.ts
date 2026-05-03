/**
 * lib/utils/export-fdx.ts
 * Generates a Final Draft XML (.fdx) file from script content.
 */

export function exportToFDX(title: string, scriptContent: string) {
  const cleanScript = scriptContent || "SCENE 1\n\nINT. EMPTY ROOM - DAY\n\nNo script content generated yet.";
  
  // Basic heuristic parser to split text into FDX elements
  // 1. Scene Heading (INT/EXT)
  // 2. Character (All caps, indented usually, but here we just check all caps short lines)
  // 3. Dialogue (Following character)
  // 4. Parenthetical (Starts with '(')
  // 5. Action (Default)
  
  const lines = cleanScript.split('\n');
  let fdxElements = "";
  
  let currentType = "Action";
  let expectDialogue = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) {
      if (expectDialogue) expectDialogue = false;
      continue;
    }

    let type = "Action";

    // Heuristics
    if (line.toUpperCase().startsWith("INT.") || line.toUpperCase().startsWith("EXT.") || line.toUpperCase().match(/^S#\s*\d+/)) {
      type = "Scene Heading";
      expectDialogue = false;
    } else if (expectDialogue) {
      if (line.startsWith('(') && line.endsWith(')')) {
        type = "Parenthetical";
      } else {
        type = "Dialogue";
      }
    } else if (line === line.toUpperCase() && line.length < 40 && !line.match(/^[0-9]/)) {
      // Possible character name
      type = "Character";
      expectDialogue = true;
    }

    fdxElements += `
    <Paragraph Type="${type}">
      <Text>${escapeXml(line)}</Text>
    </Paragraph>`;
  }

  const xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<FinalDraft DocumentType="Script" Template="No" Version="4">
  <Content>
    ${fdxElements}
  </Content>
</FinalDraft>`;

  const blob = new Blob([xmlString], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_')}_script.fdx`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe: string) {
  return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
}
