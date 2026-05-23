-- ============================================================
-- SEED DE TESTE — RF08: times transferidos do ciclo anterior
-- ------------------------------------------------------------
-- Simula 4 times "do ciclo de ontem" no período vespertino,
-- onde TIME A venceu TIME B (esses já foram limpos) e
-- TIME C e TIME D não jogaram (transferidos para HOJE).
--
-- Após rodar, abra /matches e você verá:
--   - TIME C e TIME D no topo da fila com badge TRANSFERIDO
--   - "Últimos resultados" vazio (matches do ciclo atual)
--   - Os jogadores fictícios de C e D não conseguem entrar
--     em novos times (basta tentar logar como um deles)
--
-- Para testar o algoritmo REAL (que decide quem transfere),
-- veja o bloco no final do arquivo.
-- ============================================================

-- 1) LIMPEZA prévia.
DELETE FROM public.user_team
WHERE team_id IN (SELECT id FROM public.teams WHERE team_name LIKE 'TIME TRF %');
DELETE FROM public.fullteams
WHERE team_id IN (SELECT id FROM public.teams WHERE team_name LIKE 'TIME TRF %');
DELETE FROM public.teams WHERE team_name LIKE 'TIME TRF %';
DELETE FROM public.users WHERE email LIKE '%@transferred.teste';
DELETE FROM auth.identities
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@transferred.teste');
DELETE FROM auth.users WHERE email LIKE '%@transferred.teste';

-- 2) Cria 2 times TRANSFERIDOS + jogadores fictícios.
DO $$
DECLARE
  u_c1 UUID := gen_random_uuid();
  u_c2 UUID := gen_random_uuid();
  u_d1 UUID := gen_random_uuid();
  u_d2 UUID := gen_random_uuid();
  team_c_id BIGINT;
  team_d_id BIGINT;
  ontem TIMESTAMPTZ := NOW() - INTERVAL '1 day';
  -- horário aproximado do "ciclo de ontem" (14:35 de ontem)
  filled_c TIMESTAMPTZ := (DATE_TRUNC('day', ontem) + INTERVAL '14 hours 35 minutes');
  filled_d TIMESTAMPTZ := (DATE_TRUNC('day', ontem) + INTERVAL '14 hours 50 minutes');
BEGIN
  -- 4 jogadores fictícios em auth.users
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES
    ('00000000-0000-0000-0000-000000000000', u_c1, 'authenticated', 'authenticated',
     'c1@transferred.teste', crypt('teste123!', gen_salt('bf')), NOW(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"name":"Bruno C"}'::jsonb, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', u_c2, 'authenticated', 'authenticated',
     'c2@transferred.teste', crypt('teste123!', gen_salt('bf')), NOW(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"name":"Carla C"}'::jsonb, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', u_d1, 'authenticated', 'authenticated',
     'd1@transferred.teste', crypt('teste123!', gen_salt('bf')), NOW(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"name":"Diego D"}'::jsonb, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', u_d2, 'authenticated', 'authenticated',
     'd2@transferred.teste', crypt('teste123!', gen_salt('bf')), NOW(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"name":"Elena D"}'::jsonb, NOW(), NOW());

  INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider,
    created_at, updated_at, last_sign_in_at)
  VALUES
    (gen_random_uuid(), u_c1::text, u_c1, jsonb_build_object('sub', u_c1::text, 'email', 'c1@transferred.teste'), 'email', NOW(), NOW(), NOW()),
    (gen_random_uuid(), u_c2::text, u_c2, jsonb_build_object('sub', u_c2::text, 'email', 'c2@transferred.teste'), 'email', NOW(), NOW(), NOW()),
    (gen_random_uuid(), u_d1::text, u_d1, jsonb_build_object('sub', u_d1::text, 'email', 'd1@transferred.teste'), 'email', NOW(), NOW(), NOW()),
    (gen_random_uuid(), u_d2::text, u_d2, jsonb_build_object('sub', u_d2::text, 'email', 'd2@transferred.teste'), 'email', NOW(), NOW(), NOW());

  INSERT INTO public.users (name, email, auth_id, is_admin) VALUES
    ('Bruno C',  'c1@transferred.teste', u_c1, false),
    ('Carla C',  'c2@transferred.teste', u_c2, false),
    ('Diego D',  'd1@transferred.teste', u_d1, false),
    ('Elena D',  'd2@transferred.teste', u_d2, false);

  INSERT INTO public.teams (team_name, is_full) VALUES ('TIME TRF C', true) RETURNING id INTO team_c_id;
  INSERT INTO public.teams (team_name, is_full) VALUES ('TIME TRF D', true) RETURNING id INTO team_d_id;

  -- Coloca em fullteams já com cycle_date = HOJE e transferred = true.
  -- original_filled_at preserva a ordem de "ontem".
  INSERT INTO public.fullteams (team_id, team_name, filled_at, original_filled_at,
    cycle_period, cycle_date, transferred)
  VALUES
    (team_c_id, 'TIME TRF C', filled_c, filled_c, 'vespertino', CURRENT_DATE, true),
    (team_d_id, 'TIME TRF D', filled_d, filled_d, 'vespertino', CURRENT_DATE, true);

  -- Associa jogadores aos times (2 jogadores em cada para não bloquear o time).
  INSERT INTO public.user_team (user_id, team_id) VALUES
    (u_c1, team_c_id), (u_c2, team_c_id),
    (u_d1, team_d_id), (u_d2, team_d_id);
END $$;

-- 3) VERIFICAÇÃO — exibe estado da fila.
SELECT
  f.team_name,
  f.cycle_period,
  f.cycle_date,
  f.transferred,
  f.original_filled_at
FROM public.fullteams f
ORDER BY f.transferred DESC, f.original_filled_at ASC;

-- ============================================================
-- TESTE DO ALGORITMO REAL (opcional, mais demorado):
-- ------------------------------------------------------------
-- 1) Rode `seed_test_full_teams.sql` para popular a fila do
--    ciclo atual com 4 times.
-- 2) Como admin, abra /matches e declare 1 vencedor
--    (vai gravar em matches com winner_team_id/loser_team_id).
-- 3) Espere passar de 15:40 (vespertino) ou 21:30 (noturno).
-- 4) Abra /disabled. O hook useEffect dispara
--    transferUnplayedTeamsIfCycleEnded, que vai:
--       - DELETAR os 2 times que jogaram (winner+loser)
--       - TRANSFERIR os 2 times restantes para o próximo
--         dia útil, marcando transferred=true.
-- 5) Reabra /matches no próximo dia (ou simule mudando o
--    relógio do PC) e veja eles no topo com badge TRANSFERIDO.
-- ============================================================
