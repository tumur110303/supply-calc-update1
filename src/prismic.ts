import { PrismicClient } from "../prismic-config";
import Prismic from "@prismicio/client";

// Order by last publication date from most recent to oldest
const articlesOrderings = "[document.id desc]";

export const fetchBlog = async (uid: string) => {
  return await PrismicClient.getByUID("content", uid, {});
};

export const fetchBlogs = async () => {
  const articles = await PrismicClient.query(
    Prismic.Predicates.at("document.type", "content"),
    { orderings: articlesOrderings }
  );
  return articles.results;
};

export const fetchCategories = async () => {
  const articles = await PrismicClient.query(
    Prismic.Predicates.at("document.type", "category")
  );
  return articles.results;
};
export const fetchBlogsByCategory = async (
  categoryId: string,
  limit: number | null
) => {
  return (
    await PrismicClient.query(
      [
        Prismic.Predicates.at("document.type", "content"),
        Prismic.Predicates.at("my.content.category", categoryId),
      ],
      limit
        ? {
            orderings: articlesOrderings,
            pageSize: limit,
          }
        : {
            orderings: articlesOrderings,
          }
    )
  ).results;
};

export const search = async (value: string) => {
  return (
    await PrismicClient.query([Prismic.Predicates.fulltext("document", value)])
  ).results;
};

export const similar = async (value: string) => {
  return PrismicClient.query([Prismic.Predicates.similar(value, 15)]);
};
