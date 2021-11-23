export type Entity = {
    id: string;
    name: string;
    description: string;
    category: string;
    logo: string;
    url: string;
    wikipedia_url: string;
    region: string;
    subregion: string;
    country: string;
    institution_types: Array<string>;
    stats: PublicationStats;
    identifiers: Array<Identifier>
    collaborators: Array<Collaborator>;
    subjects: Array<Subject>;
    other_platform_locations: Array<string>;
    timeseries: Array<Year>;
};

export type PublicationStats = {
    n_citations: number;
    n_outputs: number;
    n_outputs_open: number;
    n_outputs_publisher_open: number;
    n_outputs_publisher_open_only: number;
    n_outputs_other_platform_open: number;
    n_outputs_other_platform_open_only: number;
    n_outputs_gold: number;
    n_outputs_hybrid: number;
    n_outputs_bronze: number;
    p_outputs_open: number;
    p_outputs_publisher_open: number;
    p_outputs_publisher_open_only: number;
    p_outputs_other_platform_open: number;
    p_outputs_other_platform_open_only: number;
    p_outputs_gold: number;
    p_outputs_hybrid: number;
    p_outputs_bronze: number;
}

export type Subject = {
    name: string;
    n_outputs: number;
}

export type Collaborator = {
    name: string;
    n_outputs: number;
}

export type Identifier = {
    id: string;
    type: string;
}

export type Year = {
    year: number;
    date: string;
    stats: PublicationStats;
}
