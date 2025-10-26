import test, { describe } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import fs from 'node:fs/promises';

import { parseFeed, simpleHash, sortFeed, filterOlderPosts } from './index.js';

describe('simple hash', async () => {
  test('hash string', async () => {
    assert.equal(
      await simpleHash('test'),
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    );
  });
});

describe('parse feed', async () => {
  test('parse mock feed', async () => {
    const mockFeed = await fs.readFile(
      join(process.cwd(), 'tests/mocks/feed.xml'),
      'utf8'
    );

    const parsedFeed = await parseFeed(mockFeed);

    assert.equal(parsedFeed.length, 3);
  });
  test('parse empty feed', async () => {
    const parsedFeed = await parseFeed('');

    assert.equal(parsedFeed.length, 0);
  });
});

describe('sort feed', async () => {
  test('sort example feed', async () => {
    const mockFeed = await fs.readFile(
      join(process.cwd(), 'tests/mocks/feed.xml'),
      'utf8'
    );

    const parsedFeed = await parseFeed(mockFeed);

    const sortedFeed = sortFeed(parsedFeed);

    assert.equal(sortedFeed.length, parsedFeed.length);
  });
});

describe('filter older posts from feed', async () => {
  test('filter example feed', async context => {
    context.mock.timers.enable({ apis: ['Date'] });

    context.mock.timers.tick(1719446400000);

    const mockFeed = await fs.readFile(
      join(process.cwd(), 'tests/mocks/feed.xml'),
      'utf8'
    );

    const parsedFeed = await parseFeed(mockFeed);

    const filteredFeed = filterOlderPosts(parsedFeed, 30);

    assert.equal(filteredFeed.length, 3);
  });
});
