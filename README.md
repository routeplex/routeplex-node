# @routeplex/node

> **Coming Soon** - The official Node.js SDK for [RoutePlex](https://routeplex.com), the multi-model AI gateway.

## Install

```bash
npm install @routeplex/node
# or
pnpm add @routeplex/node
# or
yarn add @routeplex/node
```

## What is RoutePlex?

RoutePlex is a unified API gateway that intelligently routes your AI requests across **OpenAI**, **Anthropic**, and **Google Gemini** — with smart routing, cost optimization, and built-in content moderation.

## Coming Soon

```typescript
import { RoutePlex } from "@routeplex/node";

const client = new RoutePlex({ apiKey: "rp_..." });

// Auto-route to the best model
const response = await client.chat("Explain quantum computing");

// Or pick a strategy
const response = await client.chat("Write a sorting algorithm", {
  strategy: "quality", // cost | balanced | quality | speed
});

console.log(response.output);
console.log(`Model: ${response.modelUsed}`);
console.log(`Cost: $${response.usage.costUsd.toFixed(6)}`);
```

## Features (Planned)

- **Unified API** - One SDK for OpenAI, Anthropic, and Gemini
- **Smart Routing** - Auto-select the best model based on your strategy
- **Cost Tracking** - Real-time cost estimation and tracking
- **Content Moderation** - Built-in 3-layer moderation pipeline
- **TypeScript First** - Full type definitions and autocompletion
- **OpenAI Compatible** - Drop-in replacement with `baseURL` swap

## Current Integration

While the SDK is being built, you can use RoutePlex today via the OpenAI SDK:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "rp_your_api_key",
  baseURL: "https://api.routeplex.com/v1",
});

const response = await client.chat.completions.create({
  model: "routeplex-ai",
  messages: [{ role: "user", content: "Hello!" }],
});
```

## Ecosystem

| Package | Platform | Description |
|---------|----------|-------------|
| [`@routeplex/node`](https://www.npmjs.com/package/@routeplex/node) | npm | Node.js / TypeScript SDK |
| [`routeplex`](https://pypi.org/project/routeplex/) | PyPI | Python SDK |

## Links

- [Website](https://routeplex.com)
- [Documentation](https://routeplex.com/docs)
- [GitHub](https://github.com/routeplex/routeplex-node)

## License

MIT
