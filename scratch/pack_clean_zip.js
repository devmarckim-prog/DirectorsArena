const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana');
const desktopDir = path.join('C:', 'Users', 'happy', 'OneDrive', '바탕 화면');
const tempDir = path.join(projectDir, 'scratch', 'DirectorsArena_Export_v10.2.2');
const targetZip = path.join(desktopDir, 'DirectorsArena_SourceCode_v10.2.2.zip');

console.log('Packaging project to:', targetZip);

// 1. Clean temp dir
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// 2. Define ignore list
const ignored = new Set([
  'node_modules',
  '.next',
  '.git',
  '.env.local',
  'scratch',
  '.vercel'
]);

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(projectDir, tempDir);

// 3. Add Quick Start Guide (한글 안내문)
const guideContent = `[ 디렉터즈 아레나 (Directors Arena) 소스코드 실행 안내 ]
버전: v10.2.2 (Build v10.2.2 - POC & Admin Ready)

1. 사전 준비물:
   - Node.js v18 이상 (Node.js 20 또는 22 권장)

2. 패키지 설치:
   터미널(명령 프롬프트/파워쉘)에서 압축 푼 폴더로 이동 후 아래 명령어를 입력합니다.
   $ npm install

3. 환경 변수 설정:
   .env.example 파일을 복사하여 .env.local 파일을 생성합니다.
   (POC 모드는 외부 API 키 없이도 자동 더미 데이터로 즉시 동작합니다.)

4. 로컬 서버 실행:
   $ npm run dev
   또는
   $ npx next dev -p 3001

5. 브라우저 접속:
   http://localhost:3000 (또는 포트 번호에 맞게 접속)
   - 메인 화면의 [POC 접속] 버튼 클릭 시 로그인 없이 테스트 어드민 권한으로 즉시 입장됩니다.
   - [어드민 콘솔]을 통해 관리자 페이지(/admin)를 바로 확인할 수 있습니다.
`;
fs.writeFileSync(path.join(tempDir, '실행_안내가이드.txt'), guideContent, 'utf-8');

// 4. Create ZIP using tar -a -cf
if (fs.existsSync(targetZip)) {
  fs.unlinkSync(targetZip);
}

execSync(`tar -a -cf "${targetZip}" -C "${path.dirname(tempDir)}" "${path.basename(tempDir)}"`, {
  stdio: 'inherit'
});

const stats = fs.statSync(targetZip);
console.log('ZIP created successfully! Size:', (stats.size / (1024 * 1024)).toFixed(2), 'MB');
