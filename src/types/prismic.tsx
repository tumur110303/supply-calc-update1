export type Response = {
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
  version: string;
  results: Blog[];
};

export type Blog = {
  id: string;
  uid: string;
  type: "blogs";
  href: string;
  tags: string[];
  first_publication_date: string;
  last_publication_date: string;
  data: any;
  categories: {
    id: string;
    type: "category";
    tags: [];
    slug: "category";
    first_publication_date: string;
    last_publication_date: string;
    uid: string;
  };
  search_keys: "ihc major sport";
};
export type Category = {
  alternate_languages: [];
  data: {
    title: [
      {
        spans: [];
        text: string;
        type: string;
      }
    ];
  };
  first_publication_date: string;
  href: string;
  id: string;
  lang: string;
  last_publication_date: string;
  linked_documents: [];
  slugs: string[];
  tags: [];
  type: string;
  uid: null;
  url: null;
};

export type Title = {
  type:
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "heading5"
    | "heading6";
  text: string;
  spans: {
    start: number;
    end: number;
    type: string;
  }[];
}[];
