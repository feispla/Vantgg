-- Public roster seeds so /players always has logos to show.
insert into profiles (user_id, username, display_name, country, rank_key, points, xp, wins, losses)
values
  ('seed-feiss', 'feiss', 'FEISS', 'España', 'diamond', 1840, 4200, 42, 18),
  ('seed-nova', 'nova', 'NOVA', 'México', 'platinum', 1320, 2100, 28, 16),
  ('seed-kairo', 'kairo', 'KAIRO', 'Argentina', 'gold', 880, 1400, 19, 21),
  ('seed-lyra', 'lyra', 'LYRA', 'Colombia', 'silver', 540, 900, 11, 14),
  ('seed-orbit', 'orbit', 'ORBIT', 'Chile', 'bronze', 220, 400, 6, 9)
on conflict (user_id) do nothing;
