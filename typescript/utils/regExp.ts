// 文字列を、正規表現の中でそのままの文字として扱えるようにする（商品名に「.」や「(」が入るため）
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 文字列の全体と一致する正規表現を作る（名前の一部が同じ、別のものを選ばないようにする）
export function exactText(text: string): RegExp {
  return new RegExp(`^${escapeRegExp(text)}$`);
}
