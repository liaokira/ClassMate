-- user is a reserved word in PostgresQL, so user can't be used as a name

DROP TABLE IF EXISTS user CASCADE;
CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);
