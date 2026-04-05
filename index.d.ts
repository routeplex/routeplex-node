/**
 * @routeplex/node - Official Node.js SDK for RoutePlex.
 */

export interface RoutePlexConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  internalReasoningTokens: number | null;
}

export interface ChatOptions {
  model?: string;
  strategy?: "cost" | "speed" | "quality" | "balanced" | "auto";
  maxOutputTokens?: number;
  temperature?: number;
  enhancePrompt?: boolean;
  testMode?: boolean;
}

export interface ChatStreamOptions extends ChatOptions {
  streamMode?: "buffered" | "realtime";
}

export interface StreamStartEvent {
  type: "start";
  raw: Record<string, any>;
}

export interface StreamDeltaEvent {
  type: "delta";
  content: string;
  raw: Record<string, any>;
}

export interface StreamDoneEvent {
  type: "done";
  modelUsed: string;
  provider: string;
  finishReason: string;
  latencyMs: number | null;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
  };
  raw: Record<string, any>;
}

export interface StreamErrorEvent {
  type: "error";
  error: string;
  raw: Record<string, any>;
}

export type StreamEvent =
  | StreamStartEvent
  | StreamDeltaEvent
  | StreamDoneEvent
  | StreamErrorEvent;

export interface ChatResponse {
  id: string;
  output: string;
  modelUsed: string;
  provider: string;
  routingMode: string;
  fallbackUsed: boolean;
  latencyMs: number | null;
  usage: Usage;
  enhancement: Record<string, any> | null;
  raw: Record<string, any>;
  toString(): string;
}

export interface EstimateOptions {
  model?: string;
  maxOutputTokens?: number;
}

export interface EstimateResponse {
  model: string;
  inputTokens: number;
  maxOutputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  confidence: string;
  pricing: Record<string, number>;
  raw: Record<string, any>;
}

export interface EnhanceResponse {
  enhancedPrompt: string;
  changed: boolean;
  queryType: string;
  detectedLanguage: string | null;
  originalPrompt: string;
  raw: Record<string, any>;
}

export interface ModelPricing {
  inputPer1k: number;
  outputPer1k: number;
}

export interface ModelCapabilities {
  streaming: boolean;
  functions: boolean;
  vision: boolean;
}

export interface Model {
  id: string;
  displayName: string;
  provider: string;
  tier: string;
  contextWindow: number;
  maxOutputTokens: number;
  health: string;
  pricing: ModelPricing;
  capabilities: ModelCapabilities;
  aliases: string[];
  deprecated: boolean;
  deprecationDate: string | null;
  raw: Record<string, any>;
}

export declare class RoutePlexError extends Error {
  code: string;
  status: number;
  details: any;
}

export declare class AuthenticationError extends RoutePlexError {}
export declare class RateLimitError extends RoutePlexError {}
export declare class ValidationError extends RoutePlexError {}
export declare class ProviderError extends RoutePlexError {}
export declare class ContentPolicyError extends RoutePlexError {}

export declare class RoutePlex {
  constructor(config: RoutePlexConfig);

  chat(
    messages: string | Message[],
    options?: ChatOptions
  ): Promise<ChatResponse>;

  chatStream(
    messages: string | Message[],
    options?: ChatStreamOptions
  ): AsyncGenerator<StreamEvent, void, unknown>;

  estimate(
    messages: string | Message[],
    options?: EstimateOptions
  ): Promise<EstimateResponse>;

  enhance(prompt: string): Promise<EnhanceResponse>;

  listModels(): Promise<Model[]>;
}

export default RoutePlex;
