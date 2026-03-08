/**
 * @routeplex/node - Coming Soon.
 *
 * The official Node.js SDK for RoutePlex, the multi-model AI gateway.
 * Learn more at https://routeplex.com
 */

export interface RoutePlexConfig {
  apiKey: string;
  baseUrl?: string;
}

export declare class RoutePlex {
  constructor(config: RoutePlexConfig);
}

export default RoutePlex;
