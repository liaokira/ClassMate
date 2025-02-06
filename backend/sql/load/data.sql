DELETE FROM member;

-- Pre-hashed password: "mollymember"
INSERT INTO member (id, email, password, name)
VALUES 
(
  '40be182e-74d4-470b-a446-c3292739807b',
  'molly@books.com',
  '$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y',
  'Molly Member'
);
