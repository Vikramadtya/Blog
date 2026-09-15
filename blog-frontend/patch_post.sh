sed -i '' -e '/isPublished()/i\
  get permalink() {\
    return this.series ? `${this.series}/${this.slug}` : this.slug;\
  }\
' src/core/blog/domain/Post.js
sed -i '' -e 's/slug: this.slug,/slug: this.slug,\n      permalink: this.permalink,/' src/core/blog/domain/Post.js
