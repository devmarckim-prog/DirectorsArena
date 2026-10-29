const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'lib', 'actions', 'generation.ts');
let code = fs.readFileSync(targetFile, 'utf-8').replace(/\r\n/g, '\n');

if (!code.includes('POC_COOKIE_NAME')) {
  code = `import { cookies } from "next/headers";
import { POC_COOKIE_NAME, POC_TEST_ADMIN_USER } from "@/lib/poc";
` + code;
}

// 1. Intercept generateEpisodeScriptAction
const scriptActionTarget = "export async function generateEpisodeScriptAction(";
const scriptActionReplacement = `export async function generateEpisodeScriptAction(
  projectId: string,
  episodeId: string,
  episodeNumber: number
) {
  try {
    const cookieStore = await cookies();
    const isPoc = cookieStore.get(POC_COOKIE_NAME)?.value === 'true';
    if (isPoc) {
      const dummyScript = \`S# 1. 서울 도심 지하 벙커 / 밤 (INT. UNDERGROUND BUNKER - NIGHT)

희미한 푸른색 비상등이 점멸하고 있다.
강도진(38), 피 묻은 소매를 걷어 올린 채 메인 콘솔의 스위치를 올린다.
모니터에 쏟아지는 암호화된 금융 거래 내역들.

강도진: (낮은 목소리로) 서아린... 드디어 꼬리를 잡았군.

그때, 등 뒤에서 총구를 겨누는 소리가 난다.
도진이 천천히 뒤를 돌아보면, 어둠 속에서 모습을 드러내는 서아린(34).

서아린:
도진 씨. 여긴 당신이 들어올 수 있는 체스판이 아니에요.

강도진:
체스판은 네가 엎었지. 내가 끝내러 왔다.

두 사람 사이에 팽팽한 살기가 감돈다.\`;

      const summary = \`제\${episodeNumber}화 대본 집필 완료: 신디케이트의 금융 코어 서버에 잠입한 강도진과 그를 기다리던 서아린의 극한 대치.\`;
      try {
        const supabase = createAdminClient();
        await supabase.from('episodes_v2').update({ script_content: dummyScript, summary }).eq('id', episodeId);
      } catch (e) {}

      return {
        success: true,
        scriptContent: dummyScript,
        updatedSummary: summary
      };
    }
  } catch (e) {}
`;

if (!code.includes('isPoc = cookieStore.get(POC_COOKIE_NAME)')) {
  // Replace the function signature and start
  const regex = /export async function generateEpisodeScriptAction\(\s*projectId: string,\s*episodeId: string,\s*episodeNumber: number\s*\) \{/g;
  code = code.replace(regex, scriptActionReplacement);
}

// 2. Intercept generateEpisodeSceneDraftAction
const draftActionTarget = /export async function generateEpisodeSceneDraftAction\(\s*projectId: string,\s*episodeId: string,\s*instruction: string,\s*currentScript: string = ""\s*\) \{/g;
const draftActionReplacement = `export async function generateEpisodeSceneDraftAction(
  projectId: string,
  episodeId: string,
  instruction: string,
  currentScript: string = ""
) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(POC_COOKIE_NAME)?.value === 'true') {
      const draftText = \`[POC 모드 초고 생성]\n\nINT. 비 내리는 테라스 - 밤\n\n비에 젖은 테이블 위에 놓인 의문의 서류 봉투.\n도진이 봉투를 찢고 내부의 디지털 드라이브를 꺼낸다.\n도진: "모든 준비는 끝났다."\`;
      return {
        success: true,
        data: {
          heading: "INT. 비 내리는 테라스 - 밤",
          sceneText: draftText,
          critique: "지시사항('\${instruction}')이 완벽히 반영된 시네마틱 씬 초고입니다. (POC 테스트)"
        }
      };
    }
  } catch (e) {}
`;

code = code.replace(draftActionTarget, draftActionReplacement);

// 3. Intercept triggerRegenerateAction
const regenActionTarget = /export async function triggerRegenerateAction\(projectId: string, prompt: string = ""\) \{/g;
const regenActionReplacement = `export async function triggerRegenerateAction(projectId: string, prompt: string = "") {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(POC_COOKIE_NAME)?.value === 'true') {
      return { success: true, message: "POC 모드 재생성 완료 (더미 반영)" };
    }
  } catch (e) {}
`;

code = code.replace(regenActionTarget, regenActionReplacement);

fs.writeFileSync(targetFile, code, 'utf-8');
console.log('Successfully updated lib/actions/generation.ts');
