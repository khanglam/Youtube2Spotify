from components import app
import os
port = int(os.environ.get('PORT', 5000))
print("Port: ", port)


if __name__ == '__main__':
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


    app.run(port=port)