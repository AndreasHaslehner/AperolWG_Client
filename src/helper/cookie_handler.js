import { effect, signal } from "@preact/signals-react";

export function getCookie(key){
  const regex = new RegExp(`(?:^|;\\s*)${key}=([^;]*)`);
  const match = document.cookie.match(regex);
  return match ? match[1] : null;
}

export function setCookie(key, value, expire_date_utc_str = "Fri, 31 Dec 9999 23:59:59 GMT") {
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expire_date_utc_str}; path=/`;
}

export const token_signal = signal(decodeURIComponent(getCookie("token")))
effect(() => setCookie("token", token_signal.value))
