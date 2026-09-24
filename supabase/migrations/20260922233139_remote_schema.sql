


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."bot_channel" AS ENUM (
    'web',
    'discord'
);


ALTER TYPE "public"."bot_channel" OWNER TO "postgres";


CREATE TYPE "public"."command_status" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE "public"."command_status" OWNER TO "postgres";


CREATE TYPE "public"."integration_kind" AS ENUM (
    'discord',
    'openai',
    'anthropic',
    'google',
    'stripe',
    'github',
    'notion',
    'slack',
    'custom'
);


ALTER TYPE "public"."integration_kind" OWNER TO "postgres";


CREATE TYPE "public"."integration_status" AS ENUM (
    'active',
    'inactive',
    'error'
);


ALTER TYPE "public"."integration_status" OWNER TO "postgres";


CREATE TYPE "public"."member_role" AS ENUM (
    'owner',
    'admin',
    'member'
);


ALTER TYPE "public"."member_role" OWNER TO "postgres";


CREATE TYPE "public"."message_role" AS ENUM (
    'user',
    'assistant',
    'system',
    'tool'
);


ALTER TYPE "public"."message_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_workspace_owner"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (workspace_id, user_id) do update set role = 'owner';
  return new;
end;
$$;


ALTER FUNCTION "public"."add_workspace_owner"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_default_bot_commands"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.bot_commands (bot_id, name, description, action)
  values
    (new.id, 'help', 'Muestra los comandos disponibles', 'help'),
    (new.id, 'status', 'Muestra el estado del bot y sus conectores', 'status'),
    (new.id, 'ask', 'Envía una pregunta a la IA', 'ai.ask'),
    (new.id, 'summarize', 'Resume un texto o conversación', 'ai.summarize'),
    (new.id, 'connect', 'Gestiona conectores externos', 'integration.manage'),
    (new.id, 'settings', 'Gestiona la configuración del bot', 'bot.settings');
  return new;
end;
$$;


ALTER FUNCTION "public"."create_default_bot_commands"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_workspace_admin"("target_workspace" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.user_id = (select auth.uid())
      and wm.role in ('owner', 'admin')
  );
$$;


ALTER FUNCTION "public"."is_workspace_admin"("target_workspace" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_workspace_member"("target_workspace" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace and wm.user_id = (select auth.uid())
  );
$$;


ALTER FUNCTION "public"."is_workspace_member"("target_workspace" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ai_models" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "provider" "public"."integration_kind" NOT NULL,
    "model_name" "text" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "settings" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_models" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bot_commands" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bot_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "action" "text" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "status" "public"."command_status" DEFAULT 'active'::"public"."command_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category" "text",
    CONSTRAINT "bot_commands_name_check" CHECK (("name" ~ '^[A-Za-z][A-Za-z0-9_-]{0,31}$'::"text"))
);


ALTER TABLE "public"."bot_commands" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "system_prompt" "text",
    "default_model" "text" DEFAULT 'gpt-4o-mini'::"text" NOT NULL,
    "enabled_channels" "public"."bot_channel"[] DEFAULT ARRAY['web'::"public"."bot_channel"] NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bot_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "channel" "public"."bot_channel" DEFAULT 'web'::"public"."bot_channel" NOT NULL,
    "external_id" "text",
    "title" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "kind" "public"."integration_kind" NOT NULL,
    "name" "text" NOT NULL,
    "status" "public"."integration_status" DEFAULT 'inactive'::"public"."integration_status" NOT NULL,
    "secret_ref" "text",
    "public_config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "last_error" "text",
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."integrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "role" "public"."message_role" NOT NULL,
    "content" "text" NOT NULL,
    "command_name" "text",
    "model" "text",
    "input_tokens" integer,
    "output_tokens" integer,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usage_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "bot_id" "uuid",
    "user_id" "uuid",
    "provider" "text",
    "model" "text",
    "event_type" "text" NOT NULL,
    "input_tokens" integer DEFAULT 0 NOT NULL,
    "output_tokens" integer DEFAULT 0 NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."usage_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhook_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid",
    "integration_id" "uuid",
    "provider" "text" NOT NULL,
    "external_event_id" "text" NOT NULL,
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "processed_at" timestamp with time zone,
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."webhook_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspace_members" (
    "workspace_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."member_role" DEFAULT 'member'::"public"."member_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workspace_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workspaces" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ai_models"
    ADD CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_models"
    ADD CONSTRAINT "ai_models_workspace_id_provider_model_name_key" UNIQUE ("workspace_id", "provider", "model_name");



ALTER TABLE ONLY "public"."bot_commands"
    ADD CONSTRAINT "bot_commands_bot_id_name_key" UNIQUE ("bot_id", "name");



ALTER TABLE ONLY "public"."bot_commands"
    ADD CONSTRAINT "bot_commands_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bots"
    ADD CONSTRAINT "bots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bots"
    ADD CONSTRAINT "bots_workspace_id_slug_key" UNIQUE ("workspace_id", "slug");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_bot_id_channel_external_id_key" UNIQUE ("bot_id", "channel", "external_id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_workspace_id_kind_name_key" UNIQUE ("workspace_id", "kind", "name");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usage_events"
    ADD CONSTRAINT "usage_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_provider_external_event_id_key" UNIQUE ("provider", "external_event_id");



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("workspace_id", "user_id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_slug_key" UNIQUE ("slug");



CREATE INDEX "ai_models_workspace_idx" ON "public"."ai_models" USING "btree" ("workspace_id", "active");



CREATE INDEX "bot_commands_bot_category_idx" ON "public"."bot_commands" USING "btree" ("bot_id", "category");



CREATE INDEX "bots_workspace_idx" ON "public"."bots" USING "btree" ("workspace_id");



CREATE INDEX "commands_bot_idx" ON "public"."bot_commands" USING "btree" ("bot_id");



CREATE INDEX "conversations_bot_idx" ON "public"."conversations" USING "btree" ("bot_id", "updated_at" DESC);



CREATE INDEX "conversations_user_idx" ON "public"."conversations" USING "btree" ("user_id", "updated_at" DESC);



CREATE INDEX "integrations_workspace_idx" ON "public"."integrations" USING "btree" ("workspace_id", "status");



CREATE INDEX "messages_conversation_idx" ON "public"."messages" USING "btree" ("conversation_id", "created_at");



CREATE INDEX "usage_workspace_idx" ON "public"."usage_events" USING "btree" ("workspace_id", "created_at" DESC);



CREATE INDEX "webhook_events_unprocessed_idx" ON "public"."webhook_events" USING "btree" ("processed_at", "created_at") WHERE ("processed_at" IS NULL);



CREATE INDEX "workspace_members_user_idx" ON "public"."workspace_members" USING "btree" ("user_id", "workspace_id");



CREATE OR REPLACE TRIGGER "add_workspace_owner" AFTER INSERT ON "public"."workspaces" FOR EACH ROW EXECUTE FUNCTION "public"."add_workspace_owner"();



CREATE OR REPLACE TRIGGER "create_default_bot_commands" AFTER INSERT ON "public"."bots" FOR EACH ROW EXECUTE FUNCTION "public"."create_default_bot_commands"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."bot_commands" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."bots" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."conversations" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."integrations" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."workspaces" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."ai_models"
    ADD CONSTRAINT "ai_models_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bot_commands"
    ADD CONSTRAINT "bot_commands_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bots"
    ADD CONSTRAINT "bots_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usage_events"
    ADD CONSTRAINT "usage_events_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."usage_events"
    ADD CONSTRAINT "usage_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."usage_events"
    ADD CONSTRAINT "usage_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_members"
    ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE "public"."ai_models" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ai_models_admin_all" ON "public"."ai_models" TO "authenticated" USING ("public"."is_workspace_admin"("workspace_id")) WITH CHECK ("public"."is_workspace_admin"("workspace_id"));



ALTER TABLE "public"."bot_commands" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "bots_member_all" ON "public"."bots" TO "authenticated" USING ("public"."is_workspace_member"("workspace_id")) WITH CHECK ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "commands_member_all" ON "public"."bot_commands" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."bots" "b"
  WHERE (("b"."id" = "bot_commands"."bot_id") AND "public"."is_workspace_member"("b"."workspace_id"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."bots" "b"
  WHERE (("b"."id" = "bot_commands"."bot_id") AND "public"."is_workspace_member"("b"."workspace_id")))));



ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "conversations_member_all" ON "public"."conversations" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."bots" "b"
  WHERE (("b"."id" = "conversations"."bot_id") AND "public"."is_workspace_member"("b"."workspace_id"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."bots" "b"
  WHERE (("b"."id" = "conversations"."bot_id") AND "public"."is_workspace_member"("b"."workspace_id")))));



ALTER TABLE "public"."integrations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "integrations_admin_all" ON "public"."integrations" TO "authenticated" USING ("public"."is_workspace_admin"("workspace_id")) WITH CHECK ("public"."is_workspace_admin"("workspace_id"));



CREATE POLICY "members_admin_delete" ON "public"."workspace_members" FOR DELETE TO "authenticated" USING ("public"."is_workspace_admin"("workspace_id"));



CREATE POLICY "members_admin_insert" ON "public"."workspace_members" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_workspace_admin"("workspace_id"));



CREATE POLICY "members_admin_update" ON "public"."workspace_members" FOR UPDATE TO "authenticated" USING ("public"."is_workspace_admin"("workspace_id")) WITH CHECK ("public"."is_workspace_admin"("workspace_id"));



CREATE POLICY "members_select" ON "public"."workspace_members" FOR SELECT TO "authenticated" USING ("public"."is_workspace_member"("workspace_id"));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_member_all" ON "public"."messages" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."conversations" "c"
     JOIN "public"."bots" "b" ON (("b"."id" = "c"."bot_id")))
  WHERE (("c"."id" = "messages"."conversation_id") AND "public"."is_workspace_member"("b"."workspace_id"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."conversations" "c"
     JOIN "public"."bots" "b" ON (("b"."id" = "c"."bot_id")))
  WHERE (("c"."id" = "messages"."conversation_id") AND "public"."is_workspace_member"("b"."workspace_id")))));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_self_select" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "profiles_self_update" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."usage_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "usage_member_select" ON "public"."usage_events" FOR SELECT TO "authenticated" USING ("public"."is_workspace_member"("workspace_id"));



CREATE POLICY "webhook_admin_select" ON "public"."webhook_events" FOR SELECT TO "authenticated" USING ("public"."is_workspace_admin"("workspace_id"));



ALTER TABLE "public"."webhook_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspace_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "workspaces_member_select" ON "public"."workspaces" FOR SELECT TO "authenticated" USING ("public"."is_workspace_member"("id"));



CREATE POLICY "workspaces_owner_delete" ON "public"."workspaces" FOR DELETE TO "authenticated" USING (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "workspaces_owner_insert" ON "public"."workspaces" FOR INSERT TO "authenticated" WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "workspaces_owner_update" ON "public"."workspaces" FOR UPDATE TO "authenticated" USING (("owner_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."add_workspace_owner"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."add_workspace_owner"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."create_default_bot_commands"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."create_default_bot_commands"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_workspace_admin"("target_workspace" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_workspace_admin"("target_workspace" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."is_workspace_admin"("target_workspace" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."is_workspace_member"("target_workspace" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_workspace_member"("target_workspace" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."is_workspace_member"("target_workspace" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."ai_models" TO "anon";
GRANT ALL ON TABLE "public"."ai_models" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_models" TO "service_role";



GRANT ALL ON TABLE "public"."bot_commands" TO "anon";
GRANT ALL ON TABLE "public"."bot_commands" TO "authenticated";
GRANT ALL ON TABLE "public"."bot_commands" TO "service_role";



GRANT ALL ON TABLE "public"."bots" TO "anon";
GRANT ALL ON TABLE "public"."bots" TO "authenticated";
GRANT ALL ON TABLE "public"."bots" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."integrations" TO "anon";
GRANT ALL ON TABLE "public"."integrations" TO "authenticated";
GRANT ALL ON TABLE "public"."integrations" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."usage_events" TO "anon";
GRANT ALL ON TABLE "public"."usage_events" TO "authenticated";
GRANT ALL ON TABLE "public"."usage_events" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_events" TO "anon";
GRANT ALL ON TABLE "public"."webhook_events" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_events" TO "service_role";



GRANT ALL ON TABLE "public"."workspace_members" TO "anon";
GRANT ALL ON TABLE "public"."workspace_members" TO "authenticated";
GRANT ALL ON TABLE "public"."workspace_members" TO "service_role";



GRANT ALL ON TABLE "public"."workspaces" TO "anon";
GRANT ALL ON TABLE "public"."workspaces" TO "authenticated";
GRANT ALL ON TABLE "public"."workspaces" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
