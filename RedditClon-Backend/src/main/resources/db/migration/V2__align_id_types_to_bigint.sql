-- Align ID column types with JPA (@Id Long) using BIGINT/BIGSERIAL semantics
-- Roles
DO $$
BEGIN
    -- Ensure sequence exists (created by SERIAL in V1)
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'roles_id_seq'
    ) THEN
        CREATE SEQUENCE roles_id_seq;
    END IF;
END$$;

ALTER TABLE roles
    ALTER COLUMN id TYPE BIGINT,
    ALTER COLUMN id SET DEFAULT nextval('roles_id_seq');

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;

-- Users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'users_id_seq'
    ) THEN
        CREATE SEQUENCE users_id_seq;
    END IF;
END$$;

ALTER TABLE users
    ALTER COLUMN id TYPE BIGINT,
    ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

ALTER SEQUENCE users_id_seq OWNED BY users.id;

-- Junction table FKs to BIGINT as well
ALTER TABLE users_roles
    ALTER COLUMN user_id TYPE BIGINT,
    ALTER COLUMN role_id TYPE BIGINT;
