import json
import os
import random
import uuid

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from uuid import UUID

PATH_TO_BLOGS = "/Users/vicky/Repository/Blog-Scratch/blogs"

FIREBASE_AUTH_JSON = {
    "type": "service_account",
    "project_id": os.environ['PROJECT_ID'],
    "private_key_id": os.environ['PRIVATE_KEY_ID'],
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ8CNj99F5K/Ac\nzhp/o7elz0WX6fQ9USNBHsCPu6qvrcGu816edfggAZq6xGfXWHJZzyP8fEeP7FYH\nataBbftatEpp4sYvR6fi4owuOQL5ZlSMZFqMWM+Z+XdkcEzeJsvTK5arHon4PTjo\nHdGQoqL2A9bPz9kkTzIZCWwWWUDc0UbpcozQFiZwjYNZMVQS8t9YipnUS1zShDe/\nenzk9yWcHuhXVdFTqaUMDcMeJ657gQOIcetIwpu37e+TZznk71m7ydmP63VON7GV\n5n+7rHYlRzqC97P6cxNxPeuD/KtNtTau/ECvZkGOlJ5vWNy7uv2Qg6tbohvW1iXh\n6NU4lX49AgMBAAECggEAFe+IP6gWcWrIADYxOQJWtw0+SLcywbdBhMY2QEDbKCuN\nYJFDd056WN3iQUZ6gnTSOJSTOiBQIQ+WbpvsXlVOJNU11M0OsosK2LqhLf8lTUrN\niJnGmeJ/FTLIMp7Jqy8WihqS7G892/aNgW0UAePZSQvZIyM2sGWyJEfFdck0Epqj\nX9o0Y8MkNrlqULT/xMOKQ9j1qpyf33u9J4VbB0pHdn6lqKnIhVLHPd2rC+v+GRup\nfOiPzbbAfIIxe6R/pMN8SZvB6CUrsuDjG2zbMdEalWg09RiIUmRhv3BLuHPdaFP5\nZQdZGd3O5aLjYZmNScaHfR9IHuPsOpOp1R4g8esNbwKBgQD8gPq2OqzjHSn/5JRr\nk/YKuHf5CuOxDZP+PSqYMt+IhtpXHkEpqXbFFs3P1TA3WZWGaAONmVN2kWy9+JDB\nFbMaw3/EhiEND/qzHk5iMtTKHo5QsEGJTpgrsDDiUKBgpEN1eirq/Fq6EgAmQuY4\nc8ACn5f8p1tA/oELcb93UHOo6wKBgQDT1LyDOTZKdK8PXcsoKlTEbQ3dd9GUgtr0\nuRRvc8dBrMTeVzhdzkcrKnCjb7KAj4VVoRb1s4GXlpU2E2NJygpLUahwAxJtJw4r\niAWz9FI79ab8HhLtARG5WHYoQkb1eF+NaiTzputHqSlVFpdn8EEHylPLyxn17nSt\nK6WnM7erdwKBgDgptBouSOAnT300aXLYMUTHLSA+tNBf1cgZ8MxznFawsAXqm9HZ\neKpz3QlaQOQ+z8xafFfVf8QCqq5CiGf6HKFaVKPwtY9DO571obej2MKwMzVtTtZs\nndox0V21U0bLopmRt9QWl1OFx3S7Mpvh2xZ6SwMOcnStZySVg2HVijRLAoGALX2Q\nBjYxHIg2V/xydmuwzIYG5jqm/Vekoc1lQBIDBm2N0Zm1dx+nVPPGQLLqCIXJwnvX\nrGgiOmWSIYzEU8JZt5cPrw5Z1KsAdgS+BMlBJ7M3awkiU1dZcQ44QakKCAkTrBDR\nYqnD+R2wzJ8PYLjNnliq6ibxqkjNMasf5epLVT0CgYEAtaRq+g80JMSVH1qH/5dJ\nGD/IRWdmadPIuPpaP8aECjJyhDMMb8egM1ef0LimAgPFeYBouaOfN94/U+DTup2X\nn/b12jAcECVUOkni9lw2uLMBBC6sredAXiQojz8SoX1HsOkcIdpELtagnrTeZ+Vt\nMTpScOdnzKr++LuXS8BkQ28=\n-----END PRIVATE KEY-----\n",
    "client_email": os.environ['CLIENT_EMAIL'],
    "client_id": os.environ['CLIENT_ID'],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ['CLIENT_X509_CERT_URL'],
    "universe_domain": "googleapis.com"
}

# Use a service account.
cred = credentials.Certificate(FIREBASE_AUTH_JSON)

app = firebase_admin.initialize_app(cred)
db = firestore.client()

directoryWithBlogs = os.fsencode(PATH_TO_BLOGS)


def get_data_for_collection(collection_name, key):
    collection_reference = db.collection(collection_name)
    key_to_object_map = {}
    for collection_item in collection_reference.stream():
        key_to_object_map[collection_item.get(key)] = collection_item.to_dict()
    return key_to_object_map


# Fetch all existing tags
tag_name_to_object_map = get_data_for_collection("tags", "name")
blog_id_to_metadata_map = get_data_for_collection("blogs", "id")
user_name_to_object_map = get_data_for_collection("users", "username")


def create_new_tag(tag):
    data = {"id": str(uuid.uuid4()), "name": tag, "color": get_random_color(), "blogs": []}
    tag_name_to_object_map[tag] = add_new_tag(data)
    print("created tag {}".format(tag))
    return data


def update_exiting_tag(tag, blog_id):
    data = tag_name_to_object_map[tag]
    data["blogs"].append(blog_id)
    tag_name_to_object_map["all"]["blogs"].append(blog_id)
    return data


def get_random_color():
    colors = ["#27ae60", "#e74c3c", "#3498db"]
    return random.choice(colors)


def convert_metadata(metadata):
    resolved_tags = []
    for tag in metadata["tags"]:
        if tag not in tag_name_to_object_map:
            create_new_tag(tag)
        resolved_tags.append(update_exiting_tag(tag, metadata["id"]))

    metadata["tags"] = resolved_tags
    metadata["author"] = user_name_to_object_map[metadata["author"]]
    return metadata


def update_metadata(metadata):
    doc_ref = db.collection("blogs").document(metadata["id"])
    doc_ref.set(metadata)
    return metadata


def add_new_metadata(metadata):
    doc_ref = db.collection("blogs").document(metadata["id"])
    doc_ref.set(metadata)

    doc_ref = db.collection("metadata").document(metadata["id"])
    doc_ref.set({"id": metadata["id"], "likes": 0, "views": 0})

    return metadata


def add_new_tag(tag):
    doc_ref = db.collection("tags").document(tag["name"])
    doc_ref.set(tag)
    return tag



def is_valid_uuid(uuid_to_test, version=4):
    try:
        uuid_obj = UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test



def main():
    for directory in os.listdir(directoryWithBlogs):
        blog_dir_name = os.fsdecode(directory)

        if not is_valid_uuid(blog_dir_name): continue

        with (open(os.path.join(PATH_TO_BLOGS, blog_dir_name,  "metadata.json")) as metadataJsonFile):
            metadata = json.load(metadataJsonFile)

            if blog_dir_name in blog_id_to_metadata_map:
                if blog_id_to_metadata_map[blog_dir_name].get("updatedAt") == metadata['updatedAt']:
                    print(
                        "blog {} ({}) is upto date {}".format(metadata['title'], blog_dir_name, metadata['updatedAt']))
                    blog_id_to_metadata_map.__delitem__(blog_dir_name)

                else:
                    print("blog {} ({}) is updated".format(metadata['title'], blog_dir_name))
                    update_metadata(convert_metadata(metadata))
            else:
                print("blog {} ({}) is created".format(metadata['title'], blog_dir_name))
                add_new_metadata(convert_metadata(metadata))

    # for tagName in tag_name_to_object_map:
    #     tag = tag_name_to_object_map[tagName]
    #     tag["blogs"] = set(tag["blogs"])
    #     add_new_tag(tag)
    #
    #     print("created tag {}".format(tagName))


main()
