export function getPageName(url: string): string {
  switch (url) {
    case "/autogestao":
      return "Autogestão"
    case "/automonitoramento":
      return "Automonitoramento"
    default:
      return "Zumira 3.0"
  }
}
