# Setup

Install `pyenv` with brew [refer](https://faun.pub/how-to-install-multiple-python-on-your-mac-d20713740a2d)
```
brew install pyenv
```

Install python using `pyenv`

```
pyenv install <version>
```

set the python version using 

```
pyenv global <version>
```

To initialize a project enviroment create new projectfolder & `cd` into it

```
>> python3 -m venv venv
```

use terminal to start `venv`

```
>> source venv/bin/activate (linux)
```

download the packages 

```
>> pip install google-cloud-firestore
```

after installing all packages create `requirements.txt`

```
>> pip freeze > requirements.txt
```

if having a `requirements.txt` install dependencies using

```
>> python -m pip install -r requirements.txt
```

All the directory must have a unique uuid

#### Blog

The mandatory metadata is expected to have the following key mandatory

```json
{
    "blogNumber": "blog-number-as-int",
    "author": "author-of-blog",
    "demo": {
        "live": false,
        "preview": null,
        "repository": null
    },
    "publish": false, 
    "slug": "the-slug-of-blog",
    "summary": "description",
    "tags": [
        "tag-string"
    ],
    "title": "Blog Title",
    "previewImageSrc" : "",
    "type" : "blog|snippet"
}
```

only blog having metadata as `"publish": true` will be processed