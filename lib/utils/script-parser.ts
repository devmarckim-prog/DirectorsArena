export type ScriptElementType = "HEADING" | "ACTION" | "CHARACTER" | "DIALOGUE" | "PARENTHETICAL";

export interface ScriptElement {
  id: string;
  type: ScriptElementType;
  content: string;
  characterName?: string;
}

export function parseScreenplay(text: string): ScriptElement[] {
  const elements: ScriptElement[] = [];
  const lines = text.split('\n');
  
  let currentElement: Partial<ScriptElement> | null = null;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const id = `block-${index}`;

    // 1. Scene Heading
    if (trimmedLine.startsWith("INT.") || trimmedLine.startsWith("EXT.") || /^[A-Z0-9\s-]+ - [A-Z0-9\s-]+/.test(trimmedLine)) {
      elements.push({ id, type: "HEADING", content: trimmedLine });
      currentElement = null;
    }
    // 2. Parenthetical (starts with '(')
    else if (trimmedLine.startsWith("(") && trimmedLine.endsWith(")")) {
      elements.push({ id, type: "PARENTHETICAL", content: trimmedLine });
      currentElement = null;
    }
    // 3. Character Name (Heuristic: Starts with spaces and is ALL CAPS, followed by something)
    // In our plain text format, characters are often just ALL CAPS on a single line
    else if (/^[A-Z0-9\s]+$/.test(trimmedLine) && trimmedLine.length < 30 && !trimmedLine.includes(".")) {
      elements.push({ id, type: "CHARACTER", content: trimmedLine, characterName: trimmedLine });
      currentElement = { type: "DIALOGUE", characterName: trimmedLine };
    }
    // 4. Dialogue (follows a character name)
    else if (currentElement?.type === "DIALOGUE") {
      elements.push({ id, type: "DIALOGUE", content: trimmedLine, characterName: currentElement.characterName });
      currentElement = null;
    }
    // 5. Action
    else {
      elements.push({ id, type: "ACTION", content: trimmedLine });
      currentElement = null;
    }
  });

  return elements;
}
