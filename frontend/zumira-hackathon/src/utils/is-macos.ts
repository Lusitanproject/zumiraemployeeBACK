export function isMacOS(): boolean {
  const nav = navigator as any; // userAgentData é experimental
  if (nav.userAgentData?.platform) {
    return /^mac/i.test(nav.userAgentData.platform);
  }
  // fallback: checa se userAgent contém “Mac”
  return /\bMac\b/i.test(navigator.userAgent);
}
