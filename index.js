/**
 * @routeplex/node - Official Node.js SDK for RoutePlex.
 *
 * Multi-model AI gateway. Route requests across OpenAI, Anthropic,
 * and Google Gemini through a unified API.
 *
 * Usage:
 *   const { RoutePlex } = require("@routeplex/node");
 *   const client = new RoutePlex({ apiKey: "rp_live_YOUR_KEY" });
 *   const res = await client.chat("What is JavaScript?");
 *   console.log(res.output);
 */

const DEFAULT_BASE_URL = "https://api.routeplex.com";
const DEFAULT_TIMEOUT = 120000; // ms
const VERSION = "0.1.0";

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

class RoutePlexError extends Error {
  constructor(message, code = "unknown", status = 0, details = null) {
    super(message);
    this.name = "RoutePlexError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

class AuthenticationError extends RoutePlexError {
  constructor(message, code, status, details) {
    super(message, code, status, details);
    this.name = "AuthenticationError";
  }
}

class RateLimitError extends RoutePlexError {
  constructor(message, code, status, details) {
    super(message, code, status, details);
    this.name = "RateLimitError";
  }
}

class ValidationError extends RoutePlexError {
  constructor(message, code, status, details) {
    super(message, code, status, details);
    this.name = "ValidationError";
  }
}

class ProviderError extends RoutePlexError {
  constructor(message, code, status, details) {
    super(message, code, status, details);
    this.name = "ProviderError";
  }
}

class ContentPolicyError extends RoutePlexError {
  constructor(message, code, status, details) {
    super(message, code, status, details);
    this.name = "ContentPolicyError";
  }
}

const ERROR_MAP = {
  unauthenticated: AuthenticationError,
  invalid_api_key: AuthenticationError,
  expired_api_key: AuthenticationError,
  rate_limited: RateLimitError,
  daily_limit_exceeded: RateLimitError,
  daily_cost_limit_exceeded: RateLimitError,
  quota_exceeded: RateLimitError,
  validation_error: ValidationError,
  invalid_model: ValidationError,
  invalid_mode: ValidationError,
  empty_messages: ValidationError,
  bad_request: ValidationError,
  content_policy_violation: ContentPolicyError,
  content_moderation_flagged: ContentPolicyError,
  blocked_url: ContentPolicyError,
  provider_error: ProviderError,
  provider_timeout: ProviderError,
  provider_unavailable: ProviderError,
  all_providers_failed: ProviderError,
};

function raiseForError(status, body) {
  const err = body.error || {};
  const code = err.code || "unknown";
  const message = err.message || "Unknown error";
  const details = err.details || null;
  const ErrClass = ERROR_MAP[code] || RoutePlexError;
  throw new ErrClass(message, code, status, details);
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

class RoutePlex {
  /**
   * Create a RoutePlex client.
   * @param {Object} config
   * @param {string} config.apiKey - Your RoutePlex API key.
   * @param {string} [config.baseUrl] - API base URL.
   * @param {number} [config.timeout] - Request timeout in ms.
   */
  constructor({ apiKey, baseUrl, timeout } = {}) {
    if (!apiKey) throw new Error("apiKey is required");
    this._apiKey = apiKey;
    this._baseUrl = (baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
    this._timeout = timeout || DEFAULT_TIMEOUT;
  }

  /**
   * Create a chat completion.
   * @param {string|Array} messages - A string (single user message) or array of {role, content} objects.
   * @param {Object} [options]
   * @param {string} [options.model] - Specific model (enables manual mode).
   * @param {string} [options.strategy] - Routing strategy: "cost", "speed", "quality", "balanced", "auto".
   * @param {number} [options.maxOutputTokens=512] - Max output tokens (1-4096).
   * @param {number} [options.temperature] - Sampling temperature (0-2).
   * @param {boolean} [options.enhancePrompt=false] - Auto-enhance the prompt.
   * @param {boolean} [options.testMode=false] - Force default (non-premium) models only.
   * @returns {Promise<Object>} ChatResponse with .output, .usage, etc.
   */
  async chat(messages, options = {}) {
    const msgs = this._normalizeMessages(messages);
    const {
      model,
      strategy,
      maxOutputTokens = 512,
      temperature,
      enhancePrompt = false,
      testMode = false,
    } = options;

    const body = {
      messages: msgs,
      max_output_tokens: maxOutputTokens,
      enhance_prompt: enhancePrompt,
      test_mode: testMode,
    };

    if (model) {
      body.mode = "manual";
      body.model = model;
    } else {
      body.mode = "routeplex-ai";
      if (strategy) body.strategy = strategy;
    }

    if (temperature !== undefined) body.temperature = temperature;

    const data = await this._post("/api/v1/chat", body, true);
    const d = data.data || {};
    const u = d.usage || {};

    return {
      id: d.id || "",
      output: d.output || "",
      modelUsed: d.model_used || "",
      provider: d.provider || "",
      routingMode: d.routing_mode || "",
      fallbackUsed: d.fallback_used || false,
      latencyMs: d.latency_ms || null,
      usage: {
        inputTokens: u.input_tokens || 0,
        outputTokens: u.output_tokens || 0,
        totalTokens: u.total_tokens || 0,
        costUsd: u.cost_usd || 0,
        internalReasoningTokens: u.internal_reasoning_tokens || null,
      },
      enhancement: d.enhancement || null,
      raw: data,
      toString() {
        return this.output;
      },
    };
  }

  /**
   * Estimate the cost of a chat request (free, no auth needed).
   * @param {string|Array} messages
   * @param {Object} [options]
   * @param {string} [options.model]
   * @param {number} [options.maxOutputTokens=512]
   * @returns {Promise<Object>}
   */
  async estimate(messages, options = {}) {
    const msgs = this._normalizeMessages(messages);
    const { model, maxOutputTokens = 512 } = options;

    const body = { messages: msgs, max_output_tokens: maxOutputTokens };
    if (model) body.model = model;

    const data = await this._post("/api/v1/chat/estimate", body, false);
    const d = data.data || {};

    return {
      model: d.model || "",
      inputTokens: d.input_tokens || 0,
      maxOutputTokens: d.max_output_tokens || 0,
      totalTokens: d.total_tokens || 0,
      estimatedCostUsd: d.estimated_cost_usd || 0,
      confidence: d.confidence || "",
      pricing: d.pricing || {},
      raw: data,
    };
  }

  /**
   * Enhance a prompt (free, no auth needed).
   * @param {string} prompt
   * @returns {Promise<Object>}
   */
  async enhance(prompt) {
    const data = await this._post("/api/v1/chat/enhance", { prompt }, false);
    const d = data.data || {};

    return {
      enhancedPrompt: d.enhanced_prompt || prompt,
      changed: d.changed || false,
      queryType: d.query_type || "",
      detectedLanguage: d.detected_language || null,
      originalPrompt: d.original_prompt || prompt,
      raw: data,
    };
  }

  /**
   * List available models (free, no auth needed).
   * @returns {Promise<Array>}
   */
  async listModels() {
    const data = await this._get("/api/v1/models");
    return (data.data || []).map((m) => ({
      id: m.id || "",
      displayName: m.display_name || m.id || "",
      provider: m.provider || "",
      tier: m.tier || "default",
      contextWindow: m.context_window || 0,
      maxOutput: m.max_output || 0,
      status: m.status || "available",
      raw: m,
    }));
  }

  // -----------------------------------------------------------------------
  // Internal
  // -----------------------------------------------------------------------

  _normalizeMessages(messages) {
    if (typeof messages === "string") {
      return [{ role: "user", content: messages }];
    }
    if (!Array.isArray(messages)) {
      throw new TypeError("messages must be a string or array");
    }
    return messages.map((m) => {
      if (typeof m === "object" && m.role && m.content !== undefined) {
        return { role: m.role, content: m.content };
      }
      throw new TypeError("Each message must have role and content");
    });
  }

  _headers(auth) {
    const h = {
      "Content-Type": "application/json",
      "User-Agent": `routeplex-node/${VERSION}`,
    };
    if (auth) h["Authorization"] = `Bearer ${this._apiKey}`;
    return h;
  }

  async _post(path, body, auth) {
    return this._fetch(path, {
      method: "POST",
      headers: this._headers(auth),
      body: JSON.stringify(body),
    });
  }

  async _get(path, auth = false) {
    return this._fetch(path, {
      method: "GET",
      headers: this._headers(auth),
    });
  }

  async _fetch(path, options) {
    const url = `${this._baseUrl}${path}`;

    // Use AbortController for timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this._timeout);
    options.signal = controller.signal;

    let resp;
    try {
      resp = await fetch(url, options);
    } catch (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        throw new RoutePlexError("Request timed out", "timeout", 0);
      }
      throw new RoutePlexError(
        `Connection failed: ${err.message}`,
        "connection_error",
        0
      );
    }
    clearTimeout(timer);

    let data;
    try {
      data = await resp.json();
    } catch {
      throw new RoutePlexError(
        `Invalid JSON response (HTTP ${resp.status})`,
        "parse_error",
        resp.status
      );
    }

    if (!resp.ok && data.success === false && data.error) {
      raiseForError(resp.status, data);
    }

    if (!resp.ok) {
      throw new RoutePlexError(
        `HTTP ${resp.status}: ${resp.statusText}`,
        "http_error",
        resp.status
      );
    }

    return data;
  }
}

module.exports = {
  RoutePlex,
  RoutePlexError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  ProviderError,
  ContentPolicyError,
};
module.exports.default = RoutePlex;
