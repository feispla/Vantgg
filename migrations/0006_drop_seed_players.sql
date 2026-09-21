-- Ranked and public roster are real accounts only. Drop demo/seed profiles.
delete from ranked_history where user_id like 'seed-%';
delete from tournament_entries where user_id like 'seed-%';
delete from profiles where user_id like 'seed-%';
