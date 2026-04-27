/**
 * OMA Safety Harness: AI Response Parser & Healer (v1.0)
 * Designed to extract and repair malformed JSON from LLM responses.
 */

export function cleanAIResponse(raw: string): string {
  if (!raw) return "";

  // 1. Remove markdown fences (supporting case-insensitive)
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/g, '')
    .replace(/```/g, '')
    .trim();

  // 2. Extract only the portion between the first { and the last }
  // This helps when the AI adds conversational text around the JSON.
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Basic JSON Healer
 * Tries to fix common truncation issues like missing closing braces or brackets.
 */
export function repairJSON(jsonStr: string): string {
  let repaired = jsonStr.trim();
  if (!repaired) return "{}";

  // Count braces and brackets
  let openBraces = (repaired.match(/\{/g) || []).length;
  let closeBraces = (repaired.match(/\}/g) || []).length;
  let openBrackets = (repaired.match(/\[/g) || []).length;
  let closeBrackets = (repaired.match(/\]/g) || []).length;

  // Append missing terminations in reverse order
  // Note: This is a "blind" healer, it might not work for complex structure errors
  // but it fixes the most common "token cut-off" issue.
  
  // Close brackets first (likely nested inside an object or array)
  while (openBrackets > closeBrackets) {
    repaired += ']';
    closeBrackets++;
  }

  // Close braces last
  while (openBraces > closeBraces) {
    repaired += '}';
    closeBraces++;
  }

  return repaired;
}

/**
 * Robust JSON Parse
 * Combines cleaning, healing, and parsing with a definitive fallback.
 */
export function safeJSONParse<T>(raw: string, defaultValue: T): T {
  const cleaned = cleanAIResponse(raw);
  
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn("[SafeJSON] First parse attempt failed. Attempting repair...");
    try {
      const repaired = repairJSON(cleaned);
      return JSON.parse(repaired) as T;
    } catch (repairErr) {
      console.error("[SafeJSON] Repair failed. Returning default value.");
      return defaultValue;
    }
  }
}
