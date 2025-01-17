-- Insertar Roles
INSERT INTO public.session_rol (name, description) 
VALUES 
    ('super admin', 'Super administrador con acceso a todas las funciones'),
    ('usuario', 'Usuario regular con permisos limitados');

-- Insertar Tipos de Usuario
INSERT INTO public.session_type (name)
VALUES 
    ('usuario normal'),
    ('usuario super admin');

-- Insertar Estados (Status)
INSERT INTO public.session_status (name)
VALUES 
    ('activo'),
    ('deshabilitado');

-- Insertar Sesión para Super Admin
INSERT INTO public."session" (email, "password", "lastAccess", "timesLoggedIn", "accountConfirmed", "typeId", "statusId", "rolId")
VALUES 
    ('superadmin@test.com', '$2b$10$/4GB6E.yAp1k4BbbVXtLB.0H5qLpOUc.Gjg/R2Vk79CjxiMv99gU6', NOW(), 1, true, 
    (SELECT id FROM public.session_type WHERE name = 'usuario super admin'), 
    (SELECT id FROM public.session_status WHERE name = 'activo'), 
    (SELECT id FROM public.session_rol WHERE name = 'super admin'));

-- Insertar Sesión para Usuario Regular
INSERT INTO public."session" (email, "password", "lastAccess", "timesLoggedIn", "accountConfirmed", "typeId", "statusId", "rolId")
VALUES 
    ('usuario@test.com', '$2b$10$/4GB6E.yAp1k4BbbVXtLB.0H5qLpOUc.Gjg/R2Vk79CjxiMv99gU6', NOW(), 1, true, 
    (SELECT id FROM public.session_type WHERE name = 'usuario normal'), 
    (SELECT id FROM public.session_status WHERE name = 'activo'), 
    (SELECT id FROM public.session_rol WHERE name = 'usuario'));

-- Insertar Usuario asociado a la sesión de tipo Usuario Normal
INSERT INTO public."user" ("name", "lastName", "sessionId")
VALUES 
    ('Steve', 'Perez', 
    (SELECT id FROM public."session" WHERE email = 'usuario@test.com'));

-- Insertar Usuario Admin asociado a la sesión de tipo Usuario Super Admin
INSERT INTO public.user_admin ("name", "lastName", "sessionId")
VALUES 
    ('Admin', 'Principal', 
    (SELECT id FROM public."session" WHERE email = 'superadmin@test.com'));
