export const API_URL = "http://ec2-44-213-71-150.compute-1.amazonaws.com:4080";

export type WordEntry = {
  word: string;
  phonemes: string[];
};

export async function fetchWords(length?: 3 | 4 | 5): Promise<WordEntry[]> {
  const url = length ? `${API_URL}/api/words?length=${length}` : `${API_URL}/api/words`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch words (${res.status})`);
  return res.json();
}

export async function fetchAllWordLists(): Promise<Record<3 | 4 | 5, WordEntry[]>> {
  const [three, four, five] = await Promise.all([fetchWords(3), fetchWords(4), fetchWords(5)]);
  return { 3: three, 4: four, 5: five };
}
