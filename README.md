# PostgreSQL Schema Creation

## Extensions
```sql
-- Create pgcrypto extension if it does not exist
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Table: `public.user_info`
```sql
CREATE TABLE public.user_info (
    id SERIAL PRIMARY KEY, -- Unique identifier for each user
    first_name VARCHAR(255) NOT NULL, -- User's first name
    last_name VARCHAR(255) NOT NULL, -- User's last name
    address VARCHAR(255) NOT NULL, -- User's address
    mobile VARCHAR(255) NOT NULL, -- User's mobile number
    created_at TIMESTAMPTZ NULL, -- Timestamp of record creation
    updated_at TIMESTAMPTZ NULL  -- Timestamp of last record update
);
```
- **Primary Key**: `id`
- **Constraints**:
  - `NOT NULL` on `first_name`, `last_name`, `address`, and `mobile`.

### Notes
1. The `pgcrypto` extension is added for cryptographic functionalities, e.g., hashing or UUID generation.
2. Use `TIMESTAMPTZ` for `created_at` and `updated_at` to ensure timezone consistency.
