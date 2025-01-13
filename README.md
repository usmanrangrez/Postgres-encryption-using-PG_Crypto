-- First, create pgcrypto extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE public.user_info (
	id serial4 NOT NULL,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	mobile varchar(255) NOT NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT user_info_pkey PRIMARY KEY (id)
);

