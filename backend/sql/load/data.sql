DELETE FROM member;

-- email: molly@books.com       password: mollymember
INSERT INTO member(id, data) VALUES ('40be182e-74d4-470b-a446-c3292739807b', '{"email": "molly@books.com", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y", "name": "Molly Member"}');

INSERT INTO classes(id, className) VALUES ('115', 'CSE 115A');

INSERT INTO study_groups(id, group_name, color, associated_class) VALUES ('40be182e-74d4-470b-a446-c3292730647a', 'Test Group', 'red', '115');

INSERT INTO group_members(user_id, group_id) VALUES ('40be182e-74d4-470b-a446-c3292739807b', '40be182e-74d4-470b-a446-c3292730647a');

