# VANT Discord Bot

Worker Python persistente responsable de la integración de **Discord** con el ecosistema **VANT**.

El bot mantiene el flujo operativo:

```text
POSTULACIÓN
    ↓
REVISIÓN
    ↓
ENTREVISTA
    ↓
APROBADA / RECHAZADA
    ↓
TRYOUT / ROSTER
```

incluyendo botones, roles, generación de imágenes cuando corresponde, entrega de eventos a Discord y registro auditable en Supabase.

> **Compatibilidad:** el repositorio y algunos recursos de infraestructura pueden conservar temporalmente nombres históricos de CROSAIM. **VANT es el nombre canónico del ecosistema.** Las referencias CROSAIM restantes deben considerarse legacy/compatibilidad y no deben utilizarse para nuevos contratos o componentes.

---

## Responsabilidad del bot

El bot es actualmente propietario de la integración operativa con Discord y del runtime que escribe las postulaciones en Supabase.

### El bot posee actualmente

* ingestión desde Discord;
* parsing y validación de postulaciones;
* escritura de `public.postulaciones`;
* escritura inicial de `public.postulaciones_auditoria`;
* búsqueda por `discord_postulacion_message_id`;
* entrega de eventos hacia Discord;
* polling de eventos VANT;
* ACK de eventos;
* operación de roles y canales;
* entrevistas, tryouts y roster;
* reconciliación operativa relacionada con Discord.

### El bot NO es propietario de

* `vant_sync_events`;
* retries del outbox web;
* leases del outbox;
* dead-letter del outbox;
* API HTTP `/api/vant/*`.

Estas responsabilidades pertenecen actualmente a:

```text
feispla/crosaim-canonical-web
```

---

# Arquitectura actual

```text
                    VANT ECOSYSTEM

                         ┌──────────────────────┐
                         │   Discord           │
                         │   Applications      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ VANT Discord Bot     │
                         │                      │
                         │ Discord ingestion    │
                         │ Validation           │
                         │ Application writer   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Supabase        │
                         │                      │
                         │ postulaciones        │
                         │ postulaciones_auditoria│
                         └──────────────────────┘

                                    │
                                    │ VANT sync
                                    ▼

                         ┌──────────────────────┐
                         │ VANT Canonical Web   │
                         │                      │
                         │ /api/vant/*          │
                         │ vant_sync_events     │
                         │ outbox               │
                         │ retries              │
                         │ leases               │
                         │ ACK                  │
                         │ dead-letter          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Discord        │
                         │ review / interview   │
                         │ tryout / roster      │
                         └──────────────────────┘
```

## Estado objetivo

La arquitectura está evolucionando hacia una única autoridad para el estado de las aplicaciones:

```text
CANONICAL APPLICATION AUTHORITY = SUPABASE
CANONICAL AUDIT AUTHORITY       = SUPABASE
DELIVERY OUTBOX                 = VANT sync events / MySQL
DISCORD                         = external delivery surface
```

`vant_sync_events` no debe convertirse en una segunda base de aplicaciones.

---

# Identidad de una postulación

La arquitectura distingue tres identificadores diferentes.

```text
application_id
    ↓
Identidad canónica interna de la aplicación

discordMessageId
    ↓
Identificador externo del mensaje original de Discord

postulaciones.id
    ↓
Primary key existente de la tabla Supabase
```

Estos identificadores **no deben mezclarse**.

En particular:

```text
discordMessageId ≠ application_id
```

El `discordMessageId` continúa siendo importante para identificar el origen Discord y mantener compatibilidad e idempotencia.

---

# `application_id`

El audit de ownership confirmó que actualmente **no existe todavía un `application_id` compartido entre el bot y la API VANT**.

La implementación futura debe introducir:

```text
postulaciones.application_id
```

como identidad canónica de aplicación.

La migración debe:

* preservar `postulaciones.id`;
* preservar la FK de auditoría existente;
* preservar `discord_postulacion_message_id`;
* generar UUID server-side/database-side;
* añadir unicidad;
* permitir una transición controlada antes de imponer `NOT NULL`, si resulta necesaria;
* transportar `application_id` hacia el outbox;
* mantener `discordMessageId` como identificador externo.

**La migración todavía no está autorizada para producción.**

---

# Idempotencia

El bot actualmente utiliza `discord_postulacion_message_id` para evitar duplicados.

La arquitectura futura utilizará:

```text
application_id
    identidad canónica

discordMessageId
    identidad externa / idempotency key

payload_hash
    detección de divergencia
```

Regla esperada:

```text
mismo discordMessageId
+
mismo payload normalizado
=
DUPLICATE / IDEMPOTENT
```

Mientras que:

```text
mismo discordMessageId
+
payload diferente
=
CONFLICT
```

Un conflicto **no debe sobrescribir automáticamente** una aplicación existente.

No debe crearse una segunda aplicación para resolver un conflicto de identidad.

---

# Flujo actual de una postulación

Actualmente el flujo está dividido entre el bot y la API web:

```text
Discord
  ↓
VANT Discord Bot
  ↓
save_submission()
  ↓
Supabase postulaciones
  ↓
Supabase postulaciones_auditoria
```

y posteriormente:

```text
VANT Discord Bot
  ↓
POST /api/vant/applications
  ↓
crosaim-canonical-web
  ↓
vant_sync_events / MySQL
```

Esto constituye actualmente un **split write path**.

El objetivo arquitectónico es eliminar esa división de autoridad:

```text
Discord
  ↓
Canonical ingestion
  ↓
Supabase
  ├── postulaciones
  ├── application_id
  └── postulaciones_auditoria
  ↓
durable delivery intent
  ↓
VANT outbox
  ↓
Discord
  ↓
ACK
```

---

# Supabase

Este repositorio contiene actualmente el esquema y runtime de:

```text
public.postulaciones
public.postulaciones_auditoria
```

La autoridad de esos datos es Supabase.

## `postulaciones`

La tabla conserva:

* `id` UUID primary key;
* información de la postulación;
* `discord_postulacion_message_id`;
* estado/lifecycle;
* timestamps;
* índices y restricciones existentes.

El `id` actual **no debe eliminarse ni reutilizarse como sustituto automático de `application_id`**.

## `postulaciones_auditoria`

La auditoría mantiene la relación:

```text
postulaciones_auditoria.postulación_id
        ↓
postulaciones.id
```

La FK existente debe permanecer intacta durante la migración.

---

# Integración con VANT Canonical Web

Repositorio propietario:

```text
feispla/crosaim-canonical-web
```

Actualmente proporciona:

```text
POST /api/vant/applications
GET  /api/vant/events
POST /api/vant/events/:id/ack
GET  /api/vant/audit
```

Además existen aliases legacy bajo:

```text
/api/discord/*
```

Los aliases legacy deben mantenerse durante la transición hasta que la migración y reconciliación estén verificadas.

El bot utiliza la API VANT para sincronización y entrega de eventos.

---

# Outbox y delivery

El bot consume el outbox VANT mediante polling.

Flujo:

```text
VANT Web
  ↓
vant_sync_events
  ↓
GET /api/vant/events
  ↓
Bot obtiene lease
  ↓
Bot publica en Discord
  ↓
ACK
```

El sistema soporta:

* idempotencia;
* leases;
* attempts;
* retries;
* backoff;
* ACK;
* dead-letter.

El bot es responsable de la **acción externa en Discord**.

La web es responsable del **estado técnico del outbox**.

---

# ACK

Después de procesar correctamente un evento:

```text
Discord delivery
      ↓
ACK
```

El ACK debe estar asociado al lease correspondiente.

Un evento que no pueda entregarse no debe marcarse artificialmente como enviado.

El sistema puede pasar por:

```text
pending
→ processing
→ sent
```

o:

```text
processing
→ retry
→ processing
→ dead_letter
```

según el resultado de la entrega.

---

# Flujo de entrevista

Cuando una postulación pasa a entrevista, el bot puede:

1. mencionar al candidato;
2. publicar el aviso correspondiente;
3. proporcionar el canal de entrevista;
4. mover al usuario a voz si cumple las condiciones de Discord.

Para mover automáticamente a un usuario, este debe estar conectado a un canal de voz y el bot debe disponer de:

* **Mover miembros**;
* jerarquía de roles suficiente.

Si el usuario todavía no está conectado a voz, el bot no puede moverlo automáticamente y debe dejar el aviso correspondiente.

---

# Configuración local

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python bot.py
```

Configura los secretos únicamente en `.env`.

Nunca publiques:

```text
.env
Discord bot token
Supabase keys
OAuth secrets
Railway credentials
VANT synchronization secrets
```

---

# Railway

El bot está diseñado para ejecutarse como worker persistente en Railway.

Variables principales de VANT:

```text
VANT_WEB_BASE_URL
VANT_BOT_SYNC_SECRET
VANT_SIGNED_SYNC_REQUIRED
CLIPS_CHANNEL_ID
INTERVIEW_VOICE_CHANNEL_ID
```

El secreto:

```text
VANT_BOT_SYNC_SECRET
```

debe coincidir con el secreto configurado en el servicio web correspondiente.

Las variables históricas:

```text
CROSAIM_WEB_BASE_URL
CROSAIM_BOT_SYNC_SECRET
CROSAIM_SIGNED_SYNC_REQUIRED
```

se mantienen únicamente como aliases de transición mientras existan consumidores legacy.

No deben utilizarse para nuevos contratos.

---

# Seguridad de Discord

El bot requiere únicamente los permisos necesarios para su operación.

Permisos actuales requeridos:

* Gestionar canales;
* Gestionar roles;
* Mover miembros;
* Enviar mensajes;
* Insertar enlaces;
* Adjuntar archivos;
* Ver canales;
* Leer historial de mensajes.

El bot **no requiere `Administrator`**.

La jerarquía de roles debe configurarse de manera que el bot pueda administrar únicamente los roles y acciones necesarios.

---

# Configuración persistente

El directorio configurado mediante:

```text
CROSAIM_RUNTIME_CONFIG_PATH
```

debe encontrarse en un volumen persistente del proveedor de ejecución.

No debe utilizarse un almacenamiento efímero para información operativa que deba sobrevivir a reinicios.

---

# Configuración del servidor

Los comandos administrativos existentes permiten inspeccionar y preparar la configuración de Discord.

```text
/crosaim plan
/crosaim setup
/crosaim status
```

### `/crosaim plan`

Muestra la reconciliación propuesta antes de realizar cambios.

### `/crosaim setup`

Crea o normaliza únicamente recursos que puedan resolverse sin ambigüedad.

No elimina ni fusiona recursos automáticamente.

### `/crosaim status`

Muestra:

* permisos;
* jerarquía;
* drift;
* estado de configuración;
* salud del registro persistido.

Consulta:

```text
DISCORD_OPERATIONS.md
```

para la matriz de roles, permisos mínimos y política no destructiva.

---

# Documentación relacionada

Este repositorio contiene documentación reutilizable para la integración:

```text
WEB_INTEGRATION_GUIDE.md
supabase_profile_schema.sql
examples/application_submitted.json
SYNC_CONTRACT.md
ARQUITECTURA_CROSAIM.md
skills/crosaim-discord-supabase-sync/SKILL.md
DISCORD_OPERATIONS.md
SUPABASE_HOSTING.md
```

Estas piezas deben mantenerse sincronizadas con los contratos reales antes de ejecutar migraciones.

---

# Migraciones Supabase

Las migraciones relacionadas con aplicaciones deben tratarse como cambios controlados.

En particular:

```text
supabase_migration_application_state.sql
```

y cualquier futura migración de:

```text
postulaciones.application_id
```

deben revisarse contra el esquema real de Supabase antes de ejecutarse.

**No ejecutar una migración de producción únicamente porque exista el archivo SQL en GitHub.**

GitHub contiene:

```text
schema
migrations
code
documentation
```

Supabase contiene:

```text
runtime data
```

La migración debe validarse primero en staging.

---

# Reconciliación

Actualmente no existe todavía una reconciliación runtime completa entre:

```text
Supabase application
Supabase audit
VANT outbox
Discord delivery
```

La arquitectura futura deberá detectar al menos:

```text
healthy
event_missing
application_missing
payload_conflict
audit_missing
ack_missing
discord_delivery_missing
duplicate
manual_review
```

La primera fase de reconciliación debe ser **read-only**.

No deben realizarse repairs automáticos hasta definir reglas deterministas y un procedimiento de rollback.

---

# Estado de migración CROSAIM → VANT

```text
CANONICAL ECOSYSTEM NAME = VANT
```

La migración es progresiva.

Las referencias históricas de CROSAIM pueden permanecer temporalmente en:

* nombres de repositorios;
* servicios Railway;
* variables legacy;
* URLs internas;
* aliases API;
* documentación histórica;
* compatibilidad con clientes existentes.

No realizar reemplazos globales ciegos.

Los nuevos contratos deben utilizar nomenclatura VANT.

```text
VANT
VANT: VEIL
VANT Discord Bot
VANT Control Plane
VANT Game Plane
VANT Contracts
```

---

# Estado actual de arquitectura

```text
OWNERSHIP AUDIT = COMPLETE

APPLICATION_SCHEMA_OWNER
= feispla/CROSAIM.GG-railwaybot

APPLICATION_AUDIT_OWNER
= feispla/CROSAIM.GG-railwaybot

VANT_API_OWNER
= feispla/crosaim-canonical-web

OUTBOX_OWNER
= feispla/crosaim-canonical-web

CONTROL_PLANE_OWNER
= feispla/VANTGAME-Control-Plane

APPLICATION_ID
= NOT YET IMPLEMENTED

RECONCILIATION
= NOT YET COMPLETE

PRODUCTION MIGRATION
= NOT AUTHORIZED

STAGING
= REQUIRED

CURRENT ARCHITECTURAL ISSUE
= SPLIT WRITE PATHS

TARGET
= SUPABASE AS SINGLE APPLICATION AUTHORITY
```

---

# Reglas de seguridad para cambios futuros

Antes de cualquier cambio estructural:

1. identificar el repositorio propietario;
2. inspeccionar el esquema real;
3. preparar migración;
4. preparar tests;
5. validar idempotencia;
6. validar compatibilidad;
7. probar en staging;
8. ejecutar reconciliación read-only;
9. definir rollback;
10. revisar antes de producción.

Nunca:

* crear una segunda autoridad de aplicaciones;
* duplicar `postulaciones` en otro repositorio;
* usar `discordMessageId` como `application_id`;
* eliminar la FK existente de auditoría sin migración explícita;
* sobrescribir conflictos de payload;
* ejecutar SQL destructivo sin preflight;
* desplegar una migración no validada;
* almacenar secretos en GitHub.

