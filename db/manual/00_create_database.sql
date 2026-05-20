-- Run this while connected to the default `postgres` database.
-- Skip this query if the `gymin` database already exists.

CREATE DATABASE gymin
  WITH
  OWNER = gymin_admin
  ENCODING = 'UTF8'
  TEMPLATE = template0;
