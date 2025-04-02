
# 📦 SUPABASE.md — Self-hosted Access Guide

## 🔐 Accessing Supabase Studio

You can access **Supabase Studio** via the API Gateway on port `8000`.

- **URL**: [http://localhost:8000](http://localhost:8000) *(or replace `localhost` with your IP if accessed remotely)*

### 🔑 Default Credentials

When prompted for login, use:

```
Username: supabase
Password: this_password_is_insecure_and_should_be_updated
```

> ⚠️ **Important**: You should update these credentials immediately following Supabase's security recommendations.

---

## 🌐 Accessing Supabase APIs

All core Supabase APIs are available through the same API Gateway:

| API       | URL                                      |
|-----------|-------------------------------------------|
| REST      | `http://<your-ip>:8000/rest/v1/`         |
| Auth      | `http://<your-domain>:8000/auth/v1/`     |
| Storage   | `http://<your-domain>:8000/storage/v1/`  |
| Realtime  | `http://<your-domain>:8000/realtime/v1/` |

> 📝 Replace `<your-ip>` or `<your-domain>` accordingly depending on your access setup.
