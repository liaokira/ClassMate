DELETE FROM member;

-- email: molly@books.com       password: mollymember
INSERT INTO member(id, data) VALUES ('40be182e-74d4-470b-a446-c3292739807b', '{"email": "molly@books.com", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y", "name": "Molly Member"}');

INSERT INTO study_groups(id, group_name) VALUES ('40be182e-74d4-470b-a446-c3292730647a', 'Test Group');

INSERT INTO group_members(user_id, group_id) VALUES ('40be182e-74d4-470b-a446-c3292739807b', '40be182e-74d4-470b-a446-c3292730647a');

