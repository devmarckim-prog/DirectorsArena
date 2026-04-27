# Directors Arena - Version 3.9.6
History

## v0.35 (Previous Computer State)
- Stable branch at v0.35.

## v0.1.0 (2026-04-26) - Restoration Start
- **Environment**: Configured `.env.local` and `npm install`.
- **Server**: Port 3000 restored after resolving zombie process conflicts.

## v0.1.3 (2026-04-26) - Data & Rendering Fixes
- **Database Restoration**: Fixed project `142231a4` (Directors Arena) which was stuck in `ERROR` status.
- **Title Update**: Updated project title to **"아레나의 대본가 (Scriptwriter in the Arena)"**.
- **Rendering Optimization**: Enhanced `StoryBibleTab` with robust JSON extraction.

## v0.1.4 (2026-04-26) - Data Rescue (Heart-aching Project)
- **Data Rescue**: Salvaged 3 characters (김지영, 민우, 수진) and 1 story beat from the corrupted synopsis string of project `5561a436` ([가칭] 가슴시린).
- **Cause Analysis**: Identified AI response corruption (JSON-in-String leak) as the primary cause of generation stalls.

## v0.1.5 (2026-04-26) - Safety Harness Implementation
- **Safety Harness**: Added `lib/utils/ai-parser.ts` for real-time JSON repair and healing.
- **Validation**: Integrated Zod `ProjectGenerationSchema` validation in API routes.
- **Auto-Rescue**: Implemented "Deep-Tissue Rescue" for characters accidentally nested in narrative strings.
- **Persistence Sync**: Fixed a bug where `ignite` API was not populating sub-tables (Characters, Beats).

## v0.1.6 (2026-04-26) - UX Optimization
- **Wizard Success Hook**: Added a full-screen success overlay after project creation.
- **Project Card Visibility**: Forced the project title to be visible during the "Baking" phase.
- **Navigation**: Improved wizard-to-list transition flow.

## v0.1.7 (2026-04-26) - Layout Unification & DNA Regeneration
- **Project Card Layout**: Unified "Baking" and "Completed" card layouts. Titles now share the same position and font style.
- **Progress Tracking**: Implemented a smooth, incremental progress bar in the card's image area. 
- **UI Cleanup**: Removed redundant "Terminal Access Locked" text.
- **DNA Regeneration**: Enabled project regeneration that explicitly incorporates edited character data (Age, Job, Look, etc.) into the AI prompt.
- **Revalidation**: Fixed character update revalidation to ensure instant UI feedback.
