--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg110+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: directus
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO directus;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: directus
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO directus;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: directus
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accomplishment_variations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.accomplishment_variations (
    accomplishment integer,
    context character varying(255) DEFAULT NULL::character varying,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    description text NOT NULL,
    id integer NOT NULL,
    is_primary boolean DEFAULT false,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    title character varying(255) DEFAULT NULL::character varying NOT NULL,
    tone character varying(255) DEFAULT NULL::character varying,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.accomplishment_variations OWNER TO directus;

--
-- Name: accomplishment_variations_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.accomplishment_variations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accomplishment_variations_id_seq OWNER TO directus;

--
-- Name: accomplishment_variations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.accomplishment_variations_id_seq OWNED BY public.accomplishment_variations.id;


--
-- Name: accomplishments; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.accomplishments (
    accomplishment_type character varying(255) DEFAULT NULL::character varying,
    approximate_date date,
    date_achieved date,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    evidence_links json,
    id integer NOT NULL,
    impact_metrics text,
    is_featured boolean DEFAULT false,
    "position" integer,
    primary_description text NOT NULL,
    primary_title character varying(255) DEFAULT NULL::character varying NOT NULL,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.accomplishments OWNER TO directus;

--
-- Name: accomplishments_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.accomplishments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accomplishments_id_seq OWNER TO directus;

--
-- Name: accomplishments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.accomplishments_id_seq OWNED BY public.accomplishments.id;


--
-- Name: accomplishments_projects; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.accomplishments_projects (
    accomplishments_id integer,
    id integer NOT NULL,
    projects_id integer,
    sort integer
);


ALTER TABLE public.accomplishments_projects OWNER TO directus;

--
-- Name: accomplishments_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.accomplishments_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accomplishments_projects_id_seq OWNER TO directus;

--
-- Name: accomplishments_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.accomplishments_projects_id_seq OWNED BY public.accomplishments_projects.id;


--
-- Name: accomplishments_skills; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.accomplishments_skills (
    accomplishments_id integer,
    id integer NOT NULL,
    skills_id integer,
    sort integer
);


ALTER TABLE public.accomplishments_skills OWNER TO directus;

--
-- Name: accomplishments_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.accomplishments_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accomplishments_skills_id_seq OWNER TO directus;

--
-- Name: accomplishments_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.accomplishments_skills_id_seq OWNED BY public.accomplishments_skills.id;


--
-- Name: accomplishments_technologies; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.accomplishments_technologies (
    accomplishments_id integer,
    id integer NOT NULL,
    technologies_id integer
);


ALTER TABLE public.accomplishments_technologies OWNER TO directus;

--
-- Name: accomplishments_technologies_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.accomplishments_technologies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accomplishments_technologies_id_seq OWNER TO directus;

--
-- Name: accomplishments_technologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.accomplishments_technologies_id_seq OWNED BY public.accomplishments_technologies.id;


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.certifications (
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    id integer NOT NULL,
    is_active boolean DEFAULT true,
    issue_date date,
    issuing_organization character varying(255) DEFAULT NULL::character varying,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.certifications OWNER TO directus;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certifications_id_seq OWNER TO directus;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.companies (
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    description text,
    id integer NOT NULL,
    industry character varying(255) DEFAULT NULL::character varying,
    location character varying(255) DEFAULT NULL::character varying,
    logo uuid,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    size character varying(255) DEFAULT NULL::character varying,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid,
    website character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.companies OWNER TO directus;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO directus;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: cover_letters; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.cover_letters (
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    id integer NOT NULL,
    parent_cover_letter integer,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.cover_letters OWNER TO directus;

--
-- Name: cover_letters_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.cover_letters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cover_letters_id_seq OWNER TO directus;

--
-- Name: cover_letters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.cover_letters_id_seq OWNED BY public.cover_letters.id;


--
-- Name: directus_access; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_access (
    id uuid NOT NULL,
    role uuid,
    "user" uuid,
    policy uuid NOT NULL,
    sort integer
);


ALTER TABLE public.directus_access OWNER TO directus;

--
-- Name: directus_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_activity_id_seq OWNER TO directus;

--
-- Name: directus_collections; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_collections (
    collection character varying(64) NOT NULL,
    icon character varying(64),
    note text,
    display_template character varying(255),
    hidden boolean DEFAULT false NOT NULL,
    singleton boolean DEFAULT false NOT NULL,
    translations json,
    archive_field character varying(64),
    archive_app_filter boolean DEFAULT true NOT NULL,
    archive_value character varying(255),
    unarchive_value character varying(255),
    sort_field character varying(64),
    accountability character varying(255) DEFAULT 'all'::character varying,
    color character varying(255),
    item_duplication_fields json,
    sort integer,
    "group" character varying(64),
    collapse character varying(255) DEFAULT 'open'::character varying NOT NULL,
    preview_url character varying(255),
    versioning boolean DEFAULT false NOT NULL
);


ALTER TABLE public.directus_collections OWNER TO directus;

--
-- Name: directus_comments; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_comments (
    id uuid NOT NULL,
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    comment text NOT NULL,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.directus_comments OWNER TO directus;

--
-- Name: directus_dashboards; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_dashboards (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(64) DEFAULT 'dashboard'::character varying NOT NULL,
    note text,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid,
    color character varying(255)
);


ALTER TABLE public.directus_dashboards OWNER TO directus;

--
-- Name: directus_extensions; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_extensions (
    enabled boolean DEFAULT true NOT NULL,
    id uuid NOT NULL,
    folder character varying(255) NOT NULL,
    source character varying(255) NOT NULL,
    bundle uuid
);


ALTER TABLE public.directus_extensions OWNER TO directus;

--
-- Name: directus_fields; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_fields (
    id integer NOT NULL,
    collection character varying(64) NOT NULL,
    field character varying(64) NOT NULL,
    special character varying(64),
    interface character varying(64),
    options json,
    display character varying(64),
    display_options json,
    readonly boolean DEFAULT false NOT NULL,
    hidden boolean DEFAULT false NOT NULL,
    sort integer,
    width character varying(30) DEFAULT 'full'::character varying,
    translations json,
    note text,
    conditions json,
    required boolean DEFAULT false,
    "group" character varying(64),
    validation json,
    validation_message text,
    searchable boolean DEFAULT true NOT NULL
);


ALTER TABLE public.directus_fields OWNER TO directus;

--
-- Name: directus_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_fields_id_seq OWNER TO directus;

--
-- Name: directus_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_fields_id_seq OWNED BY public.directus_fields.id;


--
-- Name: directus_files; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_files (
    id uuid NOT NULL,
    storage character varying(255) NOT NULL,
    filename_disk character varying(255),
    filename_download character varying(255) NOT NULL,
    title character varying(255),
    type character varying(255),
    folder uuid,
    uploaded_by uuid,
    created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by uuid,
    modified_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    charset character varying(50),
    filesize bigint,
    width integer,
    height integer,
    duration integer,
    embed character varying(200),
    description text,
    location text,
    tags text,
    metadata json,
    focal_point_x integer,
    focal_point_y integer,
    tus_id character varying(64),
    tus_data json,
    uploaded_on timestamp with time zone
);


ALTER TABLE public.directus_files OWNER TO directus;

--
-- Name: directus_flows; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_flows (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(64),
    color character varying(255),
    description text,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    trigger character varying(255),
    accountability character varying(255) DEFAULT 'all'::character varying,
    options json,
    operation uuid,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid
);


ALTER TABLE public.directus_flows OWNER TO directus;

--
-- Name: directus_folders; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_folders (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    parent uuid
);


ALTER TABLE public.directus_folders OWNER TO directus;

--
-- Name: directus_migrations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_migrations (
    version character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.directus_migrations OWNER TO directus;

--
-- Name: directus_notifications; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_notifications (
    id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'inbox'::character varying,
    recipient uuid NOT NULL,
    sender uuid,
    subject character varying(255) NOT NULL,
    message text,
    collection character varying(64),
    item character varying(255)
);


ALTER TABLE public.directus_notifications OWNER TO directus;

--
-- Name: directus_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_notifications_id_seq OWNER TO directus;

--
-- Name: directus_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_notifications_id_seq OWNED BY public.directus_notifications.id;


--
-- Name: directus_operations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_operations (
    id uuid NOT NULL,
    name character varying(255),
    key character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    position_x integer NOT NULL,
    position_y integer NOT NULL,
    options json,
    resolve uuid,
    reject uuid,
    flow uuid NOT NULL,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid
);


ALTER TABLE public.directus_operations OWNER TO directus;

--
-- Name: directus_panels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_panels (
    id uuid NOT NULL,
    dashboard uuid NOT NULL,
    name character varying(255),
    icon character varying(64) DEFAULT NULL::character varying,
    color character varying(10),
    show_header boolean DEFAULT false NOT NULL,
    note text,
    type character varying(255) NOT NULL,
    position_x integer NOT NULL,
    position_y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    options json,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid
);


ALTER TABLE public.directus_panels OWNER TO directus;

--
-- Name: directus_permissions; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_permissions (
    id integer NOT NULL,
    collection character varying(64) NOT NULL,
    action character varying(10) NOT NULL,
    permissions json,
    validation json,
    presets json,
    fields text,
    policy uuid NOT NULL
);


ALTER TABLE public.directus_permissions OWNER TO directus;

--
-- Name: directus_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_permissions_id_seq OWNER TO directus;

--
-- Name: directus_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_permissions_id_seq OWNED BY public.directus_permissions.id;


--
-- Name: directus_policies; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_policies (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    icon character varying(64) DEFAULT 'badge'::character varying NOT NULL,
    description text,
    ip_access text,
    enforce_tfa boolean DEFAULT false NOT NULL,
    admin_access boolean DEFAULT false NOT NULL,
    app_access boolean DEFAULT false NOT NULL
);


ALTER TABLE public.directus_policies OWNER TO directus;

--
-- Name: directus_presets; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_presets (
    id integer NOT NULL,
    bookmark character varying(255),
    "user" uuid,
    role uuid,
    collection character varying(64),
    search character varying(100),
    layout character varying(100) DEFAULT 'tabular'::character varying,
    layout_query json,
    layout_options json,
    refresh_interval integer,
    filter json,
    icon character varying(64) DEFAULT 'bookmark'::character varying,
    color character varying(255)
);


ALTER TABLE public.directus_presets OWNER TO directus;

--
-- Name: directus_presets_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_presets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_presets_id_seq OWNER TO directus;

--
-- Name: directus_presets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_presets_id_seq OWNED BY public.directus_presets.id;


--
-- Name: directus_relations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_relations (
    id integer NOT NULL,
    many_collection character varying(64) NOT NULL,
    many_field character varying(64) NOT NULL,
    one_collection character varying(64),
    one_field character varying(64),
    one_collection_field character varying(64),
    one_allowed_collections text,
    junction_field character varying(64),
    sort_field character varying(64),
    one_deselect_action character varying(255) DEFAULT 'nullify'::character varying NOT NULL
);


ALTER TABLE public.directus_relations OWNER TO directus;

--
-- Name: directus_relations_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_relations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_relations_id_seq OWNER TO directus;

--
-- Name: directus_relations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_relations_id_seq OWNED BY public.directus_relations.id;


--
-- Name: directus_revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_revisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_revisions_id_seq OWNER TO directus;

--
-- Name: directus_roles; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_roles (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    icon character varying(64) DEFAULT 'supervised_user_circle'::character varying NOT NULL,
    description text,
    parent uuid
);


ALTER TABLE public.directus_roles OWNER TO directus;

--
-- Name: directus_settings; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_settings (
    id integer NOT NULL,
    project_name character varying(100) DEFAULT 'Directus'::character varying NOT NULL,
    project_url character varying(255),
    project_color character varying(255) DEFAULT '#6644FF'::character varying NOT NULL,
    project_logo uuid,
    public_foreground uuid,
    public_background uuid,
    public_note text,
    auth_login_attempts integer DEFAULT 25,
    auth_password_policy character varying(100),
    storage_asset_transform character varying(7) DEFAULT 'all'::character varying,
    storage_asset_presets json,
    custom_css text,
    storage_default_folder uuid,
    basemaps json,
    mapbox_key character varying(255),
    module_bar json,
    project_descriptor character varying(100),
    default_language character varying(255) DEFAULT 'en-US'::character varying NOT NULL,
    custom_aspect_ratios json,
    public_favicon uuid,
    default_appearance character varying(255) DEFAULT 'auto'::character varying NOT NULL,
    default_theme_light character varying(255),
    theme_light_overrides json,
    default_theme_dark character varying(255),
    theme_dark_overrides json,
    report_error_url character varying(255),
    report_bug_url character varying(255),
    report_feature_url character varying(255),
    public_registration boolean DEFAULT false NOT NULL,
    public_registration_verify_email boolean DEFAULT true NOT NULL,
    public_registration_role uuid,
    public_registration_email_filter json,
    visual_editor_urls json,
    project_id uuid,
    mcp_enabled boolean DEFAULT false NOT NULL,
    mcp_allow_deletes boolean DEFAULT false NOT NULL,
    mcp_prompts_collection character varying(255) DEFAULT NULL::character varying,
    mcp_system_prompt_enabled boolean DEFAULT true NOT NULL,
    mcp_system_prompt text,
    project_owner character varying(255),
    project_usage character varying(255),
    org_name character varying(255),
    product_updates boolean,
    project_status character varying(255)
);


ALTER TABLE public.directus_settings OWNER TO directus;

--
-- Name: directus_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_settings_id_seq OWNER TO directus;

--
-- Name: directus_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_settings_id_seq OWNED BY public.directus_settings.id;


--
-- Name: directus_shares; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_shares (
    id uuid NOT NULL,
    name character varying(255),
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    role uuid,
    password character varying(255),
    user_created uuid,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_start timestamp with time zone,
    date_end timestamp with time zone,
    times_used integer DEFAULT 0,
    max_uses integer
);


ALTER TABLE public.directus_shares OWNER TO directus;

--
-- Name: directus_translations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_translations (
    id uuid NOT NULL,
    language character varying(255) NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.directus_translations OWNER TO directus;

--
-- Name: directus_users; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_users (
    id uuid NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(128),
    password character varying(255),
    location character varying(255),
    title character varying(50),
    description text,
    tags json,
    avatar uuid,
    language character varying(255) DEFAULT NULL::character varying,
    tfa_secret character varying(255),
    status character varying(16) DEFAULT 'active'::character varying NOT NULL,
    role uuid,
    token character varying(255),
    last_access timestamp with time zone,
    last_page character varying(255),
    provider character varying(128) DEFAULT 'default'::character varying NOT NULL,
    external_identifier character varying(255),
    auth_data json,
    email_notifications boolean DEFAULT true,
    appearance character varying(255),
    theme_dark character varying(255),
    theme_light character varying(255),
    theme_light_overrides json,
    theme_dark_overrides json,
    text_direction character varying(255) DEFAULT 'auto'::character varying NOT NULL
);


ALTER TABLE public.directus_users OWNER TO directus;

--
-- Name: directus_versions; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_versions (
    id uuid NOT NULL,
    key character varying(64) NOT NULL,
    name character varying(255),
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    hash character varying(255),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid,
    user_updated uuid,
    delta json
);


ALTER TABLE public.directus_versions OWNER TO directus;

--
-- Name: directus_webhooks; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.directus_webhooks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    method character varying(10) DEFAULT 'POST'::character varying NOT NULL,
    url character varying(255) NOT NULL,
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    data boolean DEFAULT true NOT NULL,
    actions character varying(100) NOT NULL,
    collections character varying(255) NOT NULL,
    headers json,
    was_active_before_deprecation boolean DEFAULT false NOT NULL,
    migrated_flow uuid
);


ALTER TABLE public.directus_webhooks OWNER TO directus;

--
-- Name: directus_webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.directus_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_webhooks_id_seq OWNER TO directus;

--
-- Name: directus_webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.directus_webhooks_id_seq OWNED BY public.directus_webhooks.id;


--
-- Name: education; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.education (
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    degree_type character varying(255) DEFAULT NULL::character varying,
    description text,
    field_of_study character varying(255) DEFAULT NULL::character varying,
    graduation_date date,
    id integer NOT NULL,
    institution character varying(255) DEFAULT NULL::character varying NOT NULL,
    sort integer,
    start_date timestamp without time zone,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    summary character varying(80) DEFAULT NULL::character varying,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.education OWNER TO directus;

--
-- Name: education_accomplishments; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.education_accomplishments (
    accomplishments_id integer,
    education_id integer,
    id integer NOT NULL
);


ALTER TABLE public.education_accomplishments OWNER TO directus;

--
-- Name: education_accomplishments_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.education_accomplishments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.education_accomplishments_id_seq OWNER TO directus;

--
-- Name: education_accomplishments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.education_accomplishments_id_seq OWNED BY public.education_accomplishments.id;


--
-- Name: education_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.education_id_seq OWNER TO directus;

--
-- Name: education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.education_id_seq OWNED BY public.education.id;


--
-- Name: education_related_items; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.education_related_items (
    collection character varying(255) DEFAULT NULL::character varying,
    education_id integer,
    id integer NOT NULL,
    item character varying(255) DEFAULT NULL::character varying,
    sort integer
);


ALTER TABLE public.education_related_items OWNER TO directus;

--
-- Name: education_related_items_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.education_related_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.education_related_items_id_seq OWNER TO directus;

--
-- Name: education_related_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.education_related_items_id_seq OWNED BY public.education_related_items.id;


--
-- Name: identity; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.identity (
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    email character varying(255) DEFAULT NULL::character varying NOT NULL,
    first_name character varying(255) DEFAULT NULL::character varying NOT NULL,
    github_url character varying(255) DEFAULT NULL::character varying,
    id integer NOT NULL,
    last_name character varying(255) DEFAULT NULL::character varying NOT NULL,
    linkedin_url character varying(255) DEFAULT NULL::character varying,
    location character varying(255) DEFAULT NULL::character varying,
    phone character varying(255) DEFAULT NULL::character varying,
    profile_photo uuid,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    tagline character varying(255) DEFAULT NULL::character varying,
    user_created uuid,
    user_updated uuid,
    website_url character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.identity OWNER TO directus;

--
-- Name: identity_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.identity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.identity_id_seq OWNER TO directus;

--
-- Name: identity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.identity_id_seq OWNED BY public.identity.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.job_applications (
    application_date date,
    application_status character varying(255) DEFAULT 'applied'::character varying,
    company_name character varying(255) DEFAULT NULL::character varying NOT NULL,
    cover_letter_used_ integer,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    id integer NOT NULL,
    job_description text,
    position_title character varying(255) DEFAULT NULL::character varying NOT NULL,
    resume_used integer,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.job_applications OWNER TO directus;

--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_applications_id_seq OWNER TO directus;

--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: master_resume_system_docs; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.master_resume_system_docs (
    artifact_source character varying(255) DEFAULT NULL::character varying,
    artifact_type character varying(255) DEFAULT NULL::character varying,
    content text,
    conversation_context text,
    conversation_date date,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    id integer NOT NULL,
    implementation_notes text,
    key_decisions text,
    next_steps text,
    participants character varying(255) DEFAULT NULL::character varying,
    related_collections json,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    tags json,
    title character varying(255) DEFAULT NULL::character varying NOT NULL,
    user_created uuid,
    user_updated uuid,
    version character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.master_resume_system_docs OWNER TO directus;

--
-- Name: master_resume_system_docs_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.master_resume_system_docs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.master_resume_system_docs_id_seq OWNER TO directus;

--
-- Name: master_resume_system_docs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.master_resume_system_docs_id_seq OWNED BY public.master_resume_system_docs.id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.positions (
    company integer,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    department character varying(255) DEFAULT NULL::character varying,
    description text,
    employment_type character varying(255) DEFAULT NULL::character varying,
    end_date date,
    id integer NOT NULL,
    is_current boolean DEFAULT false,
    primary_title character varying(255) DEFAULT NULL::character varying NOT NULL,
    sort integer,
    start_date date,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    summary character varying(80) DEFAULT NULL::character varying,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.positions OWNER TO directus;

--
-- Name: positions_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.positions_id_seq OWNER TO directus;

--
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.positions_id_seq OWNED BY public.positions.id;


--
-- Name: professional_summaries; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.professional_summaries (
    content text NOT NULL,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    id integer NOT NULL,
    is_default boolean DEFAULT false,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    target_industry character varying(255) DEFAULT NULL::character varying,
    target_role_type character varying(255) DEFAULT NULL::character varying,
    title character varying(255) DEFAULT NULL::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.professional_summaries OWNER TO directus;

--
-- Name: professional_summaries_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.professional_summaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professional_summaries_id_seq OWNER TO directus;

--
-- Name: professional_summaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.professional_summaries_id_seq OWNED BY public.professional_summaries.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.projects (
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    description text NOT NULL,
    end_date date,
    github_url character varying(255) DEFAULT NULL::character varying,
    id integer NOT NULL,
    is_featured boolean DEFAULT false,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    project_type character varying(255) DEFAULT NULL::character varying,
    project_url character varying(255) DEFAULT NULL::character varying,
    role character varying(255) DEFAULT NULL::character varying,
    sort integer,
    start_date date,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.projects OWNER TO directus;

--
-- Name: projects_companies; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.projects_companies (
    companies_id integer,
    id integer NOT NULL,
    projects_id integer,
    sort integer
);


ALTER TABLE public.projects_companies OWNER TO directus;

--
-- Name: projects_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.projects_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_companies_id_seq OWNER TO directus;

--
-- Name: projects_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.projects_companies_id_seq OWNED BY public.projects_companies.id;


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO directus;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: projects_positions; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.projects_positions (
    id integer NOT NULL,
    positions_id integer,
    projects_id integer,
    sort integer
);


ALTER TABLE public.projects_positions OWNER TO directus;

--
-- Name: projects_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.projects_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_positions_id_seq OWNER TO directus;

--
-- Name: projects_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.projects_positions_id_seq OWNED BY public.projects_positions.id;


--
-- Name: projects_skills; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.projects_skills (
    id integer NOT NULL,
    projects_id integer,
    skills_id integer,
    sort integer
);


ALTER TABLE public.projects_skills OWNER TO directus;

--
-- Name: projects_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.projects_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_skills_id_seq OWNER TO directus;

--
-- Name: projects_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.projects_skills_id_seq OWNED BY public.projects_skills.id;


--
-- Name: projects_technologies; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.projects_technologies (
    id integer NOT NULL,
    projects_id integer,
    sort integer,
    technologies_id integer
);


ALTER TABLE public.projects_technologies OWNER TO directus;

--
-- Name: projects_technologies_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.projects_technologies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_technologies_id_seq OWNER TO directus;

--
-- Name: projects_technologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.projects_technologies_id_seq OWNED BY public.projects_technologies.id;


--
-- Name: resumes; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.resumes (
    ai_prompt text,
    content text NOT NULL,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    generated_by_ai boolean DEFAULT false,
    id integer NOT NULL,
    parent_resume integer,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    target_company character varying(255) DEFAULT NULL::character varying,
    target_role character varying(255) DEFAULT NULL::character varying,
    title character varying(255) DEFAULT NULL::character varying NOT NULL,
    user_created uuid,
    user_updated uuid,
    version_number integer DEFAULT 1
);


ALTER TABLE public.resumes OWNER TO directus;

--
-- Name: resumes_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.resumes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resumes_id_seq OWNER TO directus;

--
-- Name: resumes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.resumes_id_seq OWNED BY public.resumes.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.skills (
    category character varying(255) DEFAULT NULL::character varying,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    id integer NOT NULL,
    is_core_skill boolean DEFAULT false,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    proficiency_level integer,
    sort integer,
    start_date date,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.skills OWNER TO directus;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO directus;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.system_settings (
    accent_color character varying(255) DEFAULT '#3B82F6'::character varying,
    background_primary character varying(255) DEFAULT '#FFFFFF'::character varying,
    background_secondary character varying(255) DEFAULT '#F9FAFB'::character varying,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    enable_animations boolean DEFAULT true,
    enable_dark_mode boolean DEFAULT false,
    font_mono character varying(255) DEFAULT 'Fira Code, Monaco, monospace'::character varying,
    font_primary character varying(255) DEFAULT 'Inter, system-ui, sans-serif'::character varying,
    font_secondary character varying(255) DEFAULT 'system-ui, sans-serif'::character varying,
    id integer NOT NULL,
    primary_color character varying(255) DEFAULT '#374151'::character varying,
    primary_dark character varying(255) DEFAULT '#1F2937'::character varying,
    primary_light character varying(255) DEFAULT '#6B7280'::character varying,
    site_name character varying(255) DEFAULT 'Jay Shoemaker Portfolio'::character varying,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    success_color character varying(255) DEFAULT '#10B981'::character varying,
    tagline character varying(255) DEFAULT 'Product Leader with an Entrepreneur''''''''s Heart'::character varying,
    text_primary character varying(255) DEFAULT '#111827'::character varying,
    text_secondary character varying(255) DEFAULT '#6B7280'::character varying,
    user_created uuid,
    user_updated uuid,
    warning_color character varying(255) DEFAULT '#F59E0B'::character varying
);


ALTER TABLE public.system_settings OWNER TO directus;

--
-- Name: system_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.system_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_settings_id_seq OWNER TO directus;

--
-- Name: system_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.system_settings_id_seq OWNED BY public.system_settings.id;


--
-- Name: technologies; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.technologies (
    category character varying(255) DEFAULT NULL::character varying,
    date_created timestamp with time zone,
    date_updated timestamp with time zone,
    icon uuid,
    id integer NOT NULL,
    is_current boolean DEFAULT false,
    last_used date,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    proficiency_level integer DEFAULT 5,
    "select" character varying(255) DEFAULT NULL::character varying,
    sort integer,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    user_created uuid,
    user_updated uuid,
    years_experience integer
);


ALTER TABLE public.technologies OWNER TO directus;

--
-- Name: technologies_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.technologies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.technologies_id_seq OWNER TO directus;

--
-- Name: technologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.technologies_id_seq OWNED BY public.technologies.id;


--
-- Name: accomplishment_variations id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishment_variations ALTER COLUMN id SET DEFAULT nextval('public.accomplishment_variations_id_seq'::regclass);


--
-- Name: accomplishments id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments ALTER COLUMN id SET DEFAULT nextval('public.accomplishments_id_seq'::regclass);


--
-- Name: accomplishments_projects id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_projects ALTER COLUMN id SET DEFAULT nextval('public.accomplishments_projects_id_seq'::regclass);


--
-- Name: accomplishments_skills id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_skills ALTER COLUMN id SET DEFAULT nextval('public.accomplishments_skills_id_seq'::regclass);


--
-- Name: accomplishments_technologies id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_technologies ALTER COLUMN id SET DEFAULT nextval('public.accomplishments_technologies_id_seq'::regclass);


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: cover_letters id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.cover_letters ALTER COLUMN id SET DEFAULT nextval('public.cover_letters_id_seq'::regclass);


--
-- Name: directus_fields id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_fields ALTER COLUMN id SET DEFAULT nextval('public.directus_fields_id_seq'::regclass);


--
-- Name: directus_notifications id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_notifications ALTER COLUMN id SET DEFAULT nextval('public.directus_notifications_id_seq'::regclass);


--
-- Name: directus_permissions id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_permissions ALTER COLUMN id SET DEFAULT nextval('public.directus_permissions_id_seq'::regclass);


--
-- Name: directus_presets id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_presets ALTER COLUMN id SET DEFAULT nextval('public.directus_presets_id_seq'::regclass);


--
-- Name: directus_relations id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_relations ALTER COLUMN id SET DEFAULT nextval('public.directus_relations_id_seq'::regclass);


--
-- Name: directus_settings id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings ALTER COLUMN id SET DEFAULT nextval('public.directus_settings_id_seq'::regclass);


--
-- Name: directus_webhooks id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_webhooks ALTER COLUMN id SET DEFAULT nextval('public.directus_webhooks_id_seq'::regclass);


--
-- Name: education id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education ALTER COLUMN id SET DEFAULT nextval('public.education_id_seq'::regclass);


--
-- Name: education_accomplishments id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_accomplishments ALTER COLUMN id SET DEFAULT nextval('public.education_accomplishments_id_seq'::regclass);


--
-- Name: education_related_items id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_related_items ALTER COLUMN id SET DEFAULT nextval('public.education_related_items_id_seq'::regclass);


--
-- Name: identity id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.identity ALTER COLUMN id SET DEFAULT nextval('public.identity_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: master_resume_system_docs id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.master_resume_system_docs ALTER COLUMN id SET DEFAULT nextval('public.master_resume_system_docs_id_seq'::regclass);


--
-- Name: positions id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.positions ALTER COLUMN id SET DEFAULT nextval('public.positions_id_seq'::regclass);


--
-- Name: professional_summaries id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.professional_summaries ALTER COLUMN id SET DEFAULT nextval('public.professional_summaries_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: projects_companies id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_companies ALTER COLUMN id SET DEFAULT nextval('public.projects_companies_id_seq'::regclass);


--
-- Name: projects_positions id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_positions ALTER COLUMN id SET DEFAULT nextval('public.projects_positions_id_seq'::regclass);


--
-- Name: projects_skills id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_skills ALTER COLUMN id SET DEFAULT nextval('public.projects_skills_id_seq'::regclass);


--
-- Name: projects_technologies id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_technologies ALTER COLUMN id SET DEFAULT nextval('public.projects_technologies_id_seq'::regclass);


--
-- Name: resumes id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.resumes ALTER COLUMN id SET DEFAULT nextval('public.resumes_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: system_settings id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.system_settings ALTER COLUMN id SET DEFAULT nextval('public.system_settings_id_seq'::regclass);


--
-- Name: technologies id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.technologies ALTER COLUMN id SET DEFAULT nextval('public.technologies_id_seq'::regclass);


--
-- Data for Name: accomplishment_variations; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.accomplishment_variations (accomplishment, context, date_created, date_updated, description, id, is_primary, sort, status, title, tone, user_created, user_updated) FROM stdin;
\.


--
-- Data for Name: accomplishments; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.accomplishments (accomplishment_type, approximate_date, date_achieved, date_created, date_updated, evidence_links, id, impact_metrics, is_featured, "position", primary_description, primary_title, sort, status, user_created, user_updated) FROM stdin;
award	\N	2010-03-15	2025-12-08 19:50:46.011+00	\N	\N	1	\N	t	7	<p>Won the prestigious Golden Carrot Award for Best Comedic Performance in an Animated Short at the Toontown Film Festival.</p>	Golden Carrot Award - Best Comedic Performance	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
initiative	\N	2024-06-01	2025-12-08 19:50:46.017+00	\N	\N	2	Reduced animation render times by 40%	t	2	<p>Spearheaded the implementation of a cloud-based rendering pipeline, reducing animation render times by 40% and enabling real-time collaboration across global teams.</p>	Implemented Cloud Rendering Pipeline	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
achievement	\N	2023-09-01	2025-12-08 19:50:46.02+00	\N	\N	3	25% increase in user retention	t	2	<p>Increased user retention rates by 25% through improved onboarding flows and personalized feature recommendations.</p>	Increased User Retention	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
project	\N	2018-01-01	2025-12-08 19:50:46.023+00	\N	\N	4	Streamlined production workflow for 50+ animators	t	4	<p>Designed and implemented a custom project management system for animation production, streamlining workflows for over 50 animators and reducing project delivery times by 30%.</p>	Built Animation Production Management System	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
achievement	\N	2019-01-01	2025-12-08 19:50:46.027+00	\N	\N	5	35% increase in audience engagement	t	\N	<p>Increased audience engagement by 35% through innovative storytelling techniques and interactive content formats.</p>	Increased Audience Engagement	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
project	\N	2017-01-01	2025-12-08 19:50:46.029+00	\N	\N	6	50,000+ downloads in first month	t	4	<p>Led product development for a mobile animation app, achieving 50,000+ downloads in the first month and a 4.8-star rating on app stores.</p>	Launched Mobile Animation App	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
process_improvement	\N	2022-01-01	2025-12-08 19:50:46.031+00	\N	\N	7	20% improvement in show scheduling efficiency	t	5	<p>Optimized entertainment scheduling system, improving show scheduling efficiency by 20% and reducing guest wait times.</p>	Improved Entertainment Scheduling	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
achievement	\N	2014-06-01	2025-12-08 19:50:46.035+00	\N	\N	8	3 million views on premiere episode	t	5	<p>Directed an animated series that achieved 3 million views on its premiere episode, becoming the most-watched debut in studio history.</p>	Record-Breaking Series Premiere	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
achievement	\N	2015-07-01	2025-12-08 19:50:46.037+00	\N	\N	9	\N	f	7	<p>Founded Rabbit Productions LLC, establishing a full-service animation production company.</p>	Founded Rabbit Productions LLC	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
award	\N	2005-05-01	2025-12-08 19:50:46.039+00	\N	\N	10	\N	t	\N	<p>Graduated with honors from Toontown University, receiving the Dean's Award for Excellence in Animation Arts.</p>	Dean's Award for Excellence in Animation Arts	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
\.


--
-- Data for Name: accomplishments_projects; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.accomplishments_projects (accomplishments_id, id, projects_id, sort) FROM stdin;
\.


--
-- Data for Name: accomplishments_skills; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.accomplishments_skills (accomplishments_id, id, skills_id, sort) FROM stdin;
1	1	12	\N
1	2	6	\N
2	3	5	\N
2	4	4	\N
3	5	2	\N
3	6	7	\N
3	7	9	\N
4	8	2	\N
4	9	5	\N
4	10	4	\N
5	11	12	\N
5	12	7	\N
6	13	2	\N
6	14	5	\N
6	15	6	\N
7	16	5	\N
7	17	7	\N
7	18	6	\N
8	19	12	\N
8	20	6	\N
8	21	11	\N
9	22	3	\N
9	23	6	\N
9	24	10	\N
10	25	11	\N
10	26	12	\N
\.


--
-- Data for Name: accomplishments_technologies; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.accomplishments_technologies (accomplishments_id, id, technologies_id) FROM stdin;
1	1	12
2	2	2
2	3	4
2	4	13
3	5	9
3	6	6
4	7	4
4	8	13
4	9	1
4	10	6
5	11	9
5	12	12
6	13	4
6	14	8
6	15	2
6	16	11
7	17	6
7	18	10
8	19	12
10	20	12
\.


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.certifications (date_created, date_updated, id, is_active, issue_date, issuing_organization, name, sort, status, user_created, user_updated) FROM stdin;
2025-12-08 19:50:58.112+00	\N	1	t	2020-06-15	Scrum.org	Professional Scrum Master I (PSM I)	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2025-12-08 19:50:58.117+00	\N	2	t	2019-03-01	Animation Guild	Certified Animation Director	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2025-12-08 19:50:58.119+00	\N	3	t	2022-09-01	Product School	Product Management Certificate	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.companies (date_created, date_updated, description, id, industry, location, logo, name, size, sort, status, user_created, user_updated, website) FROM stdin;
2025-12-08 18:29:38.014+00	\N	The premier cartoon production studio in Toontown	2	Entertainment/Animation	Hollywood, CA	\N	Maroon Cartoon Studios	large	1	published	\N	\N	www.marooncartoons.example.com
2025-12-08 18:29:38.016+00	\N	Animation software and tools for the modern creator	3	Technology/SaaS	Toontown, CA	\N	ToonTech Solutions	startup	2	published	\N	\N	www.toontech.example.com
2025-12-08 18:29:38.018+00	\N	Full-service animation and entertainment production	4	Entertainment/Technology	Toontown, CA	\N	Rabbit Productions LLC	small	3	published	\N	\N	\N
2025-12-08 18:29:38.02+00	\N	Theme park entertainment and live performances	5	Entertainment	Anaheim, CA	\N	Acme Entertainment Corp	large	4	published	\N	\N	www.acme-entertainment.example.com
2025-12-08 18:29:38.021+00	\N	Higher education for animated arts	6	Education	Toontown, CA	\N	Toontown University	large	5	published	\N	\N	\N
\.


--
-- Data for Name: cover_letters; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.cover_letters (date_created, date_updated, id, parent_cover_letter, sort, status, user_created, user_updated) FROM stdin;
\.


--
-- Data for Name: directus_access; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_access (id, role, "user", policy, sort) FROM stdin;
a1e067d9-6c33-4112-8f64-5e2ea2ab96c6	\N	\N	abf8a154-5b1c-4a46-ac9c-7300570f4f17	1
a7ad8128-ad11-40e1-be6b-c2d7042c8c91	601db046-54d2-45a7-9eb4-428043625af6	\N	43f89e66-e878-49ee-9bd0-ccb4ba2d4193	\N
f48a5e7e-1273-4ff3-a762-0704a23cfd6f	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	43f89e66-e878-49ee-9bd0-ccb4ba2d4193	1
\.


--
-- Data for Name: directus_collections; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_collections (collection, icon, note, display_template, hidden, singleton, translations, archive_field, archive_app_filter, archive_value, unarchive_value, sort_field, accountability, color, item_duplication_fields, sort, "group", collapse, preview_url, versioning) FROM stdin;
accomplishments_projects	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
accomplishments_skills	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
accomplishments_technologies	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
education_accomplishments	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
education_related_items	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
identity	\N	\N	\N	f	t	\N	status	t	archived	draft	sort	all	\N	\N	1	\N	open	\N	f
job_applications	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	2	\N	open	\N	f
master_resume_system_docs	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	3	\N	open	\N	f
projects_companies	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
projects_positions	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
projects_skills	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
projects_technologies	import_export	\N	\N	t	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
system_settings	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	\N	\N	open	\N	f
accomplishments	\N	\N	{{primary_title}} @ {{position.company.name}}	f	f	\N	status	t	archived	draft	sort	all	\N	\N	5	identity	open	\N	f
certifications	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	7	identity	open	\N	f
companies	\N	\N	{{name}}	f	f	\N	status	t	archived	draft	sort	all	\N	\N	2	identity	open	{{name}}	f
education	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	3	identity	open	\N	f
professional_summaries	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	1	identity	open	\N	f
projects	\N	\N	{{name}}	f	f	\N	status	t	archived	draft	sort	all	\N	\N	4	identity	open	\N	f
skills	\N	\N	{{name}}	f	f	\N	status	t	archived	draft	sort	all	\N	\N	6	identity	open	\N	f
technologies	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	8	identity	open	\N	f
positions	\N	\N	{{primary_title}} - {{department}} - {{start_date}} - {{end_date}}	f	f	\N	status	t	archived	draft	sort	all	\N	\N	1	companies	open	\N	f
accomplishment_variations	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	1	accomplishments	open	\N	f
cover_letters	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	2	job_applications	open	\N	f
resumes	\N	\N	\N	f	f	\N	status	t	archived	draft	sort	all	\N	\N	1	job_applications	open	\N	f
\.


--
-- Data for Name: directus_comments; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_comments (id, collection, item, comment, date_created, date_updated, user_created, user_updated) FROM stdin;
\.


--
-- Data for Name: directus_dashboards; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_dashboards (id, name, icon, note, date_created, user_created, color) FROM stdin;
\.


--
-- Data for Name: directus_extensions; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_extensions (enabled, id, folder, source, bundle) FROM stdin;
t	8baecec6-3174-4b90-82f2-783ca5af500d	directus-extension-schema-sync	module	\N
\.


--
-- Data for Name: directus_fields; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_fields (id, collection, field, special, interface, options, display, display_options, readonly, hidden, sort, width, translations, note, conditions, required, "group", validation, validation_message, searchable) FROM stdin;
1	accomplishments_projects	accomplishments_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
2	accomplishments_projects	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
3	accomplishments_projects	projects_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
4	accomplishments_projects	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
5	accomplishments_skills	accomplishments_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
6	accomplishments_skills	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
7	accomplishments_skills	skills_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
8	accomplishments_skills	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
9	accomplishments_technologies	accomplishments_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
10	accomplishments_technologies	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
11	accomplishments_technologies	technologies_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
12	education_accomplishments	accomplishments_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
13	education_accomplishments	education_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
14	education_accomplishments	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
15	education_related_items	collection	\N	\N	\N	\N	\N	f	t	5	full	\N	\N	\N	f	\N	\N	\N	t
16	education_related_items	education_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
17	education_related_items	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
18	education_related_items	item	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
19	education_related_items	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
58	accomplishment_variations	accomplishment	m2o	select-dropdown-m2o	\N	\N	\N	f	f	13	full	\N	\N	\N	f	\N	\N	\N	t
62	accomplishment_variations	description	\N	input-rich-text-html	\N	\N	\N	f	f	10	full	\N	\N	\N	t	\N	\N	\N	t
38	accomplishments	accomplishment_variations	o2m	list-o2m	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
252	master_resume_system_docs	tags	\N	tags	\N	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
253	master_resume_system_docs	title	\N	input	\N	\N	\N	f	f	8	full	\N	\N	\N	t	\N	\N	\N	t
254	master_resume_system_docs	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
255	master_resume_system_docs	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
66	accomplishment_variations	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
68	accomplishment_variations	tone	\N	select-dropdown	{"choices":[{"text":"Data-driven","value":"data_driven"},{"text":"Creative","value":"creative"},{"text":"Leadership-focused","value":"leadership"},{"text":"Results-oriented","value":"results"},{"text":"Collaborative","value":"collaborative"},{"text":"Innovation-focused","value":"innovation"}]}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
70	accomplishment_variations	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
210	cover_letters	cover_letters	o2m	list-o2m	\N	\N	\N	f	f	9	full	\N	\N	\N	f	\N	\N	\N	t
213	cover_letters	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
59	accomplishment_variations	context	\N	select-dropdown	{"choices":[{"text":"Technical","value":"technical"},{"text":"Executive","value":"executive"},{"text":"General","value":"general"},{"text":"Sales-focused","value":"sales"},{"text":"Leadership","value":"leadership"},{"text":"Customer-focused","value":"customer"}]}	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
60	accomplishment_variations	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
61	accomplishment_variations	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
257	projects_companies	companies_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
258	projects_companies	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
259	projects_companies	projects_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
260	projects_companies	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
261	projects_positions	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
262	projects_positions	positions_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
263	projects_positions	projects_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
264	projects_positions	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
265	projects_skills	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
266	projects_skills	projects_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
267	projects_skills	skills_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
268	projects_skills	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
269	projects_technologies	id	\N	\N	\N	\N	\N	f	t	1	full	\N	\N	\N	f	\N	\N	\N	t
270	projects_technologies	projects_id	\N	\N	\N	\N	\N	f	t	2	full	\N	\N	\N	f	\N	\N	\N	t
271	projects_technologies	sort	\N	\N	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
272	projects_technologies	technologies_id	\N	\N	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
273	system_settings	accent_color	\N	input	\N	\N	\N	f	f	22	half	\N	Accent color for highlights	\N	f	\N	\N	\N	t
274	system_settings	background_primary	\N	input	\N	\N	\N	f	f	16	half	\N	Primary background color	\N	f	\N	\N	\N	t
275	system_settings	background_secondary	\N	input	\N	\N	\N	f	f	17	half	\N	Secondary background color	\N	f	\N	\N	\N	t
276	system_settings	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
277	system_settings	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
278	system_settings	enable_animations	\N	boolean	\N	\N	\N	f	f	20	half	\N	Enable site animations	\N	f	\N	\N	\N	t
279	system_settings	enable_dark_mode	\N	boolean	\N	\N	\N	f	f	21	half	\N	Enable dark mode toggle	\N	f	\N	\N	\N	t
280	system_settings	font_mono	\N	input	\N	\N	\N	f	f	12	half	\N	Monospace font family	\N	f	\N	\N	\N	t
281	system_settings	font_primary	\N	input	\N	\N	\N	f	f	10	half	\N	Primary font family	\N	f	\N	\N	\N	t
282	system_settings	font_secondary	\N	input	\N	\N	\N	f	f	11	half	\N	Secondary font family	\N	f	\N	\N	\N	t
283	system_settings	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
284	system_settings	primary_color	\N	input	\N	\N	\N	f	f	13	half	\N	Primary brand color	\N	f	\N	\N	\N	t
285	system_settings	primary_dark	\N	input	\N	\N	\N	f	f	15	half	\N	Dark primary color	\N	f	\N	\N	\N	t
286	system_settings	primary_light	\N	input	\N	\N	\N	f	f	14	half	\N	Light primary color	\N	f	\N	\N	\N	t
287	system_settings	site_name	\N	input	\N	\N	\N	f	f	8	half	\N	Main site title	\N	f	\N	\N	\N	t
288	system_settings	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
289	system_settings	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
290	system_settings	success_color	\N	input	\N	\N	\N	f	f	23	half	\N	Success/achievement color	\N	f	\N	\N	\N	t
292	system_settings	text_primary	\N	input	\N	\N	\N	f	f	18	half	\N	Primary text color	\N	f	\N	\N	\N	t
293	system_settings	text_secondary	\N	input	\N	\N	\N	f	f	19	half	\N	Secondary text color	\N	f	\N	\N	\N	t
63	accomplishment_variations	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
64	accomplishment_variations	is_primary	\N	boolean	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
65	accomplishment_variations	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
67	accomplishment_variations	title	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
37	accomplishments	accomplishment_type	\N	select-dropdown	{"choices":[{"text":"Achievement","value":"achievement"},{"text":"Project","value":"project"},{"text":"Initiative","value":"initiative"},{"text":"Award","value":"award"},{"text":"Recognition","value":"recognition"},{"text":"Process Improvement","value":"process_improvement"},{"text":"Cost Savings","value":"cost_savings"},{"text":"Revenue Growth","value":"revenue_growth"}]}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
39	accomplishments	approximate_date	\N	datetime	{"format":"short"}	\N	\N	f	f	23	full	\N	\N	\N	f	\N	\N	\N	t
40	accomplishments	date_achieved	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
41	accomplishments	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
42	accomplishments	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
43	accomplishments	education	m2m	list-m2m	\N	\N	\N	f	f	22	full	\N	\N	\N	f	\N	\N	\N	t
44	accomplishments	evidence_links	\N	input-code	{"language":"json"}	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
46	accomplishments	impact_metrics	\N	input-multiline	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
294	system_settings	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
295	system_settings	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
296	system_settings	warning_color	\N	input	\N	\N	\N	f	f	24	half	\N	Warning/attention color	\N	f	\N	\N	\N	t
69	accomplishment_variations	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
45	accomplishments	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
47	accomplishments	is_featured	\N	boolean	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
48	accomplishments	position	m2o	select-dropdown-m2o	\N	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
49	accomplishments	primary_description	\N	input-rich-text-html	\N	\N	\N	f	f	10	full	\N	\N	\N	t	\N	\N	\N	t
50	accomplishments	primary_title	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
51	accomplishments	related_projects	m2m	list-m2m	\N	\N	\N	f	f	20	full	\N	\N	\N	f	\N	\N	\N	t
52	accomplishments	related_skills	m2m	list-m2m	\N	related-values	{"template":"{{skills_id.name}}"}	f	f	21	full	\N	\N	\N	f	\N	\N	\N	t
53	accomplishments	related_technologies	m2m	list-m2m	\N	\N	\N	f	f	18	full	\N	\N	\N	f	\N	\N	\N	t
54	accomplishments	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
55	accomplishments	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
56	accomplishments	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
57	accomplishments	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
71	certifications	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
72	certifications	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
73	certifications	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
74	certifications	is_active	\N	boolean	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
75	certifications	issue_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	10	half	\N	\N	\N	f	\N	\N	\N	t
76	certifications	issuing_organization	\N	input	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
77	certifications	name	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
78	certifications	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
79	certifications	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
80	certifications	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
81	certifications	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
82	companies	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
83	companies	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
84	companies	description	\N	input-multiline	\N	\N	\N	f	f	13	full	\N	\N	\N	f	\N	\N	\N	t
85	companies	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
86	companies	industry	\N	input	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
87	companies	location	\N	input	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
88	companies	logo	file	file-image	\N	\N	\N	f	f	17	full	\N	\N	\N	f	\N	\N	\N	t
89	companies	name	\N	input	\N	\N	\N	f	f	8	half	[{"language":"en-US","translation":"Company"}]	\N	\N	t	\N	\N	\N	t
90	companies	positions	o2m	list-o2m	\N	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
91	companies	projects	m2m	list-m2m	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
94	companies	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
97	companies	website	\N	input	{"type":"url"}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
211	cover_letters	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
212	cover_letters	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
214	cover_letters	job_applications	o2m	list-o2m	\N	\N	\N	f	f	10	full	\N	\N	\N	f	\N	\N	\N	t
215	cover_letters	parent_cover_letter	m2o	select-dropdown-m2o	{"enableLink":true}	\N	\N	f	f	8	full	\N	\N	\N	f	\N	\N	\N	t
216	cover_letters	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
92	companies	size	\N	select-dropdown	{"choices":[{"text":"Startup (1-50)","value":"startup"},{"text":"Small (51-200)","value":"small"},{"text":"Mid-size (201-1000)","value":"midsize"},{"text":"Large (1001-5000)","value":"large"},{"text":"Enterprise (5000+)","value":"enterprise"}]}	\N	\N	f	f	10	half	\N	\N	\N	f	\N	\N	\N	t
93	companies	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
95	companies	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
96	companies	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
217	cover_letters	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
218	cover_letters	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
219	cover_letters	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
116	education	accomplishments	m2m	list-m2m	\N	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
117	education	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
118	education	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	9	half	\N	\N	\N	f	\N	\N	\N	t
119	education	degree_type	\N	select-dropdown	{"choices":[{"text":"High School Diploma","value":"high_school"},{"text":"Associate's Degree","value":"associates"},{"text":"Bachelor's Degree","value":"bachelors"},{"text":"Master's Degree","value":"masters"},{"text":"Doctorate/PhD","value":"doctorate"},{"text":"Certificate","value":"certificate"},{"text":"Bootcamp","value":"bootcamp"}]}	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
120	education	description	\N	input-rich-text-html	\N	\N	\N	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
121	education	field_of_study	\N	input	\N	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
122	education	graduation_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
123	education	id	\N	input	\N	\N	\N	t	t	3	full	\N	\N	\N	f	\N	\N	\N	t
124	education	institution	\N	input	\N	\N	\N	f	f	10	half	\N	\N	\N	t	\N	\N	\N	t
125	education	related_items	m2a	list-m2a	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
126	education	sort	\N	input	\N	\N	\N	f	t	5	full	\N	\N	\N	f	\N	\N	\N	t
127	education	start_date	\N	datetime	\N	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
128	education	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	4	full	\N	\N	\N	f	\N	\N	\N	t
129	education	summary	\N	input	\N	\N	\N	f	f	1	full	\N	\N	\N	f	\N	\N	\N	t
130	education	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
131	education	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	8	half	\N	\N	\N	f	\N	\N	\N	t
20	identity	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
21	identity	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
22	identity	email	\N	input	{"type":"email"}	\N	\N	f	f	11	half	\N	\N	\N	t	\N	\N	\N	t
23	identity	first_name	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
24	identity	github_url	\N	input	{"type":"url"}	\N	\N	f	f	15	half	\N	\N	\N	f	\N	\N	\N	t
25	identity	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
26	identity	last_name	\N	input	\N	\N	\N	f	f	9	half	\N	\N	\N	t	\N	\N	\N	t
27	identity	linkedin_url	\N	input	{"type":"url"}	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
28	identity	location	\N	input	\N	\N	\N	f	f	16	half	\N	\N	\N	f	\N	\N	\N	t
29	identity	phone	\N	input	{"type":"tel"}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
30	identity	profile_photo	file	file-image	\N	\N	\N	f	f	18	full	\N	\N	\N	f	\N	\N	\N	t
31	identity	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
32	identity	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
33	identity	tagline	\N	input	\N	\N	\N	f	f	10	full	\N	\N	\N	f	\N	\N	\N	t
34	identity	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
35	identity	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
36	identity	website_url	\N	input	{"type":"url"}	\N	\N	f	f	14	half	\N	\N	\N	f	\N	\N	\N	t
196	job_applications	application_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
197	job_applications	application_status	\N	select-dropdown	{"choices":[{"text":"Applied","value":"applied"},{"text":"Under Review","value":"under_review"},{"text":"Phone Screen","value":"phone_screen"},{"text":"Interview Scheduled","value":"interview_scheduled"},{"text":"Technical Interview","value":"technical_interview"},{"text":"Final Interview","value":"final_interview"},{"text":"Offer","value":"offer"},{"text":"Rejected","value":"rejected"},{"text":"Withdrawn","value":"withdrawn"}]}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
198	job_applications	company_name	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
199	job_applications	cover_letter_used_	m2o	select-dropdown-m2o	{"enableLink":true}	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
200	job_applications	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
201	job_applications	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
202	job_applications	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
203	job_applications	job_description	\N	input-rich-text-html	\N	\N	\N	f	f	10	full	\N	\N	\N	f	\N	\N	\N	t
204	job_applications	position_title	\N	input	\N	\N	\N	f	f	9	half	\N	\N	\N	t	\N	\N	\N	t
205	job_applications	resume_used	m2o	select-dropdown-m2o	\N	\N	\N	f	f	13	full	\N	\N	\N	f	\N	\N	\N	t
206	job_applications	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
207	job_applications	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
208	job_applications	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
209	job_applications	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
237	master_resume_system_docs	artifact_source	\N	select-dropdown	{"choices":[{"text":"Claude Conversation","value":"claude_conversation"},{"text":"Manual Entry","value":"manual_entry"},{"text":"Meeting Notes","value":"meeting_notes"},{"text":"Research","value":"research"}]}	\N	\N	f	f	19	half	\N	\N	\N	f	\N	\N	\N	t
238	master_resume_system_docs	artifact_type	\N	select-dropdown	{"choices":[{"text":"Database Schema","value":"database_schema"},{"text":"Feature Specification","value":"feature_spec"},{"text":"API Design","value":"api_design"},{"text":"UI/UX Design","value":"ui_design"},{"text":"Technical Documentation","value":"tech_docs"},{"text":"Requirements Document","value":"requirements"},{"text":"Architecture Design","value":"architecture"}]}	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
239	master_resume_system_docs	content	\N	input-rich-text-md	{"defaultView":"preview"}	\N	\N	f	f	10	full	\N	\N	\N	f	\N	\N	\N	t
240	master_resume_system_docs	conversation_context	\N	input-multiline	\N	\N	\N	f	f	12	full	\N	\N	\N	f	\N	\N	\N	t
241	master_resume_system_docs	conversation_date	\N	datetime	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
242	master_resume_system_docs	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
243	master_resume_system_docs	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
244	master_resume_system_docs	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
245	master_resume_system_docs	implementation_notes	\N	input-multiline	\N	\N	\N	f	f	20	full	\N	\N	\N	f	\N	\N	\N	t
246	master_resume_system_docs	key_decisions	\N	input-multiline	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
247	master_resume_system_docs	next_steps	\N	input-multiline	\N	\N	\N	f	f	17	full	\N	\N	\N	f	\N	\N	\N	t
248	master_resume_system_docs	participants	\N	input	\N	\N	\N	f	f	18	half	\N	\N	\N	f	\N	\N	\N	t
249	master_resume_system_docs	related_collections	\N	input-code	{"language":"json"}	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
250	master_resume_system_docs	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
251	master_resume_system_docs	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
256	master_resume_system_docs	version	\N	input	\N	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
98	positions	accomplishments	o2m	list-o2m	\N	\N	\N	f	f	17	full	\N	\N	\N	f	\N	\N	\N	t
100	positions	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
101	positions	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
102	positions	department	\N	input	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
103	positions	description	\N	input-rich-text-html	\N	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
104	positions	employment_type	\N	select-dropdown	{"choices":[{"text":"Full-time","value":"full_time"},{"text":"Part-time","value":"part_time"},{"text":"Contract","value":"contract"},{"text":"Freelance","value":"freelance"},{"text":"Internship","value":"internship"},{"text":"Temporary","value":"temporary"}]}	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
105	positions	end_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
106	positions	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
107	positions	is_current	\N	boolean	\N	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
108	positions	primary_title	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
109	positions	projects	m2m	list-m2m	\N	\N	\N	f	f	18	full	\N	\N	\N	f	\N	\N	\N	t
110	positions	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
111	positions	start_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	10	half	\N	\N	\N	f	\N	\N	\N	t
99	positions	company	m2o	select-dropdown-m2o	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
112	positions	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
113	positions	summary	\N	input	\N	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
114	positions	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
115	positions	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
132	professional_summaries	content	\N	input-rich-text-html	\N	\N	\N	f	f	10	full	\N	\N	\N	t	\N	\N	\N	t
133	professional_summaries	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
134	professional_summaries	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
135	professional_summaries	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
136	professional_summaries	is_default	\N	boolean	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
137	professional_summaries	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
138	professional_summaries	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
139	professional_summaries	target_industry	\N	input	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
140	professional_summaries	target_role_type	\N	input	\N	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
141	professional_summaries	title	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
142	professional_summaries	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
143	professional_summaries	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
144	projects	accomplishments	m2m	list-m2m	\N	\N	\N	f	f	17	full	\N	\N	\N	f	\N	\N	\N	t
145	projects	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
146	projects	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
147	projects	description	\N	input-rich-text-html	\N	\N	\N	f	f	10	full	\N	\N	\N	t	\N	\N	\N	t
148	projects	end_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	14	half	\N	\N	\N	f	\N	\N	\N	t
149	projects	github_url	\N	input	{"type":"url"}	\N	\N	f	f	16	half	\N	\N	\N	f	\N	\N	\N	t
150	projects	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
151	projects	is_featured	\N	boolean	\N	\N	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
152	projects	name	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
153	projects	project_type	\N	select-dropdown	{"choices":[{"text":"Product","value":"product"},{"text":"Campaign","value":"campaign"},{"text":"Internal Tool","value":"internal_tool"},{"text":"Website","value":"website"},{"text":"Mobile App","value":"mobile_app"},{"text":"Research","value":"research"},{"text":"Process Improvement","value":"process"}]}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
154	projects	project_url	\N	input	{"type":"url"}	\N	\N	f	f	15	half	\N	\N	\N	f	\N	\N	\N	t
155	projects	related_companies	m2m	list-m2m	\N	\N	\N	f	f	21	full	\N	\N	\N	f	\N	\N	\N	t
156	projects	related_positions	m2m	list-m2m	\N	\N	\N	f	f	20	full	\N	\N	\N	f	\N	\N	\N	t
157	projects	role	\N	input	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
158	projects	skills_demonstrated	m2m	list-m2m	\N	\N	\N	f	f	18	full	\N	\N	\N	f	\N	\N	\N	t
159	projects	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
160	projects	start_date	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
161	projects	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
164	projects	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
220	resumes	ai_prompt	\N	input-multiline	\N	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
221	resumes	content	\N	input-rich-text-html	\N	\N	\N	f	f	9	full	\N	\N	\N	t	\N	\N	\N	t
230	resumes	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
235	resumes	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
165	skills	accomplishments	m2m	list-m2m	\N	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
162	projects	technologies_used	m2m	list-m2m	\N	\N	\N	f	f	19	full	\N	\N	\N	f	\N	\N	\N	t
163	projects	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
222	resumes	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
223	resumes	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
224	resumes	generated_by_ai	\N	boolean	\N	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
225	resumes	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
226	resumes	job_applications	o2m	list-o2m	\N	\N	\N	f	f	17	full	\N	\N	\N	f	\N	\N	\N	t
227	resumes	parent_resume	m2o	select-dropdown-m2o	\N	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
228	resumes	resumes	o2m	list-o2m	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
229	resumes	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
231	resumes	target_company	\N	input	\N	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
232	resumes	target_role	\N	input	\N	\N	\N	f	f	10	half	\N	\N	\N	f	\N	\N	\N	t
233	resumes	title	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
234	resumes	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
236	resumes	version_number	\N	input	{"min":"1"}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
166	skills	category	\N	select-dropdown	{"choices":[{"text":"Technical","value":"technical"},{"text":"Leadership","value":"leadership"},{"text":"Communication","value":"communication"},{"text":"Design","value":"design"},{"text":"Business","value":"business"},{"text":"Project Management","value":"project_management"},{"text":"Analytics","value":"analytics"}]}	formatted-value	\N	f	f	10	half	\N	\N	\N	f	\N	\N	\N	t
167	skills	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
168	skills	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	8	half	\N	\N	\N	f	\N	\N	\N	t
169	skills	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
170	skills	is_core_skill	\N	boolean	\N	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
171	skills	name	\N	input	\N	\N	\N	f	f	9	half	\N	\N	\N	t	\N	\N	\N	t
172	skills	proficiency_level	\N	select-dropdown	{"choices":[{"text":"1 - Beginner","value":"1"},{"text":"2 - Basic","value":"2"},{"text":"3 - Intermediate","value":"3"},{"text":"4 - Advanced","value":"4"},{"text":"5 - Expert","value":"5"}]}	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
173	skills	projects	m2m	list-m2m	\N	\N	\N	f	f	13	full	\N	\N	\N	f	\N	\N	\N	t
174	skills	sort	\N	input	\N	\N	\N	f	t	4	full	\N	\N	\N	f	\N	\N	\N	t
175	skills	start_date	\N	datetime	\N	\N	\N	f	f	3	full	\N	\N	\N	f	\N	\N	\N	t
176	skills	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
177	skills	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
178	skills	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
291	system_settings	tagline	\N	input	\N	\N	\N	f	f	9	half	\N	Professional tagline	\N	f	\N	\N	\N	t
179	technologies	accomplishments	m2m	list-m2m	\N	\N	\N	f	f	15	full	\N	\N	\N	f	\N	\N	\N	t
180	technologies	category	\N	select-dropdown	{"choices":[{"text":"Programming Language","value":"language"},{"text":"Framework","value":"framework"},{"text":"Tool","value":"tool"},{"text":"Platform","value":"platform"},{"text":"Database","value":"database"},{"text":"Cloud Service","value":"cloud"},{"text":"Library","value":"library"}]}	labels	\N	f	f	9	half	\N	\N	\N	f	\N	\N	\N	t
181	technologies	date_created	date-created	datetime	\N	datetime	{"relative":true}	t	t	5	half	\N	\N	\N	f	\N	\N	\N	t
182	technologies	date_updated	date-updated	datetime	\N	datetime	{"relative":true}	t	t	7	half	\N	\N	\N	f	\N	\N	\N	t
183	technologies	icon	\N	file-image	\N	\N	\N	f	f	14	full	\N	\N	\N	f	\N	\N	\N	t
184	technologies	id	\N	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N	t
185	technologies	is_current	\N	boolean	\N	\N	\N	f	f	13	half	\N	\N	\N	f	\N	\N	\N	t
186	technologies	last_used	\N	datetime	{"includeSeconds":false}	\N	\N	f	f	12	half	\N	\N	\N	f	\N	\N	\N	t
187	technologies	name	\N	input	\N	\N	\N	f	f	8	half	\N	\N	\N	t	\N	\N	\N	t
188	technologies	proficiency_level	\N	select-dropdown	{"choices":[{"text":"1 - Beginner","value":"1"},{"text":"2 - Basic","value":"2"},{"text":"3 - Intermediate","value":"3"},{"text":"4 - Advanced","value":"4"},{"text":"5 - Expert","value":"5"}]}	formatted-value	{"choices":[{"text":"Expert","value":"5"}],"format":true}	f	f	10	half	\N	\N	\N	f	\N	\N	\N	t
189	technologies	projects	m2m	list-m2m	\N	\N	\N	f	f	16	full	\N	\N	\N	f	\N	\N	\N	t
190	technologies	select	\N	select-dropdown	{"choices":[{"text":"5","value":"Expert"}]}	\N	\N	f	f	17	full	\N	\N	\N	f	\N	\N	\N	t
191	technologies	sort	\N	input	\N	\N	\N	f	t	3	full	\N	\N	\N	f	\N	\N	\N	t
192	technologies	status	\N	select-dropdown	{"choices":[{"color":"var(--theme--primary)","text":"$t:published","value":"published"},{"color":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"color":"var(--theme--warning)","text":"$t:archived","value":"archived"}]}	labels	{"choices":[{"background":"var(--theme--primary-background)","color":"var(--theme--primary)","foreground":"var(--theme--primary)","text":"$t:published","value":"published"},{"background":"var(--theme--background-normal)","color":"var(--theme--foreground)","foreground":"var(--theme--foreground)","text":"$t:draft","value":"draft"},{"background":"var(--theme--warning-background)","color":"var(--theme--warning)","foreground":"var(--theme--warning)","text":"$t:archived","value":"archived"}],"showAsDot":true}	f	f	2	full	\N	\N	\N	f	\N	\N	\N	t
193	technologies	user_created	user-created	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	4	half	\N	\N	\N	f	\N	\N	\N	t
194	technologies	user_updated	user-updated	select-dropdown-m2o	{"template":"{{avatar}} {{first_name}} {{last_name}}"}	user	\N	t	t	6	half	\N	\N	\N	f	\N	\N	\N	t
195	technologies	years_experience	\N	input	{"min":"0"}	\N	\N	f	f	11	half	\N	\N	\N	f	\N	\N	\N	t
\.


--
-- Data for Name: directus_files; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_files (id, storage, filename_disk, filename_download, title, type, folder, uploaded_by, created_on, modified_by, modified_on, charset, filesize, width, height, duration, embed, description, location, tags, metadata, focal_point_x, focal_point_y, tus_id, tus_data, uploaded_on) FROM stdin;
\.


--
-- Data for Name: directus_flows; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_flows (id, name, icon, color, description, status, trigger, accountability, options, operation, date_created, user_created) FROM stdin;
\.


--
-- Data for Name: directus_folders; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_folders (id, name, parent) FROM stdin;
\.


--
-- Data for Name: directus_migrations; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_migrations (version, name, "timestamp") FROM stdin;
20201028A	Remove Collection Foreign Keys	2025-12-08 18:29:29.750193+00
20201029A	Remove System Relations	2025-12-08 18:29:29.75742+00
20201029B	Remove System Collections	2025-12-08 18:29:29.762249+00
20201029C	Remove System Fields	2025-12-08 18:29:29.767629+00
20201105A	Add Cascade System Relations	2025-12-08 18:29:29.815313+00
20201105B	Change Webhook URL Type	2025-12-08 18:29:29.821373+00
20210225A	Add Relations Sort Field	2025-12-08 18:29:29.826992+00
20210304A	Remove Locked Fields	2025-12-08 18:29:29.829649+00
20210312A	Webhooks Collections Text	2025-12-08 18:29:29.834986+00
20210331A	Add Refresh Interval	2025-12-08 18:29:29.83716+00
20210415A	Make Filesize Nullable	2025-12-08 18:29:29.842508+00
20210416A	Add Collections Accountability	2025-12-08 18:29:29.846456+00
20210422A	Remove Files Interface	2025-12-08 18:29:29.848867+00
20210506A	Rename Interfaces	2025-12-08 18:29:29.864093+00
20210510A	Restructure Relations	2025-12-08 18:29:29.875464+00
20210518A	Add Foreign Key Constraints	2025-12-08 18:29:29.885217+00
20210519A	Add System Fk Triggers	2025-12-08 18:29:29.911527+00
20210521A	Add Collections Icon Color	2025-12-08 18:29:29.914546+00
20210525A	Add Insights	2025-12-08 18:29:29.940806+00
20210608A	Add Deep Clone Config	2025-12-08 18:29:29.943851+00
20210626A	Change Filesize Bigint	2025-12-08 18:29:29.972429+00
20210716A	Add Conditions to Fields	2025-12-08 18:29:29.975768+00
20210721A	Add Default Folder	2025-12-08 18:29:29.981409+00
20210802A	Replace Groups	2025-12-08 18:29:29.985573+00
20210803A	Add Required to Fields	2025-12-08 18:29:29.988113+00
20210805A	Update Groups	2025-12-08 18:29:29.991304+00
20210805B	Change Image Metadata Structure	2025-12-08 18:29:29.994878+00
20210811A	Add Geometry Config	2025-12-08 18:29:29.997112+00
20210831A	Remove Limit Column	2025-12-08 18:29:29.999401+00
20210903A	Add Auth Provider	2025-12-08 18:29:30.020025+00
20210907A	Webhooks Collections Not Null	2025-12-08 18:29:30.026708+00
20210910A	Move Module Setup	2025-12-08 18:29:30.030183+00
20210920A	Webhooks URL Not Null	2025-12-08 18:29:30.03599+00
20210924A	Add Collection Organization	2025-12-08 18:29:30.041029+00
20210927A	Replace Fields Group	2025-12-08 18:29:30.047126+00
20210927B	Replace M2M Interface	2025-12-08 18:29:30.049477+00
20210929A	Rename Login Action	2025-12-08 18:29:30.051713+00
20211007A	Update Presets	2025-12-08 18:29:30.056437+00
20211009A	Add Auth Data	2025-12-08 18:29:30.058673+00
20211016A	Add Webhook Headers	2025-12-08 18:29:30.060809+00
20211103A	Set Unique to User Token	2025-12-08 18:29:30.066266+00
20211103B	Update Special Geometry	2025-12-08 18:29:30.068665+00
20211104A	Remove Collections Listing	2025-12-08 18:29:30.07095+00
20211118A	Add Notifications	2025-12-08 18:29:30.095545+00
20211211A	Add Shares	2025-12-08 18:29:30.124387+00
20211230A	Add Project Descriptor	2025-12-08 18:29:30.128414+00
20220303A	Remove Default Project Color	2025-12-08 18:29:30.136305+00
20220308A	Add Bookmark Icon and Color	2025-12-08 18:29:30.139677+00
20220314A	Add Translation Strings	2025-12-08 18:29:30.143198+00
20220322A	Rename Field Typecast Flags	2025-12-08 18:29:30.147125+00
20220323A	Add Field Validation	2025-12-08 18:29:30.150614+00
20220325A	Fix Typecast Flags	2025-12-08 18:29:30.155006+00
20220325B	Add Default Language	2025-12-08 18:29:30.163697+00
20220402A	Remove Default Value Panel Icon	2025-12-08 18:29:30.170234+00
20220429A	Add Flows	2025-12-08 18:29:30.229779+00
20220429B	Add Color to Insights Icon	2025-12-08 18:29:30.232915+00
20220429C	Drop Non Null From IP of Activity	2025-12-08 18:29:30.235717+00
20220429D	Drop Non Null From Sender of Notifications	2025-12-08 18:29:30.238241+00
20220614A	Rename Hook Trigger to Event	2025-12-08 18:29:30.240603+00
20220801A	Update Notifications Timestamp Column	2025-12-08 18:29:30.246067+00
20220802A	Add Custom Aspect Ratios	2025-12-08 18:29:30.248459+00
20220826A	Add Origin to Accountability	2025-12-08 18:29:30.25151+00
20230401A	Update Material Icons	2025-12-08 18:29:30.257519+00
20230525A	Add Preview Settings	2025-12-08 18:29:30.259808+00
20230526A	Migrate Translation Strings	2025-12-08 18:29:30.272796+00
20230721A	Require Shares Fields	2025-12-08 18:29:30.278304+00
20230823A	Add Content Versioning	2025-12-08 18:29:30.302118+00
20230927A	Themes	2025-12-08 18:29:30.317722+00
20231009A	Update CSV Fields to Text	2025-12-08 18:29:30.321123+00
20231009B	Update Panel Options	2025-12-08 18:29:30.323563+00
20231010A	Add Extensions	2025-12-08 18:29:30.330258+00
20231215A	Add Focalpoints	2025-12-08 18:29:30.332614+00
20240122A	Add Report URL Fields	2025-12-08 18:29:30.33493+00
20240204A	Marketplace	2025-12-08 18:29:30.363186+00
20240305A	Change Useragent Type	2025-12-08 18:29:30.370485+00
20240311A	Deprecate Webhooks	2025-12-08 18:29:30.37899+00
20240422A	Public Registration	2025-12-08 18:29:30.383811+00
20240515A	Add Session Window	2025-12-08 18:29:30.386659+00
20240701A	Add Tus Data	2025-12-08 18:29:30.389183+00
20240716A	Update Files Date Fields	2025-12-08 18:29:30.394063+00
20240806A	Permissions Policies	2025-12-08 18:29:30.44173+00
20240817A	Update Icon Fields Length	2025-12-08 18:29:30.463625+00
20240909A	Separate Comments	2025-12-08 18:29:30.481984+00
20240909B	Consolidate Content Versioning	2025-12-08 18:29:30.484955+00
20240924A	Migrate Legacy Comments	2025-12-08 18:29:30.489794+00
20240924B	Populate Versioning Deltas	2025-12-08 18:29:30.493088+00
20250224A	Visual Editor	2025-12-08 18:29:30.496213+00
20250609A	License Banner	2025-12-08 18:29:30.499378+00
20250613A	Add Project ID	2025-12-08 18:29:30.513182+00
20250718A	Add Direction	2025-12-08 18:29:30.515502+00
20250813A	Add MCP	2025-12-08 18:29:30.518897+00
20251012A	Add Field Searchable	2025-12-08 18:29:30.521568+00
20251014A	Add Project Owner	2025-12-08 18:29:30.60467+00
20251028A	Add Retention Indexes	2025-12-08 18:29:30.666767+00
\.


--
-- Data for Name: directus_notifications; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_notifications (id, "timestamp", status, recipient, sender, subject, message, collection, item) FROM stdin;
\.


--
-- Data for Name: directus_operations; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created) FROM stdin;
\.


--
-- Data for Name: directus_panels; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_panels (id, dashboard, name, icon, color, show_header, note, type, position_x, position_y, width, height, options, date_created, user_created) FROM stdin;
\.


--
-- Data for Name: directus_permissions; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_permissions (id, collection, action, permissions, validation, presets, fields, policy) FROM stdin;
\.


--
-- Data for Name: directus_policies; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_policies (id, name, icon, description, ip_access, enforce_tfa, admin_access, app_access) FROM stdin;
abf8a154-5b1c-4a46-ac9c-7300570f4f17	$t:public_label	public	$t:public_description	\N	f	f	f
43f89e66-e878-49ee-9bd0-ccb4ba2d4193	Administrator	verified	$t:admin_description	\N	f	t	t
\.


--
-- Data for Name: directus_presets; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_presets (id, bookmark, "user", role, collection, search, layout, layout_query, layout_options, refresh_interval, filter, icon, color) FROM stdin;
1	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	directus_users	\N	cards	{"cards":{"sort":["email"],"page":1}}	{"cards":{"icon":"account_circle","title":"{{ first_name }} {{ last_name }}","subtitle":"{{ email }}","size":4}}	\N	\N	bookmark	\N
\.


--
-- Data for Name: directus_relations; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_relations (id, many_collection, many_field, one_collection, one_field, one_collection_field, one_allowed_collections, junction_field, sort_field, one_deselect_action) FROM stdin;
1	accomplishment_variations	accomplishment	accomplishments	accomplishment_variations	\N	\N	\N	\N	nullify
2	accomplishment_variations	user_created	directus_users	\N	\N	\N	\N	\N	nullify
3	accomplishment_variations	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
4	accomplishments	user_created	directus_users	\N	\N	\N	\N	\N	nullify
5	accomplishments	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
6	accomplishments	position	positions	accomplishments	\N	\N	\N	\N	nullify
7	accomplishments_projects	accomplishments_id	accomplishments	related_projects	\N	\N	projects_id	sort	nullify
8	accomplishments_projects	projects_id	projects	accomplishments	\N	\N	accomplishments_id	\N	nullify
9	accomplishments_skills	accomplishments_id	accomplishments	related_skills	\N	\N	skills_id	sort	nullify
10	accomplishments_skills	skills_id	skills	accomplishments	\N	\N	accomplishments_id	\N	nullify
11	accomplishments_technologies	accomplishments_id	accomplishments	related_technologies	\N	\N	technologies_id	\N	nullify
12	accomplishments_technologies	technologies_id	technologies	accomplishments	\N	\N	accomplishments_id	\N	nullify
13	certifications	user_created	directus_users	\N	\N	\N	\N	\N	nullify
14	certifications	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
15	companies	logo	directus_files	\N	\N	\N	\N	\N	nullify
16	companies	user_created	directus_users	\N	\N	\N	\N	\N	nullify
17	companies	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
18	cover_letters	parent_cover_letter	cover_letters	cover_letters	\N	\N	\N	\N	nullify
19	cover_letters	user_created	directus_users	\N	\N	\N	\N	\N	nullify
20	cover_letters	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
21	education	user_created	directus_users	\N	\N	\N	\N	\N	nullify
22	education	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
23	education_accomplishments	accomplishments_id	accomplishments	education	\N	\N	education_id	\N	nullify
24	education_accomplishments	education_id	education	accomplishments	\N	\N	accomplishments_id	\N	nullify
25	education_related_items	education_id	education	related_items	\N	\N	item	sort	nullify
26	education_related_items	item	\N	\N	collection	projects,accomplishments,skills,technologies	education_id	\N	nullify
27	identity	profile_photo	directus_files	\N	\N	\N	\N	\N	nullify
28	identity	user_created	directus_users	\N	\N	\N	\N	\N	nullify
29	identity	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
30	job_applications	cover_letter_used_	cover_letters	job_applications	\N	\N	\N	\N	nullify
31	job_applications	user_created	directus_users	\N	\N	\N	\N	\N	nullify
32	job_applications	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
33	job_applications	resume_used	resumes	job_applications	\N	\N	\N	\N	nullify
34	master_resume_system_docs	user_created	directus_users	\N	\N	\N	\N	\N	nullify
35	master_resume_system_docs	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
36	positions	company	companies	positions	\N	\N	\N	\N	nullify
37	positions	user_created	directus_users	\N	\N	\N	\N	\N	nullify
38	positions	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
39	professional_summaries	user_created	directus_users	\N	\N	\N	\N	\N	nullify
40	professional_summaries	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
41	projects	user_created	directus_users	\N	\N	\N	\N	\N	nullify
42	projects	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
43	projects_companies	companies_id	companies	projects	\N	\N	projects_id	\N	nullify
44	projects_companies	projects_id	projects	related_companies	\N	\N	companies_id	sort	nullify
45	projects_positions	positions_id	positions	projects	\N	\N	projects_id	\N	nullify
46	projects_positions	projects_id	projects	related_positions	\N	\N	positions_id	sort	nullify
47	projects_skills	projects_id	projects	skills_demonstrated	\N	\N	skills_id	sort	nullify
48	projects_skills	skills_id	skills	projects	\N	\N	projects_id	\N	nullify
49	projects_technologies	projects_id	projects	technologies_used	\N	\N	technologies_id	sort	nullify
50	projects_technologies	technologies_id	technologies	projects	\N	\N	projects_id	\N	nullify
51	resumes	user_created	directus_users	\N	\N	\N	\N	\N	nullify
52	resumes	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
53	resumes	parent_resume	resumes	resumes	\N	\N	\N	\N	nullify
54	skills	user_created	directus_users	\N	\N	\N	\N	\N	nullify
55	skills	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
56	system_settings	user_created	directus_users	\N	\N	\N	\N	\N	nullify
57	system_settings	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
58	technologies	user_created	directus_users	\N	\N	\N	\N	\N	nullify
59	technologies	user_updated	directus_users	\N	\N	\N	\N	\N	nullify
\.


--
-- Data for Name: directus_roles; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_roles (id, name, icon, description, parent) FROM stdin;
601db046-54d2-45a7-9eb4-428043625af6	Administrator	verified	$t:admin_description	\N
\.


--
-- Data for Name: directus_settings; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_settings (id, project_name, project_url, project_color, project_logo, public_foreground, public_background, public_note, auth_login_attempts, auth_password_policy, storage_asset_transform, storage_asset_presets, custom_css, storage_default_folder, basemaps, mapbox_key, module_bar, project_descriptor, default_language, custom_aspect_ratios, public_favicon, default_appearance, default_theme_light, theme_light_overrides, default_theme_dark, theme_dark_overrides, report_error_url, report_bug_url, report_feature_url, public_registration, public_registration_verify_email, public_registration_role, public_registration_email_filter, visual_editor_urls, project_id, mcp_enabled, mcp_allow_deletes, mcp_prompts_collection, mcp_system_prompt_enabled, mcp_system_prompt, project_owner, project_usage, org_name, product_updates, project_status) FROM stdin;
1	Directus	\N	#6644FF	\N	\N	\N	\N	25	\N	all	\N	\N	\N	\N	\N	\N	\N	en-US	\N	\N	auto	\N	\N	\N	\N	\N	\N	\N	f	t	\N	\N	\N	019aff39-d10e-70cd-8c63-8681e31e2f92	f	f	\N	t	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: directus_shares; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_shares (id, name, collection, item, role, password, user_created, date_created, date_start, date_end, times_used, max_uses) FROM stdin;
\.


--
-- Data for Name: directus_translations; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_translations (id, language, key, value) FROM stdin;
\.


--
-- Data for Name: directus_users; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_users (id, first_name, last_name, email, password, location, title, description, tags, avatar, language, tfa_secret, status, role, token, last_access, last_page, provider, external_identifier, auth_data, email_notifications, appearance, theme_dark, theme_light, theme_light_overrides, theme_dark_overrides, text_direction) FROM stdin;
97d0455c-b00a-4e3e-86f6-2d6d48409256	Admin	User	admin@example.com	$argon2id$v=19$m=65536,t=3,p=4$UKH70SJ0hmPM/EStsHrnhw$90Od5ebzug2h+7kFU4grp9BUwjt/GLvbOD82/7GvvwI	\N	\N	\N	\N	\N	\N	\N	active	601db046-54d2-45a7-9eb4-428043625af6	A4f4kcekfBBbAasr5syTzVqj3XT4uyPh	2025-12-08 20:08:52.651+00	/content/cover_letters	default	\N	\N	t	\N	\N	\N	\N	\N	auto
\.


--
-- Data for Name: directus_versions; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_versions (id, key, name, collection, item, hash, date_created, date_updated, user_created, user_updated, delta) FROM stdin;
\.


--
-- Data for Name: directus_webhooks; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.directus_webhooks (id, name, method, url, status, data, actions, collections, headers, was_active_before_deprecation, migrated_flow) FROM stdin;
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.education (date_created, date_updated, degree_type, description, field_of_study, graduation_date, id, institution, sort, start_date, status, summary, user_created, user_updated) FROM stdin;
2025-12-08 19:50:57.423+00	\N	bachelors	\N	Animation Arts	2005-05-01	2	Toontown University	\N	\N	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2025-12-08 19:50:57.427+00	\N	masters	\N	Entertainment Business Management	2012-12-01	3	Toontown University	\N	\N	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
\.


--
-- Data for Name: education_accomplishments; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.education_accomplishments (accomplishments_id, education_id, id) FROM stdin;
\.


--
-- Data for Name: education_related_items; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.education_related_items (collection, education_id, id, item, sort) FROM stdin;
\.


--
-- Data for Name: identity; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.identity (date_created, date_updated, email, first_name, github_url, id, last_name, linkedin_url, location, phone, profile_photo, sort, status, tagline, user_created, user_updated, website_url) FROM stdin;
2025-12-08 18:29:37.998+00	\N	roger.rabbit@toontown.example.com	Roger	https://github.com/rogerrabbit	1	Rabbit	https://www.linkedin.com/in/rogerrabbit	Toontown, CA	555-TOON-123	\N	\N	published	\N	\N	\N	https://www.rogerrabbit.example.com
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.job_applications (application_date, application_status, company_name, cover_letter_used_, date_created, date_updated, id, job_description, position_title, resume_used, sort, status, user_created, user_updated) FROM stdin;
\.


--
-- Data for Name: master_resume_system_docs; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.master_resume_system_docs (artifact_source, artifact_type, content, conversation_context, conversation_date, date_created, date_updated, id, implementation_notes, key_decisions, next_steps, participants, related_collections, sort, status, tags, title, user_created, user_updated, version) FROM stdin;
claude_conversation	database_schema	# Master Resume System - Directus Schema Design\n\n## Core Collections\n\n### 1. **Identity** (Singleton)\nPersonal information and contact details\n\n| Field | Type | Description |\n|---\n\n## Development & Knowledge Management\n\n### 17. **Conversation Artifacts**\nStore artifacts and decisions from development conversations\n\n| Field | Type | Description |\n|-------|------|-------------|\n| id | Primary Key | Auto-generated |\n| title | String | Artifact title/name |\n| artifact_type | String | Schema Design, Feature Spec, API Design, etc. |\n| content | Text (WYSIWYG) | Full artifact content (markdown/HTML) |\n| conversation_date | Date | When this conversation occurred |\n| conversation_context | Text | Brief context about what was being discussed |\n| version | String | Version number (e.g., "1.0", "2.1") |\n| status | String | Draft, Finalized, Implemented, Archived |\n| tags | Tags | Categorization tags |\n| related_collections | JSON | Which Directus collections this affects |\n| key_decisions | Text | Major decisions made in this conversation |\n| next_steps | Text | Action items or next development steps |\n| participants | String | Who was involved (e.g., "Jay + Claude") |\n| artifact_source | String | "Claude Conversation", "Manual Entry", etc. |\n| implementation_notes | Text | Notes about actual implementation |\n| created_by | Many-to-One | User who created this record | → directus_users |\n| updated_at | DateTime | Last modification |\n\n-------|------|-------------|\n| id | Primary Key | Auto-generated |\n| first_name | String | First name |\n| last_name | String | Last name |\n| email | Email | Primary email address |\n| phone | String | Phone number |\n| linkedin_url | URL | LinkedIn profile URL |\n| website_url | URL | Personal website/portfolio URL |\n| github_url | URL | GitHub profile (optional) |\n| location | String | Current location/city |\n| professional_summary | Text (Long) | Elevator pitch/professional summary |\n| profile_photo | File | Headshot for resumes |\n\n---\n\n### 2. **Companies**\nOrganizations where you've worked\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| name | String | Company name | |\n| industry | String | Industry/sector | |\n| size | String | Company size (startup, mid-size, enterprise) | |\n| location | String | Company location | |\n| website | URL | Company website | |\n| description | Text | Brief company description | |\n| logo | File | Company logo | |\n\n---\n\n### 3. **Positions**\nRoles held at companies\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| company | Many-to-One | Reference to company | → Companies |\n| title | String | Job title | |\n| department | String | Department/team | |\n| start_date | Date | Start date | |\n| end_date | Date | End date (null if current) | |\n| is_current | Boolean | Currently in this role | |\n| employment_type | String | Full-time, Contract, Part-time, etc. | |\n| description | Text | Role overview/responsibilities | |\n\n---\n\n### 4. **Accomplishments**\nIndividual achievements and wins\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| position | Many-to-One | Associated position | → Positions |\n| title | String | Brief accomplishment title | |\n| description | Text (Long) | Detailed description | |\n| impact_metrics | Text | Quantifiable results (revenue, %, etc.) | |\n| technologies_used | Many-to-Many | Technologies involved | → Technologies |\n| skills_demonstrated | Many-to-Many | Skills showcased | → Skills |\n| accomplishment_type | String | Achievement, Project, Initiative, Award, etc. | |\n| date_achieved | Date | When this was accomplished | |\n| is_featured | Boolean | Highlight for key accomplishments | |\n| evidence_links | JSON | Links to demos, articles, case studies | |\n\n---\n\n### 5. **Skills**\nTechnical and soft skills\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| name | String | Skill name | |\n| category | String | Technical, Leadership, Design, etc. | |\n| proficiency_level | Integer | 1-5 scale | |\n| years_experience | Integer | Years working with this skill | |\n| is_core_skill | Boolean | Primary/signature skill | |\n| description | Text | Context about experience with skill | |\n\n---\n\n### 6. **Technologies**\nTools, platforms, frameworks, languages\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| name | String | Technology name | |\n| category | String | Language, Framework, Tool, Platform | |\n| proficiency_level | Integer | 1-5 scale | |\n| years_experience | Integer | Years of experience | |\n| last_used | Date | When last used professionally | |\n| is_current | Boolean | Currently using | |\n| icon | File | Technology logo/icon | |\n\n---\n\n### 7. **Projects**\nPortfolio projects and case studies\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| position | Many-to-One | Associated position (optional) | → Positions |\n| name | String | Project name | |\n| description | Text (Long) | Project overview | |\n| role | String | Your role in the project | |\n| start_date | Date | Project start | |\n| end_date | Date | Project completion | |\n| technologies_used | Many-to-Many | Tech stack | → Technologies |\n| skills_demonstrated | Many-to-Many | Skills showcased | → Skills |\n| project_type | String | Product, Campaign, Internal Tool, etc. | |\n| project_url | URL | Live project link | |\n| github_url | URL | Code repository | |\n| case_study_url | URL | Detailed case study | |\n| images | Files | Screenshots, mockups | |\n| is_featured | Boolean | Portfolio highlight | |\n\n---\n\n### 8. **Education**\nAcademic background\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| institution | String | School/university name | |\n| degree_type | String | Bachelor's, Master's, Certificate, etc. | |\n| field_of_study | String | Major/concentration | |\n| graduation_date | Date | Graduation date | |\n| gpa | Decimal | GPA (optional) | |\n| honors | String | Honors, awards, distinctions | |\n| relevant_coursework | Text | Key courses | |\n| logo | File | Institution logo | |\n\n---\n\n### 9. **Certifications**\nProfessional certifications and licenses\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| name | String | Certification name | |\n| issuing_organization | String | Certifying body | |\n| issue_date | Date | Date received | |\n| expiration_date | Date | Expiration (if applicable) | |\n| credential_id | String | Certificate ID/number | |\n| credential_url | URL | Verification link | |\n| badge_image | File | Digital badge | |\n| is_active | Boolean | Currently valid | |\n\n---\n\n### 10. **Job Applications**\nTrack applications and AI-generated resumes\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| company_name | String | Target company | |\n| position_title | String | Role applied for | |\n| job_description | Text (Long) | Full job posting | |\n| application_date | Date | When applied | |\n| application_status | String | Applied, Interview, Offer, Rejected, etc. | |\n| generated_resume | File | AI-generated resume PDF | |\n| cover_letter | Text (Long) | Generated cover letter | |\n| selected_accomplishments | Many-to-Many | Accomplishments used | → Accomplishments |\n| selected_skills | Many-to-Many | Skills highlighted | → Skills |\n| selected_projects | Many-to-Many | Projects featured | → Projects |\n| notes | Text | Application notes/feedback | |\n| interview_dates | JSON | Interview schedule | |\n| salary_range | String | Salary expectations/offer | |\n\n---\n\n### 16. **Blog Posts** (Optional)\nProfessional blog content\n\n| Field | Type | Description | Relationships |\n|-------|------|-------------|---------------|\n| id | Primary Key | Auto-generated | |\n| title | String | Post title | |\n| slug | String | URL slug | |\n| content | Text (WYSIWYG) | Post content | |\n| excerpt | Text | Brief summary | |\n| featured_image | File | Header image | |\n| publish_date | DateTime | Publication date | |\n| status | String | Draft, Published, Archived | |\n| tags | Tags | Content tags | |\n| related_skills | Many-to-Many | Skills discussed | → Skills |\n| related_technologies | Many-to-Many | Technologies mentioned | → Technologies |\n| seo_title | String | SEO title | |\n| seo_description | String | Meta description | |\n\n---\n\n## Key Relationships Summary\n\n### Core Data Flow\n- **Companies** ← **Positions** ← **Accomplishments**\n- **Position Titles** → **Positions** (Multiple titles per position)\n- **Professional Summaries** (Multiple summaries for different contexts)\n- **Accomplishment Variations** → **Accomplishments** (Multiple ways to phrase accomplishments)\n\n### Cross-References\n- **Projects** ↔ **Positions** (Many-to-Many - projects can span multiple roles)\n- **Projects** ↔ **Companies** (Many-to-Many - projects can involve multiple companies)\n- **Projects** ↔ **Accomplishments** (Many-to-Many - projects can relate to multiple accomplishments)\n- **Accomplishments** ↔ **Skills** (Many-to-Many)\n- **Accomplishments** ↔ **Technologies** (Many-to-Many)\n- **Projects** ↔ **Skills** (Many-to-Many)\n- **Projects** ↔ **Technologies** (Many-to-Many)\n\n### Cover Letter Generation Junction Tables (with AI reasoning)\n\n#### Cover Letters ↔ Professional Summaries\n| Field | Type | Description |\n|-------|------|-------------|\n| cover_letter_id | Foreign Key | Reference to cover letter |\n| professional_summary_id | Foreign Key | Reference to summary |\n| ai_reasoning | Text | Why this summary was selected |\n| job_description_reference | Text | Specific parts of job description this addresses |\n\n#### Cover Letters ↔ Accomplishments\n| Field | Type | Description |\n|-------|------|-------------|\n| cover_letter_id | Foreign Key | Reference to cover letter |\n| accomplishment_id | Foreign Key | Reference to accomplishment |\n| ai_reasoning | Text | Why this accomplishment was selected |\n| job_description_reference | Text | Specific requirements this accomplishment demonstrates |\n| cover_letter_section | String | Where used (opening, body paragraph 1, body paragraph 2, closing) |\n\n#### Cover Letters ↔ Projects\n| Field | Type | Description |\n|-------|------|-------------|\n| cover_letter_id | Foreign Key | Reference to cover letter |\n| project_id | Foreign Key | Reference to project |\n| ai_reasoning | Text | Why this project was selected |\n| job_description_reference | Text | Specific requirements this project showcases |\n| cover_letter_section | String | Where used in the cover letter |\n\n#### Cover Letters ↔ Skills\n| Field | Type | Description |\n|-------|------|-------------|\n| cover_letter_id | Foreign Key | Reference to cover letter |\n| skill_id | Foreign Key | Reference to skill |\n| ai_reasoning | Text | Why this skill was selected |\n| job_description_reference | Text | Specific job requirements this skill matches |\n| cover_letter_section | String | Where mentioned in the cover letter |\n\n#### Cover Letters ↔ Technologies\n| Field | Type | Description |\n|-------|------|-------------|\n| cover_letter_id | Foreign Key | Reference to cover letter |\n| technology_id | Foreign Key | Reference to technology |\n| ai_reasoning | Text | Why this technology was selected |\n| job_description_reference | Text | Specific tech requirements this addresses |\n| cover_letter_section | String | Where mentioned in the cover letter |\n\n#### Cover Letters ↔ Companies (Previous Experience)\n| Field | Type | Description |\n|-------|------|-------------|\n| cover_letter_id | Foreign Key | Reference to cover letter |\n| company_id | Foreign Key | Reference to company |\n| ai_reasoning | Text | Why this company experience was highlighted |\n| job_description_reference | Text | How this experience relates to requirements |\n| cover_letter_section | String | Where mentioned in the cover letter |\n\n---\n\n## Cover Letter AI Generation Flow\n\n### 1. **Opening Strategy Selection**\n- Analyze company culture and role requirements\n- Choose appropriate tone (formal, conversational, innovative)\n- Select hook approach (shared connection, company admiration, relevant news, direct value proposition)\n\n### 2. **Content Structure Planning**\n- **Paragraph 1**: Opening hook + role interest + key value proposition\n- **Paragraph 2**: Most relevant accomplishment with specific metrics\n- **Paragraph 3**: Secondary accomplishment or project that demonstrates fit\n- **Paragraph 4**: Skills/technologies that directly match requirements\n- **Paragraph 5**: Company-specific interest and cultural fit\n- **Closing**: Call to action and professional sign-off\n\n### 3. **Intelligent Content Selection**\n- **Accomplishments**: Choose 2-3 most relevant with quantifiable results\n- **Projects**: Select 1-2 that best demonstrate required capabilities\n- **Skills**: Highlight those explicitly mentioned in job description\n- **Technologies**: Include tech stack matches\n- **Company Experience**: Reference relevant industry/company size experience\n\n### 4. **Personalization Elements**\n- **Company Research**: Reference recent news, mission, values, or initiatives\n- **Role Specifics**: Address specific challenges mentioned in job description\n- **Cultural Fit**: Demonstrate understanding of company culture\n- **Growth Story**: Show career progression relevant to this opportunity\n\n### 5. **Tone and Voice Adaptation**\n- **Startup**: Agile, innovative, adaptable language\n- **Enterprise**: Professional, structured, process-oriented\n- **Creative**: Passionate, vision-driven, collaborative\n- **Technical**: Precise, methodology-focused, results-driven\n\n---\n- **Resumes** → **Professional Summaries** (Which summary to use)\n- **Resumes** ↔ **Skills** (Which skills to feature)\n- **Resumes** ↔ **Technologies** (Which technologies to highlight)\n- **Resumes** ↔ **Accomplishments** (Which accomplishments to include)\n- **Resumes** ↔ **Projects** (Which projects to showcase)\n- **Resumes** ↔ **Education** (Which education to include)\n- **Resumes** ↔ **Certifications** (Which certifications to feature)\n- **Resumes** → **Resumes** (Parent-child for versioning)\n\n### Application Tracking\n- **Job Applications** → **Resumes** (Which resume was used)\n- **Job Applications** → **Cover Letters** (Which cover letter was used)\n- **Cover Letters** ↔ **Accomplishments** (Referenced accomplishments)\n- **Cover Letters** ↔ **Projects** (Referenced projects)\n\n## AI Integration Points\n\n1. **Resume Generation**: \n   - Analyze job description to select appropriate Professional Summaries (multiple)\n   - Blend selected summaries into cohesive, polished result\n   - Choose relevant Accomplishments (and their best variations)\n   - Select Position Titles that match the role\n   - Pick Skills and Technologies that align with requirements\n   - Generate full HTML resume stored in Resumes collection\n\n2. **Virtual Interview**: \n   - Query all collections to provide contextual answers\n   - Reference specific accomplishments and projects\n   - Adapt language based on accomplishment variations\n\n3. **Application Tracking**: \n   - Store complete resume snapshots (HTML) so they remain static\n   - Track which combinations work best for different role types\n   - Version control for iterative improvements\n\n4. **Content Arsenal**:\n   - Multiple professional summaries for different industries\n   - Position title variations for different contexts\n   - Accomplishment variations for different tones/audiences	Initial design session for Master Resume System database schema. Discussed AI-powered resume generation, content variations, and intelligent selection tracking.	2025-01-09	2025-12-08 18:29:37.97+00	\N	1	Schema designed to support AI-powered resume generation with full transparency into AI decision-making process. Focus on content reusability and tracking effectiveness.	- Separated resumes/cover letters from job applications for better tracking\n- Added junction tables with AI reasoning fields\n- Created content variation system (multiple summaries, titles, accomplishment versions)\n- Implemented many-to-many relationships for professional summaries in resumes\n- Added version control with parent-child relationships	1. Create Identity singleton collection\n2. Build Professional Summaries collection\n3. Create Companies and Positions collections\n4. Implement Skills and Technologies collections\n5. Set up accomplishments with variations\n6. Build resume generation system	Jay Shoemaker + Claude	["identity","professional_summaries","companies","positions","accomplishments","skills","technologies","projects","resumes","cover_letters","job_applications"]	\N	published	["database","schema","ai-resume","directus","master-resume-system"]	Master Resume System - Database Schema Design	\N	\N	1.0
claude_conversation	technical_documentation	<h1>Master Resume System - Implementation Next Steps</h1><p>Complete roadmap for implementing relationships, junction tables, and AI integration for the Master Resume System.</p><h2>Phase 1: Core Relationships (Manual Implementation Required)</h2><h3>1.1 Basic Many-to-One Relationships</h3><p>These need to be created manually in Directus admin:</p><table><tr><th>Collection</th><th>Field</th><th>Related Collection</th><th>Description</th></tr><tr><td>positions</td><td>company</td><td>companies</td><td>Link position to company</td></tr><tr><td>accomplishments</td><td>position</td><td>positions</td><td>Link accomplishment to position</td></tr><tr><td>accomplishment_variations</td><td>accomplishment</td><td>accomplishments</td><td>Link variation to main accomplishment</td></tr><tr><td>resumes</td><td>parent_resume</td><td>resumes</td><td>Version control - link to previous version</td></tr><tr><td>cover_letters</td><td>parent_cover_letter</td><td>cover_letters</td><td>Version control for cover letters</td></tr><tr><td>job_applications</td><td>resume_used</td><td>resumes</td><td>Which resume was submitted</td></tr><tr><td>job_applications</td><td>cover_letter_used</td><td>cover_letters</td><td>Which cover letter was submitted</td></tr></table><h3>1.2 Junction Tables for Many-to-Many Relationships</h3><p>Create these collections manually with the specified fields:</p><h4>accomplishments_skills</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>accomplishment_id</td><td>Many-to-One</td><td>Select Dropdown M2O → accomplishments</td></tr><tr><td>skill_id</td><td>Many-to-One</td><td>Select Dropdown M2O → skills</td></tr></table><h4>accomplishments_technologies</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>accomplishment_id</td><td>Many-to-One</td><td>Select Dropdown M2O → accomplishments</td></tr><tr><td>technology_id</td><td>Many-to-One</td><td>Select Dropdown M2O → technologies</td></tr></table><h4>accomplishments_projects</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>accomplishment_id</td><td>Many-to-One</td><td>Select Dropdown M2O → accomplishments</td></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td></tr></table><h4>projects_skills</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td></tr><tr><td>skill_id</td><td>Many-to-One</td><td>Select Dropdown M2O → skills</td></tr></table><h4>projects_technologies</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td></tr><tr><td>technology_id</td><td>Many-to-One</td><td>Select Dropdown M2O → technologies</td></tr></table><h4>projects_positions</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td></tr><tr><td>position_id</td><td>Many-to-One</td><td>Select Dropdown M2O → positions</td></tr></table><h4>projects_companies</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td></tr><tr><td>company_id</td><td>Many-to-One</td><td>Select Dropdown M2O → companies</td></tr></table><h2>Phase 2: Resume Generation Junction Tables (AI Decision Tracking)</h2><h3>2.1 Resume Selection Tracking</h3><p>These tables track what the AI selected and why:</p><h4>resumes_professional_summaries</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>professional_summary_id</td><td>Many-to-One</td><td>Select Dropdown M2O → professional_summaries</td><td>Reference to summary</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this summary was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific parts of job description this addresses</td></tr></table><h4>resumes_skills</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>skill_id</td><td>Many-to-One</td><td>Select Dropdown M2O → skills</td><td>Reference to skill</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this skill was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific job requirements this skill matches</td></tr></table><h4>resumes_technologies</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>technology_id</td><td>Many-to-One</td><td>Select Dropdown M2O → technologies</td><td>Reference to technology</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this technology was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific tech requirements this addresses</td></tr></table><h4>resumes_accomplishments</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>accomplishment_id</td><td>Many-to-One</td><td>Select Dropdown M2O → accomplishments</td><td>Reference to accomplishment</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this accomplishment was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific requirements this accomplishment demonstrates</td></tr></table><h4>resumes_projects</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td><td>Reference to project</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this project was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific requirements this project showcases</td></tr></table><h4>resumes_education</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>education_id</td><td>Many-to-One</td><td>Select Dropdown M2O → education</td><td>Reference to education</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this education was included</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Education requirements this addresses</td></tr></table><h4>resumes_certifications</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>resume_id</td><td>Many-to-One</td><td>Select Dropdown M2O → resumes</td><td>Reference to resume</td></tr><tr><td>certification_id</td><td>Many-to-One</td><td>Select Dropdown M2O → certifications</td><td>Reference to certification</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this certification was included</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Certification requirements this addresses</td></tr></table><h2>Phase 3: Cover Letter Collections & Relationships</h2><h3>3.1 Create Cover Letters Collection</h3><p>Add these fields to the existing cover_letters collection:</p><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>title</td><td>String</td><td>Input</td><td>Cover letter name/version</td></tr><tr><td>content</td><td>Text</td><td>WYSIWYG</td><td>Full HTML cover letter content</td></tr><tr><td>target_role</td><td>String</td><td>Input</td><td>Role this targets</td></tr><tr><td>target_company</td><td>String</td><td>Input</td><td>Company this targets</td></tr><tr><td>version_number</td><td>Integer</td><td>Input</td><td>Version tracking</td></tr><tr><td>generated_by_ai</td><td>Boolean</td><td>Boolean</td><td>AI-generated vs manual</td></tr><tr><td>ai_prompt</td><td>Text</td><td>Multiline</td><td>Prompt used for generation</td></tr></table><h3>3.2 Cover Letter Junction Tables</h3><h4>cover_letters_accomplishments</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>cover_letter_id</td><td>Many-to-One</td><td>Select Dropdown M2O → cover_letters</td><td>Reference to cover letter</td></tr><tr><td>accomplishment_id</td><td>Many-to-One</td><td>Select Dropdown M2O → accomplishments</td><td>Reference to accomplishment</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this accomplishment was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific requirements this demonstrates</td></tr><tr><td>cover_letter_section</td><td>String</td><td>Select Dropdown</td><td>Where used (opening, body paragraph 1, body paragraph 2, closing)</td></tr></table><h4>cover_letters_projects</h4><table><tr><th>Field</th><th>Type</th><th>Interface</th><th>Description</th></tr><tr><td>cover_letter_id</td><td>Many-to-One</td><td>Select Dropdown M2O → cover_letters</td><td>Reference to cover letter</td></tr><tr><td>project_id</td><td>Many-to-One</td><td>Select Dropdown M2O → projects</td><td>Reference to project</td></tr><tr><td>ai_reasoning</td><td>Text</td><td>Multiline Input</td><td>Why this project was selected</td></tr><tr><td>job_description_reference</td><td>Text</td><td>Multiline Input</td><td>Specific requirements this showcases</td></tr><tr><td>cover_letter_section</td><td>String</td><td>Select Dropdown</td><td>Where used in the cover letter</td></tr></table><h2>Phase 4: Data Entry Strategy</h2><h3>4.1 Recommended Order</h3><ol><li><strong>Identity</strong> - Add your personal information</li><li><strong>Companies</strong> - Add all companies you've worked for</li><li><strong>Positions</strong> - Link positions to companies</li><li><strong>Skills & Technologies</strong> - Build your expertise inventory</li><li><strong>Professional Summaries</strong> - Create 3-5 targeted summaries</li><li><strong>Accomplishments</strong> - Document all achievements</li><li><strong>Accomplishment Variations</strong> - Create alternative phrasings</li><li><strong>Projects</strong> - Add portfolio projects</li><li><strong>Education & Certifications</strong> - Academic and professional credentials</li></ol><h3>4.2 Content Strategy</h3><ul><li><strong>Professional Summaries</strong>: Create variations for AI-focused, electronics, marketing, leadership, startup contexts</li><li><strong>Accomplishments</strong>: Document 50+ achievements with quantifiable metrics</li><li><strong>Accomplishment Variations</strong>: Create technical, executive, and general versions of key accomplishments</li><li><strong>Skills Categorization</strong>: Organize by Technical, Leadership, Communication, Business, Analytics</li><li><strong>Technology Tracking</strong>: Include proficiency levels and last used dates</li></ul><h2>Phase 5: AI Integration Architecture</h2><h3>5.1 MCP/LlamaIndex Integration Points</h3><ul><li><strong>Resume Generation API</strong>: Query Directus for relevant content based on job description</li><li><strong>Content Selection Logic</strong>: AI analyzes job requirements and selects appropriate accomplishments, skills, summaries</li><li><strong>Junction Table Population</strong>: AI records reasoning for each selection in junction tables</li><li><strong>Version Control</strong>: Track parent-child relationships for resume iterations</li></ul><h3>5.2 Virtual Interview System</h3><ul><li><strong>Query Engine</strong>: LlamaIndex/LangChain queries across all collections</li><li><strong>Context Building</strong>: Combine accomplishments, projects, skills for comprehensive answers</li><li><strong>Response Personalization</strong>: Use actual experience data to generate authentic responses</li></ul><h2>Phase 6: Testing & Optimization</h2><h3>6.1 Data Validation</h3><ul><li>Ensure all relationships are properly connected</li><li>Test junction table queries</li><li>Validate AI reasoning field population</li></ul><h3>6.2 Performance Optimization</h3><ul><li>Index frequently queried fields</li><li>Optimize relationship queries</li><li>Test AI generation speed</li></ul><h2>Success Metrics</h2><ul><li><strong>Content Completeness</strong>: 50+ accomplishments, 20+ skills, 10+ technologies documented</li><li><strong>Variation Coverage</strong>: 3+ professional summaries, 2+ accomplishment variations per key achievement</li><li><strong>AI Transparency</strong>: 100% of AI selections include reasoning and job description references</li><li><strong>Application Tracking</strong>: Complete audit trail from job description to submitted resume</li></ul>	Documentation of next steps after creating all core collections for the Master Resume System. Comprehensive guide for implementing relationships, junction tables, and AI integration.	2025-09-10	2025-12-08 18:29:37.984+00	\N	4	This document provides the complete roadmap for taking the Master Resume System from basic collections to a fully functional AI-powered resume generation platform. Follow phases sequentially for best results.	- Manual relationship creation required due to API limitations\n- Junction tables will track AI decision reasoning\n- Phased implementation approach for manageable complexity\n- Content-first strategy before AI integration\n- Comprehensive tracking for optimization and learning	1. Create all relationship fields manually in Directus admin\n2. Build junction tables for many-to-many relationships\n3. Start data entry with core collections (Identity, Companies, Positions)\n4. Build content library (Skills, Accomplishments, Professional Summaries)\n5. Implement AI integration for resume generation\n6. Create virtual interview system\n7. Test and optimize system performance	Jay Shoemaker + Claude	["all collections","junction tables","relationships"]	\N	draft	["implementation","relationships","junction-tables","ai-integration","next-steps","roadmap"]	Master Resume System - Implementation Next Steps & Relationships	\N	\N	1.0
claude_conversation	technical_documentation	<h1>Many-to-Many Fields Quick Reference</h1><p>Simple guide for creating M2M fields - Directus creates junction tables automatically</p><h2>Phase 1: Core M2M Relationships</h2><h3>1. Start with: accomplishments</h3><ul><li><strong>Field Name:</strong> skills<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: skills</li><li>Junction Table: accomplishments_skills (auto-created)</li></ul></li><li><strong>Field Name:</strong> technologies<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: technologies</li><li>Junction Table: accomplishments_technologies (auto-created)</li></ul></li><li><strong>Field Name:</strong> projects<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: projects</li><li>Junction Table: accomplishments_projects (auto-created)</li></ul></li></ul><hr><h3>2. Start with: projects</h3><ul><li><strong>Field Name:</strong> skills<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: skills</li><li>Junction Table: projects_skills (auto-created)</li></ul></li><li><strong>Field Name:</strong> technologies<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: technologies</li><li>Junction Table: projects_technologies (auto-created)</li></ul></li><li><strong>Field Name:</strong> positions<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: positions</li><li>Junction Table: projects_positions (auto-created)</li></ul></li><li><strong>Field Name:</strong> companies<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: companies</li><li>Junction Table: projects_companies (auto-created)</li></ul></li></ul><hr><h2>Phase 2: AI Resume Generation M2M (Advanced)</h2><p><strong>Note:</strong> These need custom junction tables with ai_reasoning fields. Create these manually after Phase 1.</p><h3>3. Start with: resumes</h3><ul><li><strong>Field Name:</strong> professional_summaries_used<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: professional_summaries</li><li>Junction Table: resumes_professional_summaries</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li><li><strong>Field Name:</strong> skills_included<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: skills</li><li>Junction Table: resumes_skills</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li><li><strong>Field Name:</strong> technologies_included<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: technologies</li><li>Junction Table: resumes_technologies</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li><li><strong>Field Name:</strong> accomplishments_included<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: accomplishments</li><li>Junction Table: resumes_accomplishments</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li><li><strong>Field Name:</strong> projects_included<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: projects</li><li>Junction Table: resumes_projects</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li><li><strong>Field Name:</strong> education_included<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: education</li><li>Junction Table: resumes_education</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li><li><strong>Field Name:</strong> certifications_included<ul><li>Type: Many-to-Many (M2M)</li><li>Interface: List M2M</li><li>Related Collection: certifications</li><li>Junction Table: resumes_certifications</li><li><strong>Custom Fields Needed:</strong> ai_reasoning, job_description_reference</li></ul></li></ul><hr><h2>Basic M2O Relationships (Create First)</h2><h3>4. Start with: positions</h3><ul><li><strong>Field Name:</strong> company<ul><li>Type: Many-to-One (M2O)</li><li>Interface: Select Dropdown M2O</li><li>Related Collection: companies</li></ul></li></ul><h3>5. Start with: accomplishments</h3><ul><li><strong>Field Name:</strong> position<ul><li>Type: Many-to-One (M2O)</li><li>Interface: Select Dropdown M2O</li><li>Related Collection: positions</li></ul></li></ul><h3>6. Start with: accomplishment_variations</h3><ul><li><strong>Field Name:</strong> accomplishment<ul><li>Type: Many-to-One (M2O)</li><li>Interface: Select Dropdown M2O</li><li>Related Collection: accomplishments</li></ul></li></ul><h3>7. Start with: job_applications</h3><ul><li><strong>Field Name:</strong> resume_used<ul><li>Type: Many-to-One (M2O)</li><li>Interface: Select Dropdown M2O</li><li>Related Collection: resumes</li></ul></li><li><strong>Field Name:</strong> cover_letter_used<ul><li>Type: Many-to-One (M2O)</li><li>Interface: Select Dropdown M2O</li><li>Related Collection: cover_letters</li></ul></li></ul><h3>8. Start with: resumes</h3><ul><li><strong>Field Name:</strong> parent_resume<ul><li>Type: Many-to-One (M2O)</li><li>Interface: Select Dropdown M2O</li><li>Related Collection: resumes</li><li>Note: For version control</li></ul></li></ul><hr><h2>Directus UI Steps:</h2><ol><li><strong>Go to Collection:</strong> [Start with collection name above]</li><li><strong>Settings → Data Model → [Collection] → Add Field</strong></li><li><strong>Field Name:</strong> [Use exact name from above]</li><li><strong>Type:</strong> Many-to-Many or Many-to-One</li><li><strong>Interface:</strong> List M2M or Select Dropdown M2O</li><li><strong>Related Collection:</strong> [Target collection]</li><li><strong>Save Field</strong></li></ol><h2>Important Notes:</h2><ul><li><strong>Phase 1 First:</strong> Create basic M2O relationships before M2M</li><li><strong>Auto Junction Tables:</strong> Directus creates junction tables automatically for Phase 1</li><li><strong>Phase 2 Advanced:</strong> For AI tracking, you'll need to manually add ai_reasoning fields to the auto-created junction tables later</li><li><strong>Order Matters:</strong> Create M2O relationships first, then M2M relationships</li></ul><h2>Quick Checklist:</h2><h3>✅ M2O Relationships (Do First):</h3><ul><li>positions.company → companies</li><li>accomplishments.position → positions</li><li>accomplishment_variations.accomplishment → accomplishments</li><li>job_applications.resume_used → resumes</li><li>job_applications.cover_letter_used → cover_letters</li><li>resumes.parent_resume → resumes</li></ul><h3>✅ M2M Relationships (Do Second):</h3><ul><li>accomplishments.skills → skills</li><li>accomplishments.technologies → technologies</li><li>accomplishments.projects → projects</li><li>projects.skills → skills</li><li>projects.technologies → technologies</li><li>projects.positions → positions</li><li>projects.companies → companies</li></ul><h3>🔮 Advanced M2M (Do Later):</h3><ul><li>resumes.professional_summaries_used → professional_summaries</li><li>resumes.skills_included → skills</li><li>resumes.technologies_included → technologies</li><li>resumes.accomplishments_included → accomplishments</li><li>resumes.projects_included → projects</li><li>resumes.education_included → education</li><li>resumes.certifications_included → certifications</li></ul>	Quick reference guide for creating junction tables in Directus UI, extracted from the comprehensive implementation documentation.	2025-09-10	2025-12-08 18:29:37.988+00	\N	5	This approach leverages Directus auto-creation of junction tables for basic relationships, with manual customization only needed for AI tracking fields. Much simpler than creating all junction tables manually.	- Let Directus auto-create junction tables for basic M2M relationships\n- Create M2O relationships first, then M2M relationships\n- Advanced AI tracking fields need to be added manually to auto-created junction tables\n- Separated into phases for logical implementation order	1. Create all M2O relationships first\n2. Create basic M2M relationships (Phase 1)\n3. Test data entry and relationship functionality\n4. Add AI tracking fields to junction tables manually (Phase 2)\n5. Create advanced resume M2M relationships	Jay Shoemaker + Claude	["all junction tables","m2m relationships"]	\N	draft	["m2m-fields","relationships","quick-reference","directus-ui","auto-junction","m2o-fields"]	M2M Fields Quick Reference - Let Directus Handle Junction Tables	\N	\N	1.0
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.positions (company, date_created, date_updated, department, description, employment_type, end_date, id, is_current, primary_title, sort, start_date, status, summary, user_created, user_updated) FROM stdin;
6	2025-12-08 19:50:38.871+00	\N	\N	<p>Worked as a teaching assistant while pursuing my degree in Animation Arts. Helped students with animation techniques and software tools.</p>	part_time	2005-05-31	6	f	Teaching Assistant	\N	2003-09-01	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2	2025-12-08 19:50:38.881+00	\N	Animation	<p>Started my career as a cartoon performer at the legendary Maroon Cartoon Studios. Starred in numerous animated shorts alongside Baby Herman, bringing laughter to audiences worldwide.</p>	full_time	2012-12-31	7	f	Lead Cartoon Performer	\N	2005-06-01	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2	2025-12-08 19:50:38.884+00	\N	Production	<p>Transitioned from performing to directing, overseeing the creative vision for animated shorts. Managed teams of animators and coordinated with studio executives on production schedules.</p>	full_time	2015-06-30	8	f	Animation Director	\N	2013-01-01	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
4	2025-12-08 19:50:38.887+00	\N	\N	<p>Founded my own production company to create original animated content. Handled all aspects of the business from creative development to client relations and financial management.</p>	full_time	2020-12-31	4	f	Founder & Executive Producer	\N	2015-07-01	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
5	2025-12-08 19:50:38.889+00	\N	Entertainment	<p>Managed live entertainment operations including character performances, show scheduling, and guest experience optimization across multiple venue locations.</p>	full_time	2022-12-31	5	f	Entertainment Operations Manager	\N	2021-01-01	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
3	2025-12-08 19:50:38.892+00	\N	\N	<p>Leading product strategy and development for animation software tools. Working with engineering teams to build next-generation creative tools for animators and content creators worldwide.</p>	full_time	\N	2	t	Product Manager	\N	2023-01-01	published	\N	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
\.


--
-- Data for Name: professional_summaries; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.professional_summaries (content, date_created, date_updated, id, is_default, sort, status, target_industry, target_role_type, title, user_created, user_updated) FROM stdin;
<p>Dynamic and creative Product Manager with 15+ years of experience spanning entertainment, animation, and technology. Proven track record of transitioning from award-winning performer to successful business leader in the animation industry. Expert in product development, team leadership, and bringing creative visions to market. Strong background in Agile development, SaaS platforms, and digital transformation. Passionate about building tools that empower creators and delight audiences worldwide.</p>	2025-12-08 18:29:38.005+00	\N	2	t	\N	published	Technology/Entertainment	Product Management	Master Professional Summary	\N	\N
<p>Award-winning animation professional with extensive experience in directing, producing, and performing in animated content. Skilled in leading creative teams, managing production pipelines, and delivering high-quality entertainment that resonates with audiences. Combines artistic vision with business acumen to drive successful projects from concept to completion.</p>	2025-12-08 18:29:38.007+00	\N	3	f	\N	published	Entertainment/Animation	Creative Direction	Entertainment Industry Summary	\N	\N
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.projects (date_created, date_updated, description, end_date, github_url, id, is_featured, name, project_type, project_url, role, sort, start_date, status, user_created, user_updated) FROM stdin;
2025-12-08 19:50:56.717+00	\N	<p>Cloud-based animation software that enables real-time collaboration between animators worldwide. Features include frame-by-frame editing, automatic lip-sync, and AI-assisted in-betweening.</p>	\N	https://github.com/rogerrabbit/tooncloud	1	t	ToonCloud Animation Platform	product	https://tooncloud.example.com	Product Manager	\N	2023-01-01	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2025-12-08 19:50:56.723+00	\N	<p>Custom production management system for animation studios. Tracks projects from storyboard through final render with integrated asset management and team scheduling.</p>	2019-06-01	\N	2	t	Animation Studio Manager	internal_tool	\N	Product Owner & Designer	\N	2017-01-01	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2025-12-08 19:50:56.726+00	\N	<p>Mobile app for creating short animated clips. Features intuitive touch-based drawing tools and one-tap sharing to social media platforms.</p>	2018-12-01	\N	3	t	ToonSketch Mobile App	product	\N	Product Manager	\N	2016-06-01	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
2025-12-08 19:50:56.728+00	\N	<p>Portfolio website showcasing animation work and production services. Built with React and features an interactive demo reel player.</p>	2016-03-01	\N	4	t	Rabbit Productions Website	website	https://rabbitproductions.example.com	Designer & Developer	\N	2015-09-01	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
\.


--
-- Data for Name: projects_companies; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.projects_companies (companies_id, id, projects_id, sort) FROM stdin;
\.


--
-- Data for Name: projects_positions; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.projects_positions (id, positions_id, projects_id, sort) FROM stdin;
\.


--
-- Data for Name: projects_skills; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.projects_skills (id, projects_id, skills_id, sort) FROM stdin;
\.


--
-- Data for Name: projects_technologies; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.projects_technologies (id, projects_id, sort, technologies_id) FROM stdin;
\.


--
-- Data for Name: resumes; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.resumes (ai_prompt, content, date_created, date_updated, generated_by_ai, id, parent_resume, sort, status, target_company, target_role, title, user_created, user_updated, version_number) FROM stdin;
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.skills (category, date_created, date_updated, id, is_core_skill, name, proficiency_level, sort, start_date, status, user_created, user_updated) FROM stdin;
project_management	2025-12-08 19:50:55.211+00	\N	4	t	Agile Methodologies	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
business	2025-12-08 19:50:55.224+00	\N	3	t	Business Development	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
leadership	2025-12-08 19:50:55.227+00	\N	10	f	Business Plan Writing	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
business	2025-12-08 19:50:55.229+00	\N	9	t	Customer Success	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
analytics	2025-12-08 19:50:55.231+00	\N	7	t	Data Analytics	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
creative	2025-12-08 19:50:55.233+00	\N	11	t	Animation Direction	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
creative	2025-12-08 19:50:55.235+00	\N	12	t	Creative Production	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
leadership	2025-12-08 19:50:55.236+00	\N	6	t	Leadership	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
business	2025-12-08 19:50:55.238+00	\N	2	t	Product Management	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
project_management	2025-12-08 19:50:55.24+00	\N	5	t	Project Management	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.system_settings (accent_color, background_primary, background_secondary, date_created, date_updated, enable_animations, enable_dark_mode, font_mono, font_primary, font_secondary, id, primary_color, primary_dark, primary_light, site_name, sort, status, success_color, tagline, text_primary, text_secondary, user_created, user_updated, warning_color) FROM stdin;
\.


--
-- Data for Name: technologies; Type: TABLE DATA; Schema: public; Owner: directus
--

COPY public.technologies (category, date_created, date_updated, icon, id, is_current, last_used, name, proficiency_level, "select", sort, status, user_created, user_updated, years_experience) FROM stdin;
tool	2025-12-08 19:50:55.932+00	\N	\N	12	t	\N	Adobe Creative Suite	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	15
cloud	2025-12-08 19:50:55.944+00	\N	\N	2	t	\N	AWS	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	6
platform	2025-12-08 19:50:55.946+00	\N	\N	1	t	\N	Directus	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	2
tool	2025-12-08 19:50:55.948+00	\N	\N	11	t	\N	Figma	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	5
tool	2025-12-08 19:50:55.95+00	\N	\N	9	t	\N	Google Analytics	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	6
language	2025-12-08 19:50:55.952+00	\N	\N	8	t	\N	JavaScript	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	8
tool	2025-12-08 19:50:55.953+00	\N	\N	10	t	\N	Jira	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	6
framework	2025-12-08 19:50:55.956+00	\N	\N	4	t	\N	React	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	5
database	2025-12-08 19:50:55.958+00	\N	\N	6	t	\N	SQL	5	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	10
language	2025-12-08 19:50:55.96+00	\N	\N	13	t	\N	TypeScript	4	\N	\N	published	97d0455c-b00a-4e3e-86f6-2d6d48409256	\N	4
\.


--
-- Data for Name: geocode_settings; Type: TABLE DATA; Schema: tiger; Owner: directus
--

COPY tiger.geocode_settings (name, setting, unit, category, short_desc) FROM stdin;
\.


--
-- Data for Name: pagc_gaz; Type: TABLE DATA; Schema: tiger; Owner: directus
--

COPY tiger.pagc_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_lex; Type: TABLE DATA; Schema: tiger; Owner: directus
--

COPY tiger.pagc_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_rules; Type: TABLE DATA; Schema: tiger; Owner: directus
--

COPY tiger.pagc_rules (id, rule, is_custom) FROM stdin;
\.


--
-- Data for Name: topology; Type: TABLE DATA; Schema: topology; Owner: directus
--

COPY topology.topology (id, name, srid, "precision", hasz, useslargeids) FROM stdin;
\.


--
-- Data for Name: layer; Type: TABLE DATA; Schema: topology; Owner: directus
--

COPY topology.layer (topology_id, layer_id, schema_name, table_name, feature_column, feature_type, level, child_id) FROM stdin;
\.


--
-- Name: accomplishment_variations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.accomplishment_variations_id_seq', 1, false);


--
-- Name: accomplishments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.accomplishments_id_seq', 10, true);


--
-- Name: accomplishments_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.accomplishments_projects_id_seq', 1, false);


--
-- Name: accomplishments_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.accomplishments_skills_id_seq', 26, true);


--
-- Name: accomplishments_technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.accomplishments_technologies_id_seq', 20, true);


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.certifications_id_seq', 3, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.companies_id_seq', 6, true);


--
-- Name: cover_letters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.cover_letters_id_seq', 1, false);


--
-- Name: directus_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_activity_id_seq', 62, true);


--
-- Name: directus_fields_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_fields_id_seq', 296, true);


--
-- Name: directus_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_notifications_id_seq', 1, false);


--
-- Name: directus_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_permissions_id_seq', 1, false);


--
-- Name: directus_presets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_presets_id_seq', 1, true);


--
-- Name: directus_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_relations_id_seq', 59, true);


--
-- Name: directus_revisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_revisions_id_seq', 58, true);


--
-- Name: directus_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_settings_id_seq', 1, true);


--
-- Name: directus_webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.directus_webhooks_id_seq', 1, false);


--
-- Name: education_accomplishments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.education_accomplishments_id_seq', 1, false);


--
-- Name: education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.education_id_seq', 3, true);


--
-- Name: education_related_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.education_related_items_id_seq', 1, false);


--
-- Name: identity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.identity_id_seq', 1, true);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 1, false);


--
-- Name: master_resume_system_docs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.master_resume_system_docs_id_seq', 5, true);


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.positions_id_seq', 8, true);


--
-- Name: professional_summaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.professional_summaries_id_seq', 3, true);


--
-- Name: projects_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.projects_companies_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.projects_id_seq', 4, true);


--
-- Name: projects_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.projects_positions_id_seq', 1, false);


--
-- Name: projects_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.projects_skills_id_seq', 1, false);


--
-- Name: projects_technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.projects_technologies_id_seq', 1, false);


--
-- Name: resumes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.resumes_id_seq', 1, false);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.skills_id_seq', 12, true);


--
-- Name: system_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.system_settings_id_seq', 1, false);


--
-- Name: technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.technologies_id_seq', 13, true);


--
-- Name: topology_id_seq; Type: SEQUENCE SET; Schema: topology; Owner: directus
--

SELECT pg_catalog.setval('topology.topology_id_seq', 1, false);


--
-- Name: accomplishment_variations accomplishment_variations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishment_variations
    ADD CONSTRAINT accomplishment_variations_pkey PRIMARY KEY (id);


--
-- Name: accomplishments accomplishments_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments
    ADD CONSTRAINT accomplishments_pkey PRIMARY KEY (id);


--
-- Name: accomplishments_projects accomplishments_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_projects
    ADD CONSTRAINT accomplishments_projects_pkey PRIMARY KEY (id);


--
-- Name: accomplishments_skills accomplishments_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_skills
    ADD CONSTRAINT accomplishments_skills_pkey PRIMARY KEY (id);


--
-- Name: accomplishments_technologies accomplishments_technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_technologies
    ADD CONSTRAINT accomplishments_technologies_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: cover_letters cover_letters_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_pkey PRIMARY KEY (id);


--
-- Name: directus_access directus_access_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_pkey PRIMARY KEY (id);


--
-- Name: directus_collections directus_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_collections
    ADD CONSTRAINT directus_collections_pkey PRIMARY KEY (collection);


--
-- Name: directus_comments directus_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_comments
    ADD CONSTRAINT directus_comments_pkey PRIMARY KEY (id);


--
-- Name: directus_dashboards directus_dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_dashboards
    ADD CONSTRAINT directus_dashboards_pkey PRIMARY KEY (id);


--
-- Name: directus_extensions directus_extensions_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_extensions
    ADD CONSTRAINT directus_extensions_pkey PRIMARY KEY (id);


--
-- Name: directus_fields directus_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_fields
    ADD CONSTRAINT directus_fields_pkey PRIMARY KEY (id);


--
-- Name: directus_files directus_files_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_pkey PRIMARY KEY (id);


--
-- Name: directus_flows directus_flows_operation_unique; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_flows
    ADD CONSTRAINT directus_flows_operation_unique UNIQUE (operation);


--
-- Name: directus_flows directus_flows_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_flows
    ADD CONSTRAINT directus_flows_pkey PRIMARY KEY (id);


--
-- Name: directus_folders directus_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_folders
    ADD CONSTRAINT directus_folders_pkey PRIMARY KEY (id);


--
-- Name: directus_migrations directus_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_migrations
    ADD CONSTRAINT directus_migrations_pkey PRIMARY KEY (version);


--
-- Name: directus_notifications directus_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_notifications
    ADD CONSTRAINT directus_notifications_pkey PRIMARY KEY (id);


--
-- Name: directus_operations directus_operations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_pkey PRIMARY KEY (id);


--
-- Name: directus_operations directus_operations_reject_unique; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_reject_unique UNIQUE (reject);


--
-- Name: directus_operations directus_operations_resolve_unique; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_resolve_unique UNIQUE (resolve);


--
-- Name: directus_panels directus_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_panels
    ADD CONSTRAINT directus_panels_pkey PRIMARY KEY (id);


--
-- Name: directus_permissions directus_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_permissions
    ADD CONSTRAINT directus_permissions_pkey PRIMARY KEY (id);


--
-- Name: directus_policies directus_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_policies
    ADD CONSTRAINT directus_policies_pkey PRIMARY KEY (id);


--
-- Name: directus_presets directus_presets_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_presets
    ADD CONSTRAINT directus_presets_pkey PRIMARY KEY (id);


--
-- Name: directus_relations directus_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_relations
    ADD CONSTRAINT directus_relations_pkey PRIMARY KEY (id);


--
-- Name: directus_roles directus_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_roles
    ADD CONSTRAINT directus_roles_pkey PRIMARY KEY (id);


--
-- Name: directus_settings directus_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_pkey PRIMARY KEY (id);


--
-- Name: directus_shares directus_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_pkey PRIMARY KEY (id);


--
-- Name: directus_translations directus_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_translations
    ADD CONSTRAINT directus_translations_pkey PRIMARY KEY (id);


--
-- Name: directus_users directus_users_email_unique; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_email_unique UNIQUE (email);


--
-- Name: directus_users directus_users_external_identifier_unique; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_external_identifier_unique UNIQUE (external_identifier);


--
-- Name: directus_users directus_users_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_pkey PRIMARY KEY (id);


--
-- Name: directus_users directus_users_token_unique; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_token_unique UNIQUE (token);


--
-- Name: directus_versions directus_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_pkey PRIMARY KEY (id);


--
-- Name: directus_webhooks directus_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_webhooks
    ADD CONSTRAINT directus_webhooks_pkey PRIMARY KEY (id);


--
-- Name: education_accomplishments education_accomplishments_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_accomplishments
    ADD CONSTRAINT education_accomplishments_pkey PRIMARY KEY (id);


--
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- Name: education_related_items education_related_items_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_related_items
    ADD CONSTRAINT education_related_items_pkey PRIMARY KEY (id);


--
-- Name: identity identity_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: master_resume_system_docs master_resume_system_docs_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.master_resume_system_docs
    ADD CONSTRAINT master_resume_system_docs_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: professional_summaries professional_summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.professional_summaries
    ADD CONSTRAINT professional_summaries_pkey PRIMARY KEY (id);


--
-- Name: projects_companies projects_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_companies
    ADD CONSTRAINT projects_companies_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects_positions projects_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_positions
    ADD CONSTRAINT projects_positions_pkey PRIMARY KEY (id);


--
-- Name: projects_skills projects_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_skills
    ADD CONSTRAINT projects_skills_pkey PRIMARY KEY (id);


--
-- Name: projects_technologies projects_technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_technologies
    ADD CONSTRAINT projects_technologies_pkey PRIMARY KEY (id);


--
-- Name: resumes resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: technologies technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_pkey PRIMARY KEY (id);


--
-- Name: accomplishment_variations accomplishment_variations_accomplishment_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishment_variations
    ADD CONSTRAINT accomplishment_variations_accomplishment_foreign FOREIGN KEY (accomplishment) REFERENCES public.accomplishments(id) ON DELETE SET NULL;


--
-- Name: accomplishment_variations accomplishment_variations_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishment_variations
    ADD CONSTRAINT accomplishment_variations_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: accomplishment_variations accomplishment_variations_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishment_variations
    ADD CONSTRAINT accomplishment_variations_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: accomplishments accomplishments_position_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments
    ADD CONSTRAINT accomplishments_position_foreign FOREIGN KEY ("position") REFERENCES public.positions(id) ON DELETE SET NULL;


--
-- Name: accomplishments_projects accomplishments_projects_accomplishments_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_projects
    ADD CONSTRAINT accomplishments_projects_accomplishments_id_foreign FOREIGN KEY (accomplishments_id) REFERENCES public.accomplishments(id) ON DELETE SET NULL;


--
-- Name: accomplishments_projects accomplishments_projects_projects_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_projects
    ADD CONSTRAINT accomplishments_projects_projects_id_foreign FOREIGN KEY (projects_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: accomplishments_skills accomplishments_skills_accomplishments_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_skills
    ADD CONSTRAINT accomplishments_skills_accomplishments_id_foreign FOREIGN KEY (accomplishments_id) REFERENCES public.accomplishments(id) ON DELETE SET NULL;


--
-- Name: accomplishments_skills accomplishments_skills_skills_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_skills
    ADD CONSTRAINT accomplishments_skills_skills_id_foreign FOREIGN KEY (skills_id) REFERENCES public.skills(id) ON DELETE SET NULL;


--
-- Name: accomplishments_technologies accomplishments_technologies_accomplishments_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_technologies
    ADD CONSTRAINT accomplishments_technologies_accomplishments_id_foreign FOREIGN KEY (accomplishments_id) REFERENCES public.accomplishments(id) ON DELETE SET NULL;


--
-- Name: accomplishments_technologies accomplishments_technologies_technologies_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments_technologies
    ADD CONSTRAINT accomplishments_technologies_technologies_id_foreign FOREIGN KEY (technologies_id) REFERENCES public.technologies(id) ON DELETE SET NULL;


--
-- Name: accomplishments accomplishments_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments
    ADD CONSTRAINT accomplishments_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: accomplishments accomplishments_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.accomplishments
    ADD CONSTRAINT accomplishments_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: certifications certifications_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: certifications certifications_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: companies companies_logo_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_logo_foreign FOREIGN KEY (logo) REFERENCES public.directus_files(id) ON DELETE SET NULL;


--
-- Name: companies companies_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: companies companies_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: cover_letters cover_letters_parent_cover_letter_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_parent_cover_letter_foreign FOREIGN KEY (parent_cover_letter) REFERENCES public.cover_letters(id);


--
-- Name: cover_letters cover_letters_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: cover_letters cover_letters_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: directus_access directus_access_policy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_policy_foreign FOREIGN KEY (policy) REFERENCES public.directus_policies(id) ON DELETE CASCADE;


--
-- Name: directus_access directus_access_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE;


--
-- Name: directus_access directus_access_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_collections directus_collections_group_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_collections
    ADD CONSTRAINT directus_collections_group_foreign FOREIGN KEY ("group") REFERENCES public.directus_collections(collection);


--
-- Name: directus_comments directus_comments_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_comments
    ADD CONSTRAINT directus_comments_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_comments directus_comments_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_comments
    ADD CONSTRAINT directus_comments_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: directus_dashboards directus_dashboards_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_dashboards
    ADD CONSTRAINT directus_dashboards_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_files directus_files_folder_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_folder_foreign FOREIGN KEY (folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL;


--
-- Name: directus_files directus_files_modified_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_modified_by_foreign FOREIGN KEY (modified_by) REFERENCES public.directus_users(id);


--
-- Name: directus_files directus_files_uploaded_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_uploaded_by_foreign FOREIGN KEY (uploaded_by) REFERENCES public.directus_users(id);


--
-- Name: directus_flows directus_flows_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_flows
    ADD CONSTRAINT directus_flows_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_folders directus_folders_parent_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_folders
    ADD CONSTRAINT directus_folders_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_folders(id);


--
-- Name: directus_notifications directus_notifications_recipient_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_notifications
    ADD CONSTRAINT directus_notifications_recipient_foreign FOREIGN KEY (recipient) REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_notifications directus_notifications_sender_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_notifications
    ADD CONSTRAINT directus_notifications_sender_foreign FOREIGN KEY (sender) REFERENCES public.directus_users(id);


--
-- Name: directus_operations directus_operations_flow_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_flow_foreign FOREIGN KEY (flow) REFERENCES public.directus_flows(id) ON DELETE CASCADE;


--
-- Name: directus_operations directus_operations_reject_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_reject_foreign FOREIGN KEY (reject) REFERENCES public.directus_operations(id);


--
-- Name: directus_operations directus_operations_resolve_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_resolve_foreign FOREIGN KEY (resolve) REFERENCES public.directus_operations(id);


--
-- Name: directus_operations directus_operations_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_panels directus_panels_dashboard_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_panels
    ADD CONSTRAINT directus_panels_dashboard_foreign FOREIGN KEY (dashboard) REFERENCES public.directus_dashboards(id) ON DELETE CASCADE;


--
-- Name: directus_panels directus_panels_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_panels
    ADD CONSTRAINT directus_panels_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_permissions directus_permissions_policy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_permissions
    ADD CONSTRAINT directus_permissions_policy_foreign FOREIGN KEY (policy) REFERENCES public.directus_policies(id) ON DELETE CASCADE;


--
-- Name: directus_presets directus_presets_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_presets
    ADD CONSTRAINT directus_presets_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE;


--
-- Name: directus_presets directus_presets_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_presets
    ADD CONSTRAINT directus_presets_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_roles directus_roles_parent_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_roles
    ADD CONSTRAINT directus_roles_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_roles(id);


--
-- Name: directus_settings directus_settings_project_logo_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_project_logo_foreign FOREIGN KEY (project_logo) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_background_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_background_foreign FOREIGN KEY (public_background) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_favicon_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_favicon_foreign FOREIGN KEY (public_favicon) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_foreground_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_foreground_foreign FOREIGN KEY (public_foreground) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_registration_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_registration_role_foreign FOREIGN KEY (public_registration_role) REFERENCES public.directus_roles(id) ON DELETE SET NULL;


--
-- Name: directus_settings directus_settings_storage_default_folder_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_storage_default_folder_foreign FOREIGN KEY (storage_default_folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL;


--
-- Name: directus_shares directus_shares_collection_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_collection_foreign FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE;


--
-- Name: directus_shares directus_shares_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE;


--
-- Name: directus_shares directus_shares_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_users directus_users_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE SET NULL;


--
-- Name: directus_versions directus_versions_collection_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_collection_foreign FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE;


--
-- Name: directus_versions directus_versions_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_versions directus_versions_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: directus_webhooks directus_webhooks_migrated_flow_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.directus_webhooks
    ADD CONSTRAINT directus_webhooks_migrated_flow_foreign FOREIGN KEY (migrated_flow) REFERENCES public.directus_flows(id) ON DELETE SET NULL;


--
-- Name: education_accomplishments education_accomplishments_accomplishments_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_accomplishments
    ADD CONSTRAINT education_accomplishments_accomplishments_id_foreign FOREIGN KEY (accomplishments_id) REFERENCES public.accomplishments(id) ON DELETE SET NULL;


--
-- Name: education_accomplishments education_accomplishments_education_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_accomplishments
    ADD CONSTRAINT education_accomplishments_education_id_foreign FOREIGN KEY (education_id) REFERENCES public.education(id) ON DELETE SET NULL;


--
-- Name: education_related_items education_related_items_education_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education_related_items
    ADD CONSTRAINT education_related_items_education_id_foreign FOREIGN KEY (education_id) REFERENCES public.education(id) ON DELETE SET NULL;


--
-- Name: education education_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: education education_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: identity identity_profile_photo_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_profile_photo_foreign FOREIGN KEY (profile_photo) REFERENCES public.directus_files(id) ON DELETE SET NULL;


--
-- Name: identity identity_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: identity identity_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: job_applications job_applications_cover_letter_used__foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_cover_letter_used__foreign FOREIGN KEY (cover_letter_used_) REFERENCES public.cover_letters(id) ON DELETE SET NULL;


--
-- Name: job_applications job_applications_resume_used_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_resume_used_foreign FOREIGN KEY (resume_used) REFERENCES public.resumes(id) ON DELETE SET NULL;


--
-- Name: job_applications job_applications_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: job_applications job_applications_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: master_resume_system_docs master_resume_system_docs_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.master_resume_system_docs
    ADD CONSTRAINT master_resume_system_docs_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: master_resume_system_docs master_resume_system_docs_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.master_resume_system_docs
    ADD CONSTRAINT master_resume_system_docs_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: positions positions_company_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_company_foreign FOREIGN KEY (company) REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: positions positions_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: positions positions_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: professional_summaries professional_summaries_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.professional_summaries
    ADD CONSTRAINT professional_summaries_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: professional_summaries professional_summaries_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.professional_summaries
    ADD CONSTRAINT professional_summaries_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: projects_companies projects_companies_companies_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_companies
    ADD CONSTRAINT projects_companies_companies_id_foreign FOREIGN KEY (companies_id) REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: projects_companies projects_companies_projects_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_companies
    ADD CONSTRAINT projects_companies_projects_id_foreign FOREIGN KEY (projects_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: projects_positions projects_positions_positions_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_positions
    ADD CONSTRAINT projects_positions_positions_id_foreign FOREIGN KEY (positions_id) REFERENCES public.positions(id) ON DELETE SET NULL;


--
-- Name: projects_positions projects_positions_projects_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_positions
    ADD CONSTRAINT projects_positions_projects_id_foreign FOREIGN KEY (projects_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: projects_skills projects_skills_projects_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_skills
    ADD CONSTRAINT projects_skills_projects_id_foreign FOREIGN KEY (projects_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: projects_skills projects_skills_skills_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_skills
    ADD CONSTRAINT projects_skills_skills_id_foreign FOREIGN KEY (skills_id) REFERENCES public.skills(id) ON DELETE SET NULL;


--
-- Name: projects_technologies projects_technologies_projects_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_technologies
    ADD CONSTRAINT projects_technologies_projects_id_foreign FOREIGN KEY (projects_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: projects_technologies projects_technologies_technologies_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects_technologies
    ADD CONSTRAINT projects_technologies_technologies_id_foreign FOREIGN KEY (technologies_id) REFERENCES public.technologies(id) ON DELETE SET NULL;


--
-- Name: projects projects_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: projects projects_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: resumes resumes_parent_resume_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_parent_resume_foreign FOREIGN KEY (parent_resume) REFERENCES public.resumes(id);


--
-- Name: resumes resumes_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: resumes resumes_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: skills skills_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: skills skills_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: system_settings system_settings_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: system_settings system_settings_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: technologies technologies_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id);


--
-- Name: technologies technologies_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- PostgreSQL database dump complete
--

