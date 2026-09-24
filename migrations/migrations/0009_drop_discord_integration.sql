-- Reverts 0008_discord_integration.sql.
-- The old CROSAIM recruiting/sync Discord bot (integrations/vantbot) was
-- replaced by the writing-assistant bot (integrations/writing-assistant-bot),
-- which does not read or write this schema. Dropping the tables, columns and
-- indexes that only existed to support the retired sync flow.

drop table if exists postulaciones_auditoria;
drop table if exists postulaciones;

drop index if exists profiles_discord_id_unique_idx;
alter table profiles drop column if exists discord_id;
alter table profiles drop column if exists discord_username;
