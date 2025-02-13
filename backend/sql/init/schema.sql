-- user is a reserved word in PostgresQL, so user can't be used as a name

DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
    data jsonb
    );

DROP TABLE IF EXISTS classes CASCADE;
CREATE TABLE classes(
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    className  VARCHAR(10) NOT NULL
); 

DROP TABLE IF EXISTS member_classes CASCADE;
CREATE TABLE member_classes (
    member_id UUID NOT NULL,
    class_id INT NOT NULL,
    PRIMARY KEY (member_id, class_id),
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS member_profiles CASCADE;
CREATE TABLE member_profiles (
    id UUID PRIMARY KEY REFERENCES member(id) ON DELETE CASCADE, 
    bio_data VARCHAR(365) NOT NULL DEFAULT '',
    full_name VARCHAR(30) NOT NULL DEFAULT ''
);