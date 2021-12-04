import json
import sentry_sdk
import sys
import os

config_values = {}
config_values["local"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "*",
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",  # empty
    "sentry": {
        "debug": True,
        "environment": "development"
    },
    "port": 3000
}

config_values["staging"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "http://test.cuberoom.net",
    # please check this in the deployed environment
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",
    "sentry": {
        "debug": False,
        "environment": "staging"
    },
    "port": 5003  # default port in flask
}

config_values["production"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "http://cuberoom.net",
    # please check this in the deployed environment
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",
    "sentry": {
        "debug": True,
        "environment": "production"
    },
    "port": 5002  # default port in flask
}

config_values["prev"] = {
    "static_url_path": "/static",
    "static_folder": "../client/public/static",
    "cors_origin": "http://prev.cuberoom.net",
    # please check this in the deployed environment
    "public_path": "../client/public",
    "user_image_prefix": "character-resource",
    "sentry": {
        "debug": True,
        "environment": "prev"
    },
    "port": 5001  # default port in flask
}


def load_version():
    with open('../client/package.json', 'r', encoding='utf-8') as package_json:
        data = package_json.read()
        return json.loads(data)['version']


def load_config():
    version = load_version()

    cuberoom_env = os.getenv('CUBEROOM_ENV')

    if cuberoom_env not in ["local", "production", "staging", "prev"]:
        sys.exit("please set CUBEROOM_ENV environment variable to " +
                 "`local` or `production`, `staging`, `prev`")

    config_value = config_values[cuberoom_env]

    sentry_sdk.init(
        "https://21f1b2ad5efb452684d66b18467ae893@o1013913.ingest.sentry.io/5979255",

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=0.1,
        debug=config_value['sentry']['debug'],
        environment=config_value['sentry']['environment'],
        release=f'cuberoom@{version}'
    )
    return config_value
