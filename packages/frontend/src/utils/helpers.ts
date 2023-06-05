
export function short_text(text: string): string {
    return `${text.slice(0, 5)}...${text.slice(-5)}`
}
  
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
}
  