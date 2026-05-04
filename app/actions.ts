"use server";

import * as adminActions from "@/lib/actions/admin";
import * as generationActions from "@/lib/actions/generation";
import * as projectActions from "@/lib/actions/project";
import * as authActions from "@/lib/actions/auth";

// Auth Actions
export async function loginAction(formData: FormData) {
  return authActions.loginAction(formData);
}
export async function signupAction(formData: FormData) {
  return authActions.signupAction(formData);
}
export async function logoutAction() {
  return authActions.logoutAction();
}
export async function getUserSettingsAction() {
  return authActions.getUserSettingsAction();
}
export async function updateUserSettingsAction(settings: any) {
  return authActions.updateUserSettingsAction(settings);
}

// Admin Actions
export async function getAdminSettingsAction() {
  return adminActions.getAdminSettingsAction();
}
export async function updateAdminSettingsAction(settings: any) {
  return adminActions.updateAdminSettingsAction(settings);
}
export async function fetchAdminStatsAction() {
  return adminActions.fetchAdminStatsAction();
}
export async function seedSystemAssetsAction() {
  return adminActions.seedSystemAssetsAction();
}
export async function fetchAdminDashboardStats() {
  return adminActions.fetchAdminDashboardStats();
}
export async function fetchUserListAction(page: number = 1, search?: string) {
  return adminActions.fetchUserListAction(page, search);
}
export async function toggleUserStatusAction(userId: string, currentStatus: string) {
  return adminActions.toggleUserStatusAction(userId, currentStatus);
}
export async function manualCreditGrantAction(email: string, amount: number, memo: string) {
  return adminActions.manualCreditGrantAction(email, amount, memo);
}
export async function fetchLoginLogsAction() {
  return adminActions.fetchLoginLogsAction();
}
export async function fetchSystemAssetsAction(type: string = 'dummy_image') {
  return adminActions.fetchSystemAssetsAction(type);
}
export async function resetPromptsToDefaultAction() {
  return adminActions.resetPromptsToDefaultAction();
}
export async function fetchAdminSettings() {
  return adminActions.fetchAdminSettings();
}
export async function fetchGenreImagesAction() {
  return adminActions.fetchGenreImagesAction();
}
export async function updateSchemaFieldsAction(fields: Record<string, any>) {
  return adminActions.updateSchemaFieldsAction(fields);
}

// Generation Actions
export async function persistGenerationAction(projectId: string, generation: any) {
  return generationActions.persistGenerationAction(projectId, generation);
}
export async function generateEpisodeScriptAction(projectId: string, episodeId: string, episodeNumber: number) {
  return generationActions.generateEpisodeScriptAction(projectId, episodeId, episodeNumber);
}
export async function triggerRegenerateAction(projectId: string, prompt: string = "") {
  return generationActions.triggerRegenerateAction(projectId, prompt);
}
export async function updateEpisodeScriptContentAction(episodeId: string, projectId: string, newContent: string) {
  return generationActions.updateEpisodeScriptContentAction(episodeId, projectId, newContent);
}
export async function generateEpisodeSceneDraftAction(projectId: string, episodeId: string, instruction: string, currentScript: string = "") {
  return generationActions.generateEpisodeSceneDraftAction(projectId, episodeId, instruction, currentScript);
}
export async function ensureEpisodeExistsAction(projectId: string, episodeNumber: number, title?: string) {
  return generationActions.ensureEpisodeExistsAction(projectId, episodeNumber, title);
}

// Project Actions
export async function createProjectAction(formData: any) {
  return projectActions.createProjectAction(formData);
}
export async function fetchProjectsAction() {
  return projectActions.fetchProjectsAction();
}
export async function fetchProjectDetailsAction(id: string) {
  return projectActions.fetchProjectDetailsAction(id);
}
export async function updateProjectAction(id: string, updates: any) {
  return projectActions.updateProjectAction(id, updates);
}
export async function deleteProjectAction(id: string) {
  return projectActions.deleteProjectAction(id);
}
export async function purgeAllProjectsAction() {
  return projectActions.purgeAllProjectsAction();
}
export async function fetchSimilarWorksAction(projectId: string) {
  return projectActions.fetchSimilarWorksAction(projectId);
}
export async function fetchSimilarWorksPageAction(projectId: string, offset: number = 0) {
  return projectActions.fetchSimilarWorksPageAction(projectId, offset);
}
export async function updateCharacterAction(id: string, updates: any) {
  return projectActions.updateCharacterAction(id, updates);
}
