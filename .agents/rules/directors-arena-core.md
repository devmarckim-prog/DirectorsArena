---
trigger: always_on
glob: "**/*.{ts,tsx,js,jsx,css,md,mjs,tsbuildinfo}"
description: Core architectural principles and design tokens for the Directors Arena project.
---

# 🏗️ Directors Arena Core Principles (v1.0)

본 문서는 'Directors Arena' 프로젝트의 ** Permanent Principles(고정 원칙)**를 정의합니다. 모든 AI 에이전트와 개발자는 이 규칙을 엄격히 준수해야 합니다.

---

## 🎨 1. Design System & Identity

- **Primary Color**: `brand-gold: #C5A059` (Champagne Gold). 모든 강조색과 로더 스트로크에 사용.
- **Background**: `neutral-950` (Ultra-dark). 시네마틱한 분위기를 위해 블랙에 가까운 다크 모드 유지.
- **Key Motif**: **Writer-centric icons** (Pen Nib, Script, Ink Drop). 기하학 도형 대신 작가적 상징물 사용.
- **Tone**: **Professional Cinematic SaaS**. 세련되고 프리미엄한 인터페이스 지향.

## ⚙️ 2. Technical Standards

- **Stack**: Next.js 15 (App Router, Turbopack), Tailwind 4, Supabase (Auth/DB), Vercel AI SDK.
- **Verification**: 모든 UI 작업 완료 후에는 반드시 **Browser Agent**를 사용하여 물리적으로 검증해야 함.
- **Evidence**: 컴포넌트 구현 완료 시 `.webp` 영상 또는 이미지 스크린샷 증거를 반드시 제출해야 함.
- **Styling**: Tailwind 4의 `@theme` 지시어를 사용하여 전역 변수를 관리함.

## 🔄 3. Workflow (The Harnessing)

- **Micro-step Approach**: 복수 개의 복잡한 기능을 한꺼번에 구현하지 않음. 기능 단위로 쪼개어 단계별 집필 및 검증 수행.
- **Audit-First**: 모든 AI 생성 파이프라인은 `Draft(집필) -> QC Audit(검수) -> Final Output(최종 출력)` 시퀀스를 준수해야 함.
- **Data Hierarchy**: `Project > Scene > Block` 계층 구조를 통해 씬 내부의 대사(Block) 하나하나를 미세하게 제어함.

## 📱 4. Responsive & Audit Standards

- **Strategy**: **Mobile-First Approach**. 모든 UI 컴포넌트는 375px 너비에서부터 기능적이고 심미적이어야 함.
- **Breakpoints**: Tailwind 4 동적 브레이크포인트(`sm, md, lg, xl`)를 엄격히 준수함.
- **Multi-Device Audit**: 모든 UI 작업 완료 시 브라우저 에이전트를 통해 **Desktop(1440px)**과 **Mobile(375px)** 양쪽 뷰포트를 물리적으로 검측해야 함.
- **Evidence**: 양쪽 뷰포트에 대한 시각적 증거(영상 또는 스크린샷) 제출 필수.

---
**Last Updated**: 2026-04-06
**Version**: `v1.1.0`

## 📋 5. Dashboard Slate Standards
- **Ordering**: The 'New Project' card must always be the first entry (Index 0) in the Slate.
- **Unified Actions**: The 'New Project' card serves as the sole creation trigger; redundant buttons in the header should be removed to maintain a clean 'Cinematic Void' focus.
- **Spacing**: Maintain a consistent 24px (`space-x-6`) gap between all slate entries.
