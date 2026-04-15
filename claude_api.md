# 🛡️ Directors Arena: Claude API Advanced Guidelines v2.1
**Subject:** Dynamic Model Selection & Admin-Controlled Prompting Architecture

## 1. 동적 설정 시스템 (Dynamic Admin Configuration)
모든 AI 호출 시 모델명과 시스템 프롬프트는 하드코딩하지 않으며, 어드민 설정(Supabase `admin_settings` 테이블)을 최우선으로 참조한다.

- **Dynamic Model Selection:** `createProjectAction` 및 `generateEpisodeScriptAction`은 호출 시점에 어드민에서 선택된 `current_model_id`를 가져와 적용한다.
- **Dynamic System Prompt:** 에피소드 생성 및 대본 작성용 시스템 프롬프트(Base Prompt)는 어드민에서 수정한 `script_system_prompt` 필드값을 베이스로 사용하여 동적으로 구성한다.

## 2. 장기 기억 아키텍처: 스토리 바이블 (Story Bible)
단순 히스토리 누적 방식을 폐기하고, 매 호출마다 최신 설정을 주입하는 방식을 유지한다.

- **Fixed Truth (Story Bible):** 모든 API 요청 상단에 `<story_bible>` 태그를 포함하여 프로젝트 메타데이터와 캐릭터 사전을 강제 주입한다.
- **Rolling Summary (Chaining):** 이전 회차 원문 대신, 각 회차 종료 후 생성된 300자 요약본(`<previous_events>`)만 전달하여 토큰 절약과 기억력을 동시에 확보한다.
- **State Tracking:** 인물의 부상, 아이템 획득 등 '상태 변화'를 별도 필드로 트래킹하여 다음 회차에 반영한다.

## 3. 데이터 무결성: JSON & 대본 따옴표 충돌 해결
시나리오 대본의 큰따옴표(`""`)가 JSON 구조를 파괴하는 것을 방지하기 위해 다음 기술을 강제한다.

- **Vercel AI SDK + Zod:** `streamObject` 기능을 사용하여 서버측에서 스트리밍하고, Zod 스키마를 통해 응답 구조를 강제한다.
- **Auto-Escaping:** 프레임워크 수준에서 대본 내부의 따옴표를 이스케이프 처리하여 `JSON.parse` 에러를 원천 차단한다.

## 4. 프롬프트 구조 (XML Tagging & Injection)
어드민에서 입력받은 `script_system_prompt`를 최상단에 배치하고 그 아래 데이터를 구조화한다.

```xml
<system_instructions>
{{admin_settings.script_system_prompt}}
</system_instructions>

<story_bible>{{project_context_json}}</story_bible>
<previous_summaries>{{rolling_summaries_chain}}</previous_summaries>
<current_task>제 {{episode_number}}화의 시나리오를 생성하십시오.</current_task>
```

## 5. UX/UI 및 스트리밍 파이프라인
- **트리거:** 유저가 '생성' 클릭 시 즉시 DB에 `BAKING` 상태로 저장 후 리스트로 이동한다.
- **스트리밍:** 상세 페이지 진입 시 `streamObject` API를 호출하여 실시간 타이핑 효과를 구현한다.
- **캐릭터 매핑:** AI가 생성한 `gender`, `ageGroup` 태그를 기반으로 로컬 아바타 이미지를 즉시 매칭한다.
- **회차 관리:** 1화는 자동 생성, 2화부터는 '대본 생성하기' 버튼 클릭 시 개별적으로 API를 호출하여 생성한다.

## 6. 어드민 제어 요구사항 (DB Schema)
에이전트는 아래 설정을 관리하기 위한 `admin_settings` 테이블 접근 로직을 구현해야 한다.

- `current_model_id`: (예: `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`)
- `script_system_prompt`: 시나리오 작가로서의 페르소나와 집필 가이드라인 전문
