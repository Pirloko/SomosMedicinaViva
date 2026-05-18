-- ============================================
-- FIX: Supabase Database Linter (seguridad)
-- ============================================
-- Errores típicos que corrige este script:
-- 1) auth_users_exposed: vista que une auth.users expuesta a anon/public
-- 2) security_definer_view: vistas con SECURITY DEFINER (bypasean RLS del usuario)
--
-- Ejecutar en Supabase → SQL Editor como postgres (una sola vez).
-- Requiere PostgreSQL 15+ para ALTER VIEW ... security_invoker (Supabase lo cumple).
--
-- Documentación:
-- https://supabase.com/docs/guides/database/database-linter?lint=0002_auth_users_exposed
-- https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view
-- ============================================

-- ---------------------------------------------------------------------------
-- A) Vista vista_usuarios_roles: no exponer a anon ni a PUBLIC
-- ---------------------------------------------------------------------------
-- PostgREST expone el esquema public; si hay GRANT implícito a PUBLIC/anon,
-- la vista podría filtrar datos de auth.users. Revocar y dejar solo roles necesarios.

REVOKE ALL ON public.vista_usuarios_roles FROM PUBLIC;
REVOKE ALL ON public.vista_usuarios_roles FROM anon;

-- Solo usuarios autenticados (ajusta si usas service_role vía backend exclusivamente)
GRANT SELECT ON public.vista_usuarios_roles TO authenticated;

-- Opcional: si nadie debe leerla vía API y solo usas SQL en dashboard, revoca también:
-- REVOKE ALL ON public.vista_usuarios_roles FROM authenticated;


-- ---------------------------------------------------------------------------
-- B) Vistas SECURITY DEFINER → SECURITY INVOKER
-- ---------------------------------------------------------------------------
-- Con security_invoker, la vista se ejecuta con permisos del usuario que consulta,
-- respetando RLS de las tablas base. Ajusta la lista si tienes más vistas marcadas.

ALTER VIEW IF EXISTS public.vista_usuarios_roles SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_kpis_ventas SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_compras_ingredientes SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_ventas_completas SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_productos_mas_vendidos SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_costo_productos SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_resumen_compras_ingrediente SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_analisis_ingredientes SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_ganancias_ventas SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_kpis_financieros SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_productos_rentables SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_categorias_con_productos SET (security_invoker = true);
ALTER VIEW IF EXISTS public.vista_productos_stock SET (security_invoker = true);

-- Si alguna vista no existe en tu proyecto, el IF EXISTS evita error.

DO $$
BEGIN
  RAISE NOTICE 'Listo: revisa de nuevo Database Linter en Supabase.';
END $$;
