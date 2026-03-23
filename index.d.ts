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

export interface Model {
  id: string;
  displayName: string;
  provider: string;
  tier: string;
  contextWindow: number;
  maxOutput: number;
  status: string;
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

  estimate(
    messages: string | Message[],
    options?: EstimateOptions
  ): Promise<EstimateResponse>;

  enhance(prompt: string): Promise<EnhanceResponse>;

  listModels(): Promise<Model[]>;
}

export default RoutePlex;
