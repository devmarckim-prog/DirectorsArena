/**
 * Directors Arena v2.1 — Avatar URL Utility
 * Maps AI-generated gender + ageGroup tags to local placeholder image paths.
 * Falls back gracefully if the image file doesn't exist.
 */

/**
 * Generate avatar URL from character metadata
 * @param gender - "MALE" | "FEMALE" | "OTHER"
 * @param ageGroup - "TEEN" | "20S" | "30S" | "40S" | "50S_PLUS"
 * @returns Path to local avatar image in /public/avatars/
 */
export function getAvatarUrl(gender: string, ageGroup: string): string {
  const genderKey = gender === "MALE" ? "m" : gender === "FEMALE" ? "f" : "o";
  const ageKey = ageGroup.toLowerCase().replace("_", "");
  return `/avatars/dummy_${genderKey}_${ageKey}.jpg`;
}

/**
 * Get character initials for fallback avatar rendering
 * @param name - Full character name
 * @returns 1-2 character initials string
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Gradient colors mapped to character roles for visual differentiation
 */
const ROLE_GRADIENTS: Record<string, string> = {
  '주인공': 'from-amber-600 to-yellow-500',
  'protagonist': 'from-amber-600 to-yellow-500',
  '안타고니스트': 'from-red-700 to-rose-500',
  'antagonist': 'from-red-700 to-rose-500',
  '조력자': 'from-blue-600 to-cyan-400',
  'ally': 'from-blue-600 to-cyan-400',
  '멘토': 'from-purple-600 to-violet-400',
  'mentor': 'from-purple-600 to-violet-400',
  'default': 'from-neutral-600 to-neutral-400',
};

/**
 * Get gradient class for avatar fallback based on character role
 * @param role - Character's narrative role
 * @returns Tailwind gradient class string
 */
export function getAvatarGradient(role: string): string {
  const key = role.toLowerCase();
  return ROLE_GRADIENTS[key] || ROLE_GRADIENTS['default'];
}
