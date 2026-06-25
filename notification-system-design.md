# Notification System Design

# Notification System Design
# Stage 1

## Base URL

```
/api
```

## Headers

```
Content-Type: application/json
Authorization: Bearer <token>
```

---

## 1. Get Notifications

**GET** `/notifications`

### Response

```json
[
  {
    "id": 1,
    "title": "Placement Drive",
    "message": "abc drive starts tomorrow",
    "type": "placement",
    "isRead": false
  }
]
```

---

## 2. Create Notification

**POST** `/notifications`

### Request

```json
{
  "title": "Placement Drive",
  "message": "abc drive starts tomorrow",
  "type": "placement"
}
```

### Response

```json
{
  "message": "Notification created"
}
```

---

## 3. Mark Notification as Read

**PUT** `/notifications/{id}/read`

### Response

```json
{
  "message": "Notification marked as read"
}
```

---

## 4. Delete Notification

**DELETE** `/notifications/{id}`

### Response

```json
{
  "message": "Notification deleted"
}
```

---

# Real-Time Notifications

Use **WebSocket**.

When a new notification is created, the server sends it instantly to all connected users.

Example:

```json
{
  "event": "new_notification",
  "title": "Placement Drive",
  "message": "abc drive starts tomorrow"
}
```

---

## Status Codes

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error


# Stage 2