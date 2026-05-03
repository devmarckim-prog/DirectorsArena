const fs = require('fs');
const path = require('path');

const filePath = path.resolve('app/admin/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. React Suspense import 추가 (useEffect, useState 옆에)
content = content.replace(
  `import { useEffect, useState } from "react";`,
  `import { useEffect, useState, Suspense } from "react";`
);

// 2. 현재 export default 함수명을 AdminDashboardInner로 변경하고
//    Suspense로 감싼 새 default export 추가
// 기존: export default function AdminDashboardPage() {
// 변경: function AdminDashboardPage() { ... }
//       export default function AdminDashboardPageWrapper() { return <Suspense><AdminDashboardPage /></Suspense> }

content = content.replace(
  'export default function AdminDashboardPage()',
  'function AdminDashboardPage()'
);

// 파일 끝에 Suspense wrapper export 추가
const lastBrace = content.lastIndexOf('\n}');
if (lastBrace !== -1 && !content.includes('AdminDashboardPageWrapper')) {
  content = content.slice(0, lastBrace + 2) + `\nexport default function AdminDashboardPageWrapper() {\n  return (\n    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>\n      <AdminDashboardPage />\n    </Suspense>\n  );\n}\n`;
}

fs.writeFileSync(filePath, content, 'utf8');

const checks = [
  content.includes('Suspense } from "react"'),
  content.includes('AdminDashboardPageWrapper'),
  content.includes('<Suspense fallback='),
  !content.includes('export default function AdminDashboardPage()'),
];

console.log('✅ Suspense import:', checks[0]);
console.log('✅ Wrapper 컴포넌트:', checks[1]);
console.log('✅ Suspense fallback:', checks[2]);
console.log('✅ 기존 default export 제거:', checks[3]);

if (checks.every(Boolean)) {
  console.log('\n✅ Suspense 래핑 완료! 빌드 에러 없이 useSearchParams 사용 가능합니다.');
} else {
  console.log('\n❌ 일부 실패.');
}
