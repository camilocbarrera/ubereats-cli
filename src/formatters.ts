export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function imageUrl(path: string): string {
  if (!path || path.startsWith("http")) return path;
  return `https://d1ralsognjng37.cloudfront.net/${path}`;
}
