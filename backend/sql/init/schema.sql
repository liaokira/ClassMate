-- user is a reserved word in PostgresQL, so user can't be used as a name

DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
    data jsonb
    );

DROP TABLE IF EXISTS classes CASCADE;
CREATE TABLE classes(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    className VARCHAR(50) NOT NULL,
    startTime INT,
    endTime INT
); 

DROP TABLE IF EXISTS member_classes CASCADE;
CREATE TABLE member_classes (
    member_id UUID NOT NULL,
    class_id UUID NOT NULL,
    PRIMARY KEY (member_id, class_id),
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS study_groups CASCADE;
CREATE TABLE study_groups(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR(18) NOT NULL,
    group_description TEXT NOT NULL DEFAULT 'Add a group description...',
    color VARCHAR(18) NOT NULL,
    associated_class UUID REFERENCES classes(id)
);

DROP TABLE IF EXISTS member_profiles CASCADE;
CREATE TABLE member_profiles (
    id UUID PRIMARY KEY REFERENCES member(id) ON DELETE CASCADE, 
    bio_data VARCHAR(365) NOT NULL DEFAULT 'Add a bio...',
    full_name VARCHAR(30) NOT NULL DEFAULT ''
);

DROP TABLE IF EXISTS group_members CASCADE;
CREATE TABLE group_members (
    user_id UUID REFERENCES member(id) ON DELETE CASCADE,
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES member(id) ON DELETE CASCADE,
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

