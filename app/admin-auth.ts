import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "./chatgpt-auth";

function allowedEmail() {
  return (
    (env as unknown as { ADMIN_EMAIL?: string }).ADMIN_EMAIL ??
    process.env.ADMIN_EMAIL ??
    ""
  ).trim().toLowerCase();
}

function allowed(user: ChatGPTUser | null) {
  return Boolean(user && allowedEmail() && user.email.toLowerCase() === allowedEmail());
}

async function isLocalRequest() {
  const host = (await headers()).get("host") ?? "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

export async function requireAdmin() {
  const currentUser = await getChatGPTUser();
  if (allowed(currentUser)) return currentUser as ChatGPTUser;
  if (await isLocalRequest()) {
    return { email: "local-admin", displayName: "Local administrator", fullName: null };
  }
  const user = await requireChatGPTUser("/admin");
  if (!allowed(user)) notFound();
  return user;
}

export async function isAdmin() {
  return allowed(await getChatGPTUser()) || await isLocalRequest();
}
