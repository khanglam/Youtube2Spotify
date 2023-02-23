from components import app
import os
port = int(os.environ.get('PORT', 5000))
print("Port: ", port)
if __name__ == '__main__':
    app.run(port=port)
# if __name__ == '__main__':
#     app.run(port=int(os.environ.get("PORT",os.environ.get("SPOTIPY_REDIRECT_URI", 5000))))