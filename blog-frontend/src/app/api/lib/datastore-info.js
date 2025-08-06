import {
  convertAuthorData,
  convertBlogData,
  convertTagData,
} from "./converter";

const datastore = {
  blog: {
    name: "blogs-metadata",
    type: "blog",
    converter: convertBlogData,
  },
  tag: {
    name: "tagsInfo",
    type: "tag",
    converter: convertTagData,
  },
  author: {
    name: "authors",
    type: "author",
    converter: convertAuthorData,
  },
  subscription: {
    name: "subscriptions",
    type: "subscription",
  },
};

export default datastore;
