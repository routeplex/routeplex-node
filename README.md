# RoutePlex

> This is a convenience package. The official SDK lives at [`@routeplex/sdk`](https://www.npmjs.com/package/@routeplex/sdk).

## Install

```bash
# Recommended — use the scoped package:
npm install @routeplex/sdk

# Or this convenience alias:
npm install routeplex
```

## What is RoutePlex?

RoutePlex is a unified API gateway that intelligently routes your AI requests across **OpenAI**, **Anthropic**, and **Google Gemini** — with smart routing, cost optimization, and built-in content moderation.

## Coming Soon

```typescript
import { RoutePlex } from "@routeplex/sdk";

const client = new RoutePlex({ apiKey: "rp_..." });

const response = await client.chat("Explain quantum computing", {
  strategy: "quality", // cost | balanced | quality | speed
});
```

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

## Links

- [Website](https://routeplex.com)
- [Documentation](https://routeplex.com/docs)
- [GitHub](https://github.com/routeplex/routeplex-node)
- [Python SDK](https://pypi.org/project/routeplex/)

## License

MIT
