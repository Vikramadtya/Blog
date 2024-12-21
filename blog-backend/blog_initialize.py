import json
import os
import uuid
import logging

PATH_TO_BLOGS = "/Users/vicky/Repository/Blog-Scratch/blogs"
METADATA_FILE_NAME = "metadata.json"


def main():
    blog_id = uuid.uuid4()


    blogs_data_path = os.path.join(PATH_TO_BLOGS, METADATA_FILE_NAME)

    # read the blogs metadata file
    blogs_data = read_blogs_metadata(blogs_data_path)

    # get the new blog input
    logging.info("creating new blog with id {}".format(blog_id))
    title = input("blog title : ")
    author = input("blog author : ")
    summary = input("blog summary : ")
    slug = input("blog slug : ")
    type = input("blog/snippet : ")

    if type != "blog" and type != "snippet":
        print("value must be 'blog' or 'snippet'");
        return

    # create the directory
    os.makedirs(os.path.join(PATH_TO_BLOGS, str(blog_id)))

    # creat the blog file
    create_new_blog_markdown_file(blog_id)

    # creat the metadata file
    metadata = create_new_blog_metadata(author, blog_id, blogs_data, slug, summary, title, type)

    # update the blogs data
    update_blogs_metadata(blog_id, blogs_data_path, metadata)


def create_new_blog_markdown_file(blog_id):
    open(os.path.join(PATH_TO_BLOGS, str(blog_id), "blog.md"), 'w')


def create_new_blog_metadata(author, blog_id, blogs_data, slug, summary, title, type):
    metadata = {"id": str(blog_id), "publish": False, "blogNumber": blogs_data["nextBlogNumber"], "title": title,
                "tags": [], "previewImageSrc": "",
                "author": author, "summary": summary, "slug": slug, "type" : type, "demo": {"live": False,
                                                                             "preview": None,
                                                                             "repository": None}}
    processed_metadata_file_path = os.path.join(PATH_TO_BLOGS, str(blog_id), "metadata.json")
    print("customize the {}".format(processed_metadata_file_path))
    json.dump(metadata, open(processed_metadata_file_path, "w"), ensure_ascii=False, indent=4, sort_keys=True)
    return metadata


def update_blogs_metadata(blog_id, blogs_data_path, metadata):
    with (open(blogs_data_path, "w") as blogs_data_file):
        blogs_data = json.load(blogs_data_file)
        blogs_data["blogs"].append(str(blog_id))
        blogs_data["nextBlogNumber"] = blogs_data["nextBlogNumber"] + 1
        json.dump(metadata, blogs_data_file, ensure_ascii=False, indent=4, sort_keys=True)

def read_blogs_metadata(blogs_data_path):
    blogs_data_file = open(blogs_data_path, "r")
    blogs_data = json.load(blogs_data_file)
    return blogs_data


main()
