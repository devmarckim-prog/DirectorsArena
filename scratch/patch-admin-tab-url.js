const fs = require('fs');
const path = require('path');

const filePath = path.resolve('app/admin/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. useSearchParams import 추가
content = content.replace(
  `import { useRouter } from "next/navigation";`,
  `import { useRouter, useSearchParams } from "next/navigation";`
);

// 2. activeTab useState → URL 기반으로 교체
const oldState = `  const [activeTab, setActiveTab] = useState<'dashboard' | 'scripts' | 'prompts' | 'schema'>('dashboard');`;

const newState = `  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'dashboard' | 'scripts' | 'prompts' | 'schema') || 'dashboard';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scripts' | 'prompts' | 'schema'>(initialTab);

  const handleTabChange = (tab: 'dashboard' | 'scripts' | 'prompts' | 'schema') => {
    setActiveTab(tab);
    router.replace(\`/admin?tab=\${tab}\`, { scroll: false });
  };`;

if (!content.includes(oldState)) {
  console.error('❌ activeTab useState 타겟을 찾지 못했습니다.');
  process.exit(1);
}
content = content.replace(oldState, newState);

// 3. setActiveTab 호출을 handleTabChange로 교체 (탭 버튼들)
content = content.replace(/setActiveTab\('dashboard'\)/g, "handleTabChange('dashboard')");
content = content.replace(/setActiveTab\('scripts'\)/g, "handleTabChange('scripts')");
content = content.replace(/setActiveTab\('prompts'\)/g, "handleTabChange('prompts')");
content = content.replace(/setActiveTab\('schema'\)/g, "handleTabChange('schema')");

fs.writeFileSync(filePath, content, 'utf8');

const checks = [
  content.includes('useSearchParams'),
  content.includes('handleTabChange'),
  content.includes('router.replace(`/admin?tab='),
  content.includes("searchParams.get('tab')"),
];
console.log('✅ useSearchParams import:', checks[0]);
console.log('✅ handleTabChange 함수:', checks[1]);
console.log('✅ URL replace 로직:', checks[2]);
console.log('✅ 초기 탭 URL에서 읽기:', checks[3]);

if (checks.every(Boolean)) {
  console.log('\n✅ 패치 완료! 새로고침해도 현재 탭이 유지됩니다.');
} else {
  console.log('\n❌ 일부 패치 실패. 수동 확인 필요.');
}
