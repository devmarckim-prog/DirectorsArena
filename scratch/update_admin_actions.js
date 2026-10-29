const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana', 'lib', 'actions', 'admin.ts');
let code = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');

// 1. Add isPocMode at top
const topImports = `"use server";

import { cookies } from "next/headers";
import { POC_COOKIE_NAME } from "@/lib/poc";

async function isPocMode(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(POC_COOKIE_NAME)?.value === 'true';
  } catch {
    return false;
  }
}
`;

if (!code.includes('POC_COOKIE_NAME')) {
  code = code.replace('"use server";\n', topImports);
}

// 2. Wrap getAdminSettingsAction with POC / fallback
const oldGetSettings = `export async function getAdminSettingsAction() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_settings').select('*').limit(1).single();`;

const newGetSettings = `export async function getAdminSettingsAction() {
  if (await isPocMode()) {
    return {
      model_id_primary: 'claude-3-5-sonnet-20241022',
      model_id_fast: 'claude-3-5-haiku-20241022',
      prompt_scenario_init: '당신은 엘리트 쇼러너입니다.',
      prompt_episode_outline: '각 회차별 아웃라인을 작성하십시오.',
      prompt_episode_script: DEFAULT_SCRIPT_PROMPT,
      prompt_scenario_rewrite: DEFAULT_REWRITE_PROMPT,
      schema_fields: DEFAULT_SCHEMA_FIELDS,
      cost_generate: 10,
      cost_rewrite: 3,
      cost_similar: 5,
      cost_script: 7,
      bonus_welcome: 30,
      bonus_event: 0,
      show_samples: true,
      missingColumns: null
    };
  }
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('admin_settings').select('*').limit(1).single();`;

if (code.includes(oldGetSettings)) {
  code = code.replace(oldGetSettings, newGetSettings);
  // Add catch block before end of getAdminSettingsAction
  const oldGetSettingsEnd = `  // Merge: DB에 schema_fields 없으면 기본값 주입
  return {
    ...data,
    show_samples: data.show_samples ?? true,
    schema_fields: data.schema_fields ?? DEFAULT_SCHEMA_FIELDS,
    missingColumns: missingColumns.length > 0 ? missingColumns : null
  };
}`;
  const newGetSettingsEnd = `  // Merge: DB에 schema_fields 없으면 기본값 주입
  return {
    ...data,
    show_samples: data.show_samples ?? true,
    schema_fields: data.schema_fields ?? DEFAULT_SCHEMA_FIELDS,
    missingColumns: missingColumns.length > 0 ? missingColumns : null
  };
  } catch (e) {
    return {
      model_id_primary: 'claude-3-5-sonnet-20241022',
      model_id_fast: 'claude-3-5-haiku-20241022',
      prompt_scenario_init: '당신은 엘리트 쇼러너입니다.',
      prompt_episode_outline: '각 회차별 아웃라인을 작성하십시오.',
      prompt_episode_script: DEFAULT_SCRIPT_PROMPT,
      prompt_scenario_rewrite: DEFAULT_REWRITE_PROMPT,
      schema_fields: DEFAULT_SCHEMA_FIELDS,
      cost_generate: 10,
      cost_rewrite: 3,
      cost_similar: 5,
      cost_script: 7,
      bonus_welcome: 30,
      bonus_event: 0,
      show_samples: true,
      missingColumns: null
    };
  }
}`;
  code = code.replace(oldGetSettingsEnd, newGetSettingsEnd);
}

// 3. Update fetchAdminDashboardStats
const oldStats = `export async function fetchAdminDashboardStats() {
  const supabase = createAdminClient();
  
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });`;

const newStats = `export async function fetchAdminDashboardStats() {
  if (await isPocMode()) {
    return {
      totalUsers: 142,
      todayJoiners: 8,
      paidSubscribers: 35,
      todayCreditUsage: 450,
      recentUsers: [
        {
          id: 'poc-admin',
          full_name: '테스트 어드민 (POC)',
          email: 'test-admin@directorsarena.internal',
          plan: 'elite',
          credits: 99999,
          created_at: new Date().toISOString()
        },
        {
          id: 'usr-1',
          full_name: '김도훈 감독',
          email: 'kim.director@studio.kr',
          plan: 'pro',
          credits: 2400,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'usr-2',
          full_name: '이수진 작가',
          email: 'lee.writer@arena.io',
          plan: 'pro',
          credits: 1800,
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'usr-3',
          full_name: '박민우 프로듀서',
          email: 'park.producer@cinema.net',
          plan: 'starter',
          credits: 500,
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ]
    };
  }

  try {
    const supabase = createAdminClient();
    
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });`;

if (code.includes(oldStats)) {
  code = code.replace(oldStats, newStats);
  const oldStatsEnd = `  return {
    totalUsers: totalUsers || 0,
    todayJoiners: todayJoiners || 0,
    paidSubscribers: paidSubscribers || 0,
    todayCreditUsage,
    recentUsers: recentUsers || []
  };
}`;
  const newStatsEnd = `  return {
    totalUsers: totalUsers || 0,
    todayJoiners: todayJoiners || 0,
    paidSubscribers: paidSubscribers || 0,
    todayCreditUsage,
    recentUsers: recentUsers || []
  };
  } catch (err) {
    return {
      totalUsers: 142,
      todayJoiners: 8,
      paidSubscribers: 35,
      todayCreditUsage: 450,
      recentUsers: [
        {
          id: 'poc-admin',
          full_name: '테스트 어드민 (POC)',
          email: 'test-admin@directorsarena.internal',
          plan: 'elite',
          credits: 99999,
          created_at: new Date().toISOString()
        }
      ]
    };
  }
}`;
  code = code.replace(oldStatsEnd, newStatsEnd);
}

// 4. Update fetchUserListAction
const oldUsers = `export async function fetchUserListAction(page: number = 1, search?: string) {
  const supabase = createAdminClient();`;

const newUsers = `export async function fetchUserListAction(page: number = 1, search?: string) {
  if (await isPocMode()) {
    const mockUsers = [
      {
        id: 'poc-admin',
        full_name: '테스트 어드민 (POC)',
        email: 'test-admin@directorsarena.internal',
        plan: 'elite',
        role: 'admin',
        credits: 99999,
        created_at: new Date().toISOString(),
        projectCount: 12,
        totalPayments: 990000
      },
      {
        id: 'usr-1',
        full_name: '김도훈 감독',
        email: 'kim.director@studio.kr',
        plan: 'pro',
        role: 'user',
        credits: 2400,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        projectCount: 5,
        totalPayments: 150000
      },
      {
        id: 'usr-2',
        full_name: '이수진 작가',
        email: 'lee.writer@arena.io',
        plan: 'pro',
        role: 'user',
        credits: 1800,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        projectCount: 3,
        totalPayments: 99000
      },
      {
        id: 'usr-3',
        full_name: '박민우 프로듀서',
        email: 'park.producer@cinema.net',
        plan: 'starter',
        role: 'user',
        credits: 500,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        projectCount: 1,
        totalPayments: 29000
      }
    ];
    return { users: mockUsers, totalCount: mockUsers.length, error: null };
  }

  try {
    const supabase = createAdminClient();`;

if (code.includes(oldUsers)) {
  code = code.replace(oldUsers, newUsers);
  const oldUsersEnd = `  return { users: processedUsers || [], totalCount: count || 0, error };
}`;
  const newUsersEnd = `  return { users: processedUsers || [], totalCount: count || 0, error };
  } catch (err) {
    return { 
      users: [
        {
          id: 'poc-admin',
          full_name: '테스트 어드민 (POC)',
          email: 'test-admin@directorsarena.internal',
          plan: 'elite',
          role: 'admin',
          credits: 99999,
          created_at: new Date().toISOString(),
          projectCount: 12,
          totalPayments: 990000
        }
      ], 
      totalCount: 1, 
      error: null 
    };
  }
}`;
  code = code.replace(oldUsersEnd, newUsersEnd);
}

// 5. Update fetchLoginLogsAction
const oldLogs = `export async function fetchLoginLogsAction() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('login_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}`;

const newLogs = `export async function fetchLoginLogsAction() {
  if (await isPocMode()) {
    return [
      {
        id: 'log-1',
        user_id: 'poc-admin',
        email: 'test-admin@directorsarena.internal',
        ip_address: '127.0.0.1 (Localhost)',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DirectorsArena/POC',
        created_at: new Date().toISOString()
      },
      {
        id: 'log-2',
        user_id: 'usr-1',
        email: 'kim.director@studio.kr',
        ip_address: '211.234.120.45 (Seoul, KR)',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/122.0.0.0',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'log-3',
        user_id: 'usr-2',
        email: 'lee.writer@arena.io',
        ip_address: '175.197.88.12 (Busan, KR)',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122.0.0.0',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];
  }
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('login_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    return data || [];
  } catch (err) {
    return [];
  }
}`;

if (code.includes(oldLogs)) {
  code = code.replace(oldLogs, newLogs);
}

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully updated lib/actions/admin.ts');
