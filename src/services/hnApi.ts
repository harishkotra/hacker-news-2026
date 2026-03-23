import { HNItem, StoryType, HNUser } from '../types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export async function fetchStoryIds(type: StoryType): Promise<number[]> {
  const response = await fetch(`${BASE_URL}/${type}stories.json`);
  if (!response.ok) throw new Error('Failed to fetch story IDs');
  return response.json();
}

export async function fetchItem(id: number): Promise<HNItem> {
  const response = await fetch(`${BASE_URL}/item/${id}.json`);
  if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
  return response.json();
}

export async function fetchItems(ids: number[]): Promise<HNItem[]> {
  return Promise.all(ids.map(id => fetchItem(id)));
}

export async function fetchUser(id: string): Promise<HNUser> {
  const response = await fetch(`${BASE_URL}/user/${id}.json`);
  if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
  return response.json();
}

export function getDomain(url?: string): string {
  if (!url) return '';
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
}
