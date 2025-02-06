-- user is a reserved word in PostgresQL, so user can't be used as a name

DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
    data jsonb
    );

-- CREATE TABLE classes(
--     classID  VARCHAR(10),
--     FOREIGN KEY(id) REFERENCES member(id)
-- ); 
