import { Request, Obj } from "itty-router";

export interface Entity extends Object {
  id: string;
  name: string;
  category: string;
  logo_s: string;
  region: string;
  subregion: string;
  country: string | null;
  institution_types: Array<string> | null;
  acronyms: Array<string>;
  stats: PublicationStats;
}

export interface PublicationStats extends Object {
  n_outputs: number;
  n_outputs_open: number;
  p_outputs_open: number;
  p_outputs_publisher_open_only: number;
  p_outputs_both: number;
  p_outputs_other_platform_open_only: number;
  p_outputs_closed: number;
}

export type PageSettings = {
  page: number;
  limit: number;
  orderBy: string;
  orderDir: string;
};

export type Query = {
  countries: Set<string>;
  subregions: Set<string>;
  regions: Set<string>;
  institutionTypes: Set<string>;
  minNOutputs: number;
  maxNOutputs: number;
  minNOutputsOpen: number;
  maxNOutputsOpen: number;
  minPOutputsOpen: number;
  maxPOutputsOpen: number;
};

type MethodType = "GET";

export interface SearchRequest extends Request {
  method: MethodType;
  url: string;
  params: {
    text: string;
  };
  query: {
    limit: string;
  };
}

export interface FilterRequest extends Omit<Request, "query"> {
  method: MethodType;
  url: string;
  params: Obj;
  query: FilterQuery;
}

export interface FilterQuery {
  page?: string;
  limit?: string;
  orderBy?: string;
  orderDir?: string;
  countries?: string;
  subregions?: string;
  regions?: string;
  institutionTypes?: string;
  minNOutputs?: string;
  maxNOutputs?: string;
  minNOutputsOpen?: string;
  maxNOutputsOpen?: string;
  minPOutputsOpen?: string;
  maxPOutputsOpen?: string;
}
