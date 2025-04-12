export function getPageName(url: string): string {
  switch (url) {
    case "/autogestao":
      return "Autogestão";
    case "/autoconhecimento":
      return "Autoconhecimento";
    default:
      return "Zumira 3.0";
  }
}
