Accessing Supabase Studio#

You can access Supabase Studio through the API gateway on port 8000. For example: http://<your-ip>:8000, or localhost:8000 if you are running Docker locally.

You will be prompted for a username and password. By default, the credentials are:

    Username: supabase
    Password: this_password_is_insecure_and_should_be_updated

You should change these credentials as soon as possible using the instructions below.
Accessing the APIs#

Each of the APIs are available through the same API gateway:

    REST: http://<your-ip>:8000/rest/v1/
    Auth: http://<your-domain>:8000/auth/v1/
    Storage: http://<your-domain>:8000/storage/v1/
    Realtime: http://<your-domain>:8000/realtime/v1/
