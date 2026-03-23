# @routeplex/node

The official Node.js SDK for [RoutePlex](https://routeplex.com), the multi-model AI gateway.

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

const client = new RoutePlex({ apiKey: "rp_your_api_key" });

// Simple — one-liner
const response = await client.chat("Explain quantum computing");
console.log(response.output);

// With strategy
const res = await client.chat("Write a sorting algorithm", {
  strategy: "quality", // cost | balanced | quality | speed
});
console.log(`Model: ${res.modelUsed}`);
console.log(`Cost: $${res.usage.costUsd.toFixed(6)}`);
```

## Features

- **One-liner chat** — pass a string, get a response
- **Smart routing** — auto-select the best model with `strategy`
- **Manual mode** — pick a specific model with `model`
- **Cost estimation** — free, no API key needed
- **Prompt enhancement** — improve prompts before sending
- **Full TypeScript types** — complete `.d.ts` included
- **Typed errors** — `AuthenticationError`, `RateLimitError`, etc.
- **Zero dependencies** — uses only `fetch` (Node 18+)

## Usage

### Auto-routing (RoutePlex AI)

```typescript
// Let RoutePlex pick the best model
const res = await client.chat("What is JavaScript?");

// Or specify a strategy
const fast = await client.chat("Write a haiku", { strategy: "speed" });
const smart = await client.chat("Analyze this data", { strategy: "quality" });
const cheap = await client.chat("Summarize this", { strategy: "cost" });
```

### Manual model selection

```typescript
const res = await client.chat("Explain recursion", {
  model: "gpt-4o-mini",
  maxOutputTokens: 1024,
  temperature: 0.5,
});
```

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
console.log(`Confidence: ${estimate.confidence}`);
```

### Prompt enhancement (free)

```typescript
const result = await client.enhance("tell me about kubernetes");
if (result.changed) {
  console.log(`Enhanced: ${result.enhancedPrompt}`);
  console.log(`Type: ${result.queryType}`);
}
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

## OpenAI SDK Compatible

You can also use RoutePlex with the OpenAI SDK — just change the `baseURL`:

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
| [`@routeplex/node`](https://www.npmjs.com/package/@routeplex/node) | npm | Node.js SDK |
| [`routeplex`](https://pypi.org/project/routeplex/) | PyPI | Python SDK |

## Links

- [Website](https://routeplex.com)
- [Documentation](https://routeplex.com/docs)
- [API Playground](https://routeplex.com/docs/api-reference/playground)

## License

MIT
