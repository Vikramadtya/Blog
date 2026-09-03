import { ValidationError } from "../../shared/errors.js";

export class Post {
  constructor({
    id,
    title,
    summary,
    description,
    createdAt,
    updatedAt,
    slug,
    type,
    publish,
    tags,
    previewImageSrc,
    likes,
    views,
    blogNumber,
    series,
    seriesOrder,
    demo,
    content,
  }) {
    if (!id) throw new ValidationError("Post must have an ID");
    
    this.id = id;
    this.title = title || "Untitled Post";
    this.summary = summary || description || "";
    this.description = description || summary || "";
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || this.createdAt;
    this.slug = slug || id;
    this.type = type || "blog";
    this.publish = publish ?? true;
    this.tags = Array.isArray(tags) ? tags : [];
    this.previewImageSrc = previewImageSrc || null;
    this.likes = likes || 0;
    this.views = views || 0;
    this.blogNumber = blogNumber || 0;
    this.series = series || null;
    this.seriesOrder = seriesOrder || 0;
    this.demo = {
      preview: demo?.preview || null,
      repository: demo?.repository || null,
    };
    this.content = content || "";
  }

  isPublished() {
    return this.publish === true;
  }

  isSnippet() {
    return this.type === "snippet";
  }

  isBlog() {
    return this.type === "blog";
  }

  incrementViews() {
    this.views += 1;
  }

  incrementLikes() {
    this.likes += 1;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      summary: this.summary,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      slug: this.slug,
      type: this.type,
      publish: this.publish,
      tags: this.tags,
      previewImageSrc: this.previewImageSrc,
      likes: this.likes,
      views: this.views,
      blogNumber: this.blogNumber,
      series: this.series,
      seriesOrder: this.seriesOrder,
      demo: this.demo,
      content: this.content,
    };
  }
}
