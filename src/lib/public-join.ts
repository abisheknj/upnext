import { headers } from "next/headers";

const PUBLIC_JOIN_ID_PATTERN = /^bt_[A-Z2-9]{6}$/;

export function isPublicJoinId(value: string): boolean {
  return PUBLIC_JOIN_ID_PATTERN.test(value);
}

export function publicJoinPath(publicJoinId: string): string {
  return `/join/${publicJoinId}`;
}

export async function getRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${proto}://${host}`;
}

export async function getPublicJoinUrl(publicJoinId: string): Promise<string> {
  return new URL(
    publicJoinPath(publicJoinId),
    await getRequestOrigin(),
  ).toString();
}

export function getQrImageUrl(data: string, size = 320): string {
  const params = new URLSearchParams({
    data,
    size: `${size}x${size}`,
    margin: "12",
    format: "svg",
  });

  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}
