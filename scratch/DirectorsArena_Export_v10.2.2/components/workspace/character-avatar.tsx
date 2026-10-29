import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
  name: string;
  age?: number;
  gender?: string;
  avatar_url?: string;
  className?: string;
  size?: number;
}

/**
 * CharacterAvatar (v1.0)
 * Uses the default icon sprite sheet provided by the user.
 * Sprite: /avatar-sprite.png (6 cols x 3 rows of icons)
 */
export function CharacterAvatar({ name, age = 25, gender = "Male", avatar_url, className, size = 64 }: CharacterAvatarProps) {
  // If user provided a custom avatar, use it
  if (avatar_url) {
    return (
      <div className={cn("rounded-2xl bg-black/50 border border-white/10 shrink-0 overflow-hidden", className)} style={{ width: size, height: size }}>
        <img src={avatar_url} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Determine Sprite Coordinates (Row, Col)
  // Mapping logic based on the 6x3 sprite sheet
  let row = 1; // Default Adult
  let col = 1; // Default Asian

  const charAge = typeof age === 'string' ? parseInt(age) : age;
  const isMale = gender?.toLowerCase() === "male";
  const isFemale = gender?.toLowerCase() === "female";

  // Deterministic "Race/Style" based on name hash (0: Western, 1: Asian, 2: Arab)
  // We prioritize Asian (1) for Korean names, but for variety we can use a hash.
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const raceOffset = hash % 3; // 0, 1, 2

  if (charAge < 5) {
    // Toddlers (Row 0, Col 0-2)
    row = 0;
    col = raceOffset;
  } else if (charAge < 20) {
    // Children (Row 0, Col 3-5 OR Row 1, Col 0-2)
    // Image has (F, M, M) pattern
    if (isFemale) {
      row = raceOffset === 0 ? 0 : 1;
      col = 0 + (raceOffset % 3 === 0 ? 3 : 0); // Roughly mapping to F icons
    } else {
      row = raceOffset === 0 ? 0 : 1;
      col = raceOffset === 0 ? 4 : 1; // Roughly mapping to M icons
    }
  } else if (charAge < 60) {
    // Adults (Row 1, Col 3-5 OR Row 2, Col 0-2)
    // Mostly F icons in the sprite, we'll use them as generic avatars
    row = raceOffset === 0 ? 1 : 2;
    col = raceOffset === 0 ? 3 : 0; 
    // Adjust col for Asian/Arab
    if (raceOffset === 1) col += 1;
    if (raceOffset === 2) col += 2;
  } else {
    // Elderly (Row 2, Col 3-5)
    row = 2;
    col = 3 + raceOffset;
  }

  // Clamping
  row = Math.min(2, Math.max(0, row));
  col = Math.min(5, Math.max(0, col));

  // CSS Sprite Calculation
  // Total image: 6 cols, 3 rows.
  // We need to account for the header.
  // Header is roughly 20% of height. Icons are 80%.
  const headerHeightPct = 18; 
  const iconAreaHeightPct = 100 - headerHeightPct;
  const stepX = 100 / 5; // 6 cols -> 0%, 20%, 40%, 60%, 80%, 100%
  const stepY = iconAreaHeightPct / 2; // 3 rows -> header%, header+40%, 100%

  const bgPosX = col * 20; 
  const bgPosY = headerHeightPct + (row * (iconAreaHeightPct / 2.5)); // Adjusted for vertical alignment

  return (
    <div 
      className={cn("rounded-2xl bg-[#F8F8F8] border border-white/10 shrink-0 overflow-hidden relative", className)}
      style={{ width: size, height: size }}
      title={`${name} (Default Avatar)`}
    >
      <div 
        className="absolute inset-0 grayscale contrast-125 brightness-110"
        style={{
          backgroundImage: "url('/avatar-sprite.png')",
          backgroundSize: "650% 420%", // Zoomed to fit the grid
          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
          imageRendering: "crisp-edges"
        }}
      />
      {/* Overlay to blend with dark mode if needed, but the icons are clean white */}
      <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
    </div>
  );
}
