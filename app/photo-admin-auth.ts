import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import {
  getChatGPTUser,
  requireChatGPTUser,
  type ChatGPTUser,
} from "./chatgpt-auth";

function configuredAdminEmail() {
  const runtimeEmail = (env as unknown as { ADMIN_EMAIL?: string }).ADMIN_EMAIL;
  return (runtimeEmail ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

function isAllowed(user: ChatGPTUser | null) {
  const adminEmail = configuredAdminEmail();
  return Boolean(user && adminEmail && user.email.toLowerCase() === adminEmail);
}

export async function requirePhotoAdmin(): Promise<ChatGPTUser> {
  const user = await requireChatGPTUser("/admin/photos");
  if (!isAllowed(user)) notFound();
  return user;
}

export async function isPhotoAdmin() {
  return isAllowed(await getChatGPTUser());
}
