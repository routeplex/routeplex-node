/**
 * @routeplex/node - Coming Soon.
 *
 * The official Node.js SDK for RoutePlex,
 * the multi-model AI gateway.
 *
 * While the SDK is in development, you can use RoutePlex
 * today via the OpenAI SDK:
 *
 * ```typescript
 * import OpenAI from "openai";
 *
 * const client = new OpenAI({
 *   apiKey: "rp_your_api_key",
 *   baseURL: "https://api.routeplex.com/v1",
 * });
 * ```
 *
 * Learn more at https://routeplex.com
 */

class RoutePlex {
  constructor() {
    throw new Error(
      "The @routeplex/node SDK is coming soon.\n\n" +
      "In the meantime, you can use the OpenAI SDK with RoutePlex:\n\n" +
      '  import OpenAI from "openai";\n' +
      '  const client = new OpenAI({ apiKey: "rp_...", baseURL: "https://api.routeplex.com/v1" });\n\n' +
      "Learn more: https://routeplex.com/docs"
    );
  }
}

module.exports = { RoutePlex };
module.exports.default = RoutePlex;
