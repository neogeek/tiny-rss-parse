# tiny-rss-parse

[![Test](https://github.com/neogeek/tiny-rss-parse/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/tiny-rss-parse/actions/workflows/test.workflow.yml)
[![Publish](https://github.com/neogeek/tiny-rss-parse/actions/workflows/publish.workflow.yml/badge.svg)](https://github.com/neogeek/tiny-rss-parse/actions/workflows/publish.workflow.yml)
[![NPM version](https://img.shields.io/npm/v/tiny-rss-parse)](https://www.npmjs.org/package/tiny-rss-parse)

## Install

```bash
$ npm install tiny-rss-parse --save
```

## Usage

```javascript
import { parseFeed, sortFeed, filterOlderPosts } from 'tiny-rss-parse;

// Load feed via fetch
const feed = await fetch('https://neogeek.dev/feed.xml');

// Pare feed
const parsedFeed = await parseFeed(await feed.text());

// Sort feed by date
const sortedFeed = sortFeed(parsedFeed);

// Filter posts older than (30) days
const filteredFeed = filterOlderPosts(parsedFeed, 30);
```
