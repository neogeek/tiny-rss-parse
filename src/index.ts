import * as htmlparser2 from 'htmlparser2';

import { decode } from 'html-entities';

type FalsyFilter = <T>(item: T | false | null | undefined) => item is T;

export type FeedItem = {
  title: string;
  description?: string;
  link: string;
  published: Date;
  domain: string;
  hash: string;
};

export const simpleHash = async (content: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
};

export const parseFeed = async (content: string): Promise<FeedItem[]> => {
  const feed = htmlparser2.parseFeed(content, {
    xmlMode: true
  });

  if (feed == null || feed.items == null) {
    return [];
  }

  const items = await Promise.all(
    feed.items.map(async item => {
      if (!item.link || !item.pubDate) {
        return null;
      }

      return {
        title: decode(item.title),
        description: item.description ? decode(item.description) : undefined,
        link: item.link,
        published: item.pubDate,
        domain: new URL(item.link).host,
        hash: await simpleHash(item.link)
      } as FeedItem;
    })
  );

  return items.filter(Boolean as any as FalsyFilter);
};

export const sortFeed = (items: FeedItem[]) => {
  return items
    .sort((a, b) => a.published.getTime() - b.published.getTime())
    .reverse();
};

export const filterOlderPosts = (items: FeedItem[], maxAgeInDays = 7) => {
  return items.filter(item => {
    const currentTime = new Date();

    currentTime.setDate(currentTime.getDate() - maxAgeInDays);

    return currentTime.getTime() < item.published.getTime();
  });
};
