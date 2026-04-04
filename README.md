# @routeplex/node

[![npm](https://img.shields.io/npm/v/@routeplex/node?label=npm&color=red)](https://www.npmjs.com/package/@routeplex/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://github.com/routeplex/routeplex-node/blob/main/LICENSE)
[![Node 18+](https://img.shields.io/badge/Node.js-18+-339933)](https://www.npmjs.com/package/@routeplex/node)

The official Node.js SDK for [RoutePlex](https://routeplex.com?utm_source=github&utm_medium=readme&utm_campaign=node-sdk), the multi-model AI gateway. Route requests across OpenAI, Anthropic, and Google through a single API.

## Install

```bash
npm install @routeplex/node
# or
pnpm add @routeplex/node
# or
yarn add @routeplex/node
```

## Quick Start

```typescript
import { RoutePlex } from "@routeplex/node";

const client = new RoutePlex({ apiKey: "rp_live_YOUR_KEY" });

// Auto-routing — analyzes your prompt, picks the best model
const response = await client.chat("Explain quantum computing");
console.log(response.output);
console.log(`Model: ${response.modelUsed}`);
console.log(`Cost: $${response.usage.costUsd.toFixed(6)}`);

// Or override with a strategy
const res = await client.chat("Write a sorting algorithm", { strategy: "quality" });
```

## Features

- **One-liner chat** — pass a string, get a response
- **Streaming** — real-time SSE with `chatStream()` in buffered (~100ms) or realtime (~10ms) mode
- **Prompt-based auto-routing** — RoutePlex analyzes your prompt and picks the best model automatically
- **Strategy routing** — override with `strategy` (`cost`, `speed`, `quality`, `balanced`, `auto`)
- **Manual mode** — pick a specific model with `model`
- **Prompt enhancement** — auto-improve prompts before sending to the model
- **Test mode** — safe development and CI testing with default-tier models only
- **Cost estimation** — estimate costs before sending (free, no API key needed)
- **Model catalog** — list all 30+ models with pricing, capabilities, and health status
- **Full TypeScript types** — complete `.d.ts` included
- **Typed errors** — `AuthenticationError`, `RateLimitError`, `ValidationError`, `ProviderError`, `ContentPolicyError`
- **Zero dependencies** — uses only `fetch` (Node 18+)

## Routing Modes

RoutePlex supports three ways to route your requests:

### 1. Auto-routing (default) — analyzes your prompt

When you don't specify a model or strategy, RoutePlex **analyzes your prompt** to determine the best model. A simple question gets a fast, cheap model. A complex reasoning task gets a capable one.

```typescript
// RoutePlex reads your prompt and picks the optimal model
const res = await client.chat("What is JavaScript?");           // → fast, cheap model
const res2 = await client.chat("Prove the Riemann hypothesis"); // → powerful model
```

### 2. Strategy routing — you choose the priority

When you specify a strategy, RoutePlex picks the best model for that priority — regardless of prompt content.

```typescript
const fast = await client.chat("Write a haiku", { strategy: "speed" });      // fastest
const smart = await client.chat("Analyze this data", { strategy: "quality" }); // most capable
const cheap = await client.chat("Summarize this", { strategy: "cost" });      // cheapest
const balanced = await client.chat("General task", { strategy: "balanced" }); // tradeoff
```

### 3. Manual mode — you pick the model

```typescript
const res = await client.chat("Explain recursion", {
  model: "gpt-4o-mini",
  maxOutputTokens: 1024,
  temperature: 0.5,
});
```

## Prompt Enhancement

Auto-improve your prompt before it reaches the model. Stateless, free, adds no latency overhead.

```typescript
// Per-request enhancement
const response = await client.chat("fix my code", { enhancePrompt: true });

// Standalone — preview the enhanced prompt (free, no API key)
const result = await client.enhance("tell me about kubernetes");
if (result.changed) {
  console.log(`Enhanced: ${result.enhancedPrompt}`);
}
```

## Test Mode

Use `testMode` during development and CI to keep routing on default-tier models only — no premium charges, predictable costs.

```typescript
// Safe for CI pipelines — will never route to premium models
const response = await client.chat("Write a unit test", { testMode: true });
```

> `testMode` only affects auto-routing. In manual mode you pick the model explicitly, so it has no effect.

## Streaming

Stream responses in real time using `chatStream()`. Supports two modes: `"buffered"` (default, ~100ms chunks for smooth output) and `"realtime"` (~10ms chunks for minimal latency).

```typescript
// Buffered streaming (default)
for await (const event of client.chatStream("Explain how streaming works")) {
  if (event.type === "delta") {
    process.stdout.write(event.content);
  } else if (event.type === "done") {
    console.log(`\nModel: ${event.modelUsed} | Cost: $${event.usage.costUsd.toFixed(6)}`);
  }
}

// Realtime streaming — lowest latency
for await (const event of client.chatStream("Quick answer", { streamMode: "realtime" })) {
  if (event.type === "delta") {
    process.stdout.write(event.content);
  }
}
```

Events: `delta` (content chunk), `done` (final stats), `error` (failure).

## More Examples

### Multi-turn conversations

```typescript
const res = await client.chat([
  { role: "system", content: "You are a helpful tutor." },
  { role: "user", content: "What is recursion?" },
  { role: "assistant", content: "Recursion is when a function calls itself..." },
  { role: "user", content: "Can you give me a JS example?" },
]);
```

### Cost estimation (free)

```typescript
const estimate = await client.estimate("Write a blog post about AI");
console.log(`Model: ${estimate.model}`);
console.log(`Cost: $${estimate.estimatedCostUsd.toFixed(6)}`);
```

### List models

```typescript
const models = await client.listModels();
models.forEach((m) => console.log(`${m.id} (${m.provider}) — ${m.tier}`));
```

### Error handling

```typescript
import { RoutePlex, RateLimitError, AuthenticationError } from "@routeplex/node";

try {
  const res = await client.chat("Hello!");
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.log("Invalid API key");
  } else if (err instanceof RateLimitError) {
    console.log(`Rate limited: ${err.message}`);
  }
}
```

## Also Works with OpenAI SDK

You can also use RoutePlex with the OpenAI SDK — just change the `baseURL`:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "rp_live_YOUR_KEY",
  baseURL: "https://api.routeplex.com/v1",
});

const response = await client.chat.completions.create({
  model: "routeplex-ai",
  messages: [{ role: "user", content: "Hello!" }],
});
```

## Ecosystem

| Package | Platform | Install |
|---------|----------|---------|
| [`@routeplex/node`](https://www.npmjs.com/package/@routeplex/node) | npm | `npm install @routeplex/node` |
| [`routeplex`](https://pypi.org/project/routeplex/) | PyPI | `pip install routeplex` |

## Links

- [Website](https://routeplex.com?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [Documentation](https://routeplex.com/docs?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [API Reference](https://routeplex.com/api-reference?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [Playground](https://routeplex.com/playground?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [Pricing](https://routeplex.com/pricing?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [Changelog](https://routeplex.com/changelog?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [Blog](https://routeplex.com/blog?utm_source=github&utm_medium=readme&utm_campaign=node-sdk)
- [Python SDK (GitHub)](https://github.com/routeplex/routeplex-python)
- [Examples](https://github.com/routeplex/routeplex-examples)

## License

MIT — see [LICENSE](https://github.com/routeplex/routeplex-node/blob/main/LICENSE)
