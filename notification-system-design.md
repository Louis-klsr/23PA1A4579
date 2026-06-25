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

## Persistent Storage Choice

I suggest using **PostgreSQL** because it provides ACID compliance, supports indexing, and efficiently handles large amounts of structured notification data.

## Database Schema

### Students

```sql
CREATE TABLE students (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
```

### Notifications

```sql
CREATE TYPE notification_type AS ENUM ('Event', 'Result', 'Placement');

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  type notification_type,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);
```

## Potential Problems as Data Grows

* Slower query performance due to millions of notifications.
* Increased database load and storage requirements.

## Solutions

* Add indexes on frequently queried columns (`student_id`, `is_read`, `created_at`).
* Implement pagination for fetching notifications.
* Use caching (Redis) for unread counts and frequently accessed data.

## Sample Queries

### Get Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
ORDER BY created_at DESC;
```

### Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC;
```

### Mark Notification as Read

```sql
UPDATE notifications
SET is_read = true
WHERE id = 'notification_id';
```

# Stage 3

The given query is not completely correct because `SELECT` is missing the columns to be retrieved. A valid query would be:

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC;
```

The query becomes slow because the database has around 5 million notifications. Without proper indexing, the database has to scan a large number of rows and then sort the results.

To improve performance, I would create a composite index on `student_id`, `is_read`, and `created_at`.

```sql
CREATE INDEX idx_notifications
ON notifications (student_id, is_read, created_at DESC);
```

This reduces the amount of data scanned and makes filtering and sorting much faster.

Adding indexes on every column is not a good idea. Indexes consume extra storage and slow down insert, update, and delete operations. Indexes should only be added on columns that are frequently used for filtering, joining, or sorting.

To find all students who received placement notifications in the last 7 days:

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```

# Stage 4

Fetching notifications on every page load creates unnecessary database traffic and increases response time.

To improve performance, I would:

* Use **Redis caching** to store frequently accessed notifications and unread counts.
* Implement **pagination** so that only a limited number of notifications are fetched at a time.
* Use **WebSockets** to push new notifications in real time instead of repeatedly polling the server.
* Add **database indexes** on frequently queried columns.

### Trade-offs

* Caching improves speed but introduces cache invalidation complexity.
* Pagination reduces database load but requires multiple requests to view older notifications.
* WebSockets provide real-time updates but require maintaining persistent connections.
* Indexes speed up reads but slightly increase write overhead.