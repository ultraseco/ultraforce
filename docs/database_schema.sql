-- =============================================================================
-- ULTRAFORCE 360 - ESQUEMA DE BASE DE DATOS
-- Ultra Seco | Sistema de Gestión Comercial con IA, Gamificación y Pipeline
-- =============================================================================
-- Este script crea el esquema completo necesario para que fuerza.html
-- sea 100% funcional. Diseñado para PostgreSQL 14+ (compatible con MySQL 8+)
-- =============================================================================

-- =============================================================================
-- 1. USUARIOS Y ROLES DEL SISTEMA
-- =============================================================================
-- Almacena credenciales de acceso para todos los perfiles:
-- vendor, CEO, admin, ops. El login soporta PIN para roles internos
-- y selección directa para vendedores.
-- =============================================================================
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE,
    pin_hash        VARCHAR(255),                 -- Hash del PIN (roles internos)
    role            VARCHAR(20) NOT NULL CHECK (role IN ('vendor','CEO','admin','ops')),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP
);

COMMENT ON TABLE users IS 'Credenciales de acceso para todos los roles del sistema';

-- =============================================================================
-- 2. VENDEDORES (VENDORS)
-- =============================================================================
-- Ficha comercial de cada vendedor. Vinculado a users para autenticación.
-- Contiene métricas de gamificación (XP, racha), territorio asignado y
-- datos de contacto. La comisión base es del 8% con bonos condicionales.
-- =============================================================================
CREATE TABLE vendors (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: v_1680123456789
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    zone            VARCHAR(100),                   -- Zona base (ej: Valencia)
    ramo            VARCHAR(100),                   -- Sector / especialidad
    sector          VARCHAR(100) DEFAULT 'Ferretero',
    xp_total        INTEGER DEFAULT 0,              -- XP acumulado histórico
    streak          INTEGER DEFAULT 0,              -- Racha de días completados
    joined_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    avatar_color    VARCHAR(50) DEFAULT 'linear-gradient(135deg,#0284c7,#06b6d4)'
);

-- =============================================================================
-- 3. ZONAS ASIGNADAS POR VENDEDOR
-- =============================================================================
-- Un vendedor puede tener múltiples estados/ciudades asignadas.
-- Se usa para filtrar el mapa territorial y controlar cobertura.
-- =============================================================================
CREATE TABLE vendor_zones (
    id              SERIAL PRIMARY KEY,
    vendor_id       VARCHAR(32) NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    zone_name       VARCHAR(100) NOT NULL,          -- ej: Carabobo, Aragua
    assigned_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by     INTEGER REFERENCES users(id)    -- CEO/Admin que asignó
);

CREATE INDEX idx_vendor_zones_vendor ON vendor_zones(vendor_id);

-- =============================================================================
-- 4. CLIENTES / PROSPECTOS / LEADS (CRM)
-- =============================================================================
-- Embudo de ventas con 3 etapas: lead → prospect → client.
-- Cada cliente tiene coordenadas GPS (lat/lng), scoring interno (A/B/C)
-- y balance de cuenta. El vendor_id es quien lo registró;
-- assigned_vendor es quien lo atiende comercialmente.
-- =============================================================================
CREATE TABLE clients (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: cli_abc123
    vendor_id       VARCHAR(32) REFERENCES vendors(id) ON DELETE SET NULL, -- Quien registró
    assigned_vendor VARCHAR(32) REFERENCES vendors(id) ON DELETE SET NULL, -- Quien atiende
    razon_social    VARCHAR(255) NOT NULL,
    rif             VARCHAR(50),
    phone           VARCHAR(50),
    email           VARCHAR(255),
    address         TEXT NOT NULL,
    city            VARCHAR(100),
    lat             DECIMAL(10,8),                  -- Coordenada GPS
    lng             DECIMAL(11,8),                  -- Coordenada GPS
    manager_name    VARCHAR(150),                   -- Encargado de compras
    manager_phone   VARCHAR(50),
    social_media    VARCHAR(255),                   -- Instagram, web, etc.
    type            VARCHAR(50) DEFAULT 'Ferretería' CHECK (type IN ('Ferretería','Mayorista','Distribuidor','Constructora','Consumidor Final')),
    stage           VARCHAR(20) DEFAULT 'lead' CHECK (stage IN ('lead','prospect','client')),
    score           CHAR(1) DEFAULT 'B' CHECK (score IN ('A','B','C')),
    balance         DECIMAL(12,2) DEFAULT 0,        -- Saldo pendiente
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_vendor ON clients(vendor_id);
CREATE INDEX idx_clients_assigned ON clients(assigned_vendor);
CREATE INDEX idx_clients_stage ON clients(stage);
CREATE INDEX idx_clients_city ON clients(city);

-- =============================================================================
-- 5. INTERACCIONES CON CLIENTES (NOTAS, LLAMADAS, VISITAS)
-- =============================================================================
-- Historial CRM de cada contacto. El vendedor registra notas de seguimiento
-- que se muestran en el modal del cliente.
-- =============================================================================
CREATE TABLE client_interactions (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: int_abc123
    client_id       VARCHAR(32) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    vendor_id       VARCHAR(32) REFERENCES vendors(id) ON DELETE SET NULL,
    note            TEXT NOT NULL,
    interaction_type VARCHAR(50) DEFAULT 'nota' CHECK (interaction_type IN ('nota','llamada','visita','cotizacion','pedido')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_client ON client_interactions(client_id);
CREATE INDEX idx_interactions_date ON client_interactions(created_at DESC);

-- =============================================================================
-- 6. CATÁLOGO DE PRODUCTOS
-- =============================================================================
-- Productos base del catálogo Ultra Seco. Los productos se agrupan por
-- categoría (impermeabilizantes, aditivos, etc.) y se muestran en la
-- grilla de catálogo al crear un pedido.
-- =============================================================================
CREATE TABLE products (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: prod_ultraforce_pro
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    category        VARCHAR(100) NOT NULL,          -- ej: Impermeabilizantes
    image_url       VARCHAR(500),                   -- Ruta a imagen
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);

-- =============================================================================
-- 7. OPCIONES / VARIANTES DE PRODUCTO
-- =============================================================================
-- Cada producto puede tener múltiples presentaciones (litrajes, colores).
-- Cada opción tiene precio de lista y precio mayorista (wholesale_price).
-- =============================================================================
CREATE TABLE product_options (
    id              SERIAL PRIMARY KEY,
    product_id      VARCHAR(32) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label           VARCHAR(150) NOT NULL,          -- ej: "4 Litros - Blanco"
    sku             VARCHAR(100),
    price           DECIMAL(12,2) NOT NULL,         -- Precio lista USD
    wholesale_price DECIMAL(12,2),                  -- Precio mayorista USD
    is_active       BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_options_product ON product_options(product_id);

-- =============================================================================
-- 8. PEDIDOS / ÓRDENES (PIPELINE DE VENTAS)
-- =============================================================================
-- Core del sistema. Pipeline de 5 estados:
--   pending_approval → in_process → on_truck → delivered → paid
-- El total se calcula desde las líneas (order_items) pero se persiste aquí
-- como source-of-truth. Soporta descuento global sobre el pedido.
-- =============================================================================
CREATE TABLE orders (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: ord_abc123
    vendor_id       VARCHAR(32) NOT NULL REFERENCES vendors(id),
    client_id       VARCHAR(32) NOT NULL REFERENCES clients(id),
    date            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status          VARCHAR(30) DEFAULT 'pending_approval' 
                    CHECK (status IN ('pending_approval','in_process','on_truck','delivered','paid','cancelled')),
    total           DECIMAL(12,2) NOT NULL DEFAULT 0,
    global_discount DECIMAL(5,2) DEFAULT 0,         -- % descuento global
    notes           TEXT,
    
    -- Timestamps de transición del pipeline
    accepted_at     TIMESTAMP,                      -- admin aprobó
    in_process_at   TIMESTAMP,                      -- ops comenzó preparación
    dispatched_at   TIMESTAMP,                      -- salió al camión
    delivered_at    TIMESTAMP,                      -- cliente recibió
    paid_at         TIMESTAMP,                      -- cobro confirmado
    
    -- Auditoría de edición
    edited_at       TIMESTAMP,
    edited_by       INTEGER REFERENCES users(id),
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(date DESC);
CREATE INDEX idx_orders_paid_at ON orders(paid_at);

-- =============================================================================
-- 9. LÍNEAS DE PRODUCTO POR PEDIDO
-- =============================================================================
-- Detalle de cada artículo en un pedido. Soporta descuento por línea.
-- El subtotal de línea = (price * qty) * (1 - discount/100)
-- =============================================================================
CREATE TABLE order_items (
    id              SERIAL PRIMARY KEY,
    order_id        VARCHAR(32) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      VARCHAR(32) REFERENCES products(id) ON DELETE SET NULL,
    option_id       INTEGER REFERENCES product_options(id) ON DELETE SET NULL,
    name            VARCHAR(150) NOT NULL,          -- Denormalizado para histórico
    label           VARCHAR(150),                   -- Presentación elegida
    sku             VARCHAR(100),
    price           DECIMAL(12,2) NOT NULL,         -- Precio unitario al momento
    qty             INTEGER NOT NULL DEFAULT 1,
    discount        DECIMAL(5,2) DEFAULT 0,         -- % descuento por línea
    line_total      DECIMAL(12,2) NOT NULL          -- Subtotal de línea
);

CREATE INDEX idx_items_order ON order_items(order_id);

-- =============================================================================
-- 10. PAGOS / COBROS (CxC)
-- =============================================================================
-- Registro de pagos recibidos por los vendedores. Vinculado a un cliente
-- y opcionalmente a un pedido específico. Soporta pagos parciales y
-- múltiples métodos de pago (Transferencias, Pago Móvil, Zelle, Efectivo).
-- =============================================================================
CREATE TABLE payments (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: pay_1680123456789
    vendor_id       VARCHAR(32) NOT NULL REFERENCES vendors(id),
    client_id       VARCHAR(32) NOT NULL REFERENCES clients(id),
    order_id        VARCHAR(32) REFERENCES orders(id) ON DELETE SET NULL,
    payment_type    VARCHAR(20) DEFAULT 'full' CHECK (payment_type IN ('full','partial')),
    method          VARCHAR(50) NOT NULL CHECK (method IN (
                        'Transferencia Banesco','Transferencia Bancamiga',
                        'Pago Móvil Bancamiga','Zelle','Efectivo USD'
                    )),
    amount          DECIMAL(12,2) NOT NULL,
    reference       VARCHAR(255),                   -- Nº de referencia bancaria
    confirmed       BOOLEAN DEFAULT TRUE,
    date            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes           TEXT
);

CREATE INDEX idx_payments_vendor ON payments(vendor_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_date ON payments(date DESC);

-- =============================================================================
-- 11. METAS DE VENTAS (GOALS)
-- =============================================================================
-- Metas asignadas por el CEO/Admin. Pueden ser globales (vendor_id='all')
-- o individuales por vendedor. Soporta períodos: mensual, semanal, trimestral.
-- =============================================================================
CREATE TABLE goals (
    id              VARCHAR(32) PRIMARY KEY,        -- ej: goal_1680123456789
    vendor_id       VARCHAR(32) NOT NULL,           -- 'all' o ID de vendedor
    amount          DECIMAL(12,2) NOT NULL,         -- Meta en USD
    period          VARCHAR(20) DEFAULT 'monthly' CHECK (period IN ('monthly','weekly','quarterly')),
    set_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    set_by          INTEGER REFERENCES users(id),
    expires_at      TIMESTAMP
);

CREATE INDEX idx_goals_vendor ON goals(vendor_id);

-- =============================================================================
-- 12. TAREAS / ACTIVIDADES
-- =============================================================================
-- Tareas del sistema: tareas diarias automáticas del vendedor, tareas
-- delegadas por CEO/Admin, y tareas generadas por plantillas automáticas.
-- El campo source diferencia: 'daily_auto', 'delegated', 'auto_template'.
-- =============================================================================
CREATE TABLE tasks (
    id              VARCHAR(32) PRIMARY KEY,
    vendor_id       VARCHAR(32) REFERENCES vendors(id) ON DELETE CASCADE,   -- Destinatario
    assigned_by     INTEGER REFERENCES users(id),                         -- Quien delegó
    auto_task_id    VARCHAR(32),                                          -- Si viene de plantilla
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    task_type       VARCHAR(50) DEFAULT 'general' CHECK (task_type IN (
                        'general','visita','reporte','seguimiento',
                        'cobranza','prospecto','objetivo'
                    )),
    source          VARCHAR(30) DEFAULT 'delegated' CHECK (source IN ('daily_auto','delegated','auto_template')),
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','done','overdue')),
    xp_reward       INTEGER DEFAULT 30,
    due_date        DATE,
    completed_at    TIMESTAMP,
    completed_by    VARCHAR(32),                  -- user_id o vendor_id
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_vendor ON tasks(vendor_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_tasks_source ON tasks(source);

-- =============================================================================
-- 13. PLANTILLAS DE TAREAS AUTOMÁTICAS
-- =============================================================================
-- Motor de IA / CEO para crear tareas recurrentes. Las plantillas se
-- "inyectan" periódicamente (diario, lunes, día 1 del mes) como tareas
-- reales en la tabla tasks.
-- =============================================================================
CREATE TABLE auto_task_templates (
    id              VARCHAR(32) PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    task_type       VARCHAR(50) DEFAULT 'general',
    frequency       VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('daily','weekly','monthly')),
    target_vendor_id VARCHAR(32) REFERENCES vendors(id) ON DELETE CASCADE, -- NULL = todos
    target_all      BOOLEAN DEFAULT TRUE,           -- Si TRUE, aplica a todo el equipo
    xp_reward       INTEGER DEFAULT 30,
    days_before_due INTEGER DEFAULT 1,              -- Días de plazo desde inyección
    is_active       BOOLEAN DEFAULT TRUE,
    last_injected_at TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INTEGER REFERENCES users(id)
);

CREATE INDEX idx_auto_tasks_active ON auto_task_templates(is_active);

-- =============================================================================
-- 14. LOG DE INYECCIONES DE TAREAS AUTOMÁTICAS
-- =============================================================================
-- Auditoría de cuándo se ejecutó cada plantilla y a cuántos vendedores
-- les fue asignada.
-- =============================================================================
CREATE TABLE auto_task_logs (
    id              SERIAL PRIMARY KEY,
    template_id     VARCHAR(32) NOT NULL REFERENCES auto_task_templates(id) ON DELETE CASCADE,
    injected_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recipients_count INTEGER DEFAULT 0,
    message         TEXT
);

CREATE INDEX idx_auto_logs_template ON auto_task_logs(template_id);

-- =============================================================================
-- 15. SOLICITUDES POP / UNIFORMES / EXHIBIDORES
-- =============================================================================
-- Vendedores solicitan material de apoyo publicitario o uniformes.
-- Flujo: requested → approved → in_process → dispatched → rejected
-- =============================================================================
CREATE TABLE pop_requests (
    id              VARCHAR(32) PRIMARY KEY,
    vendor_id       VARCHAR(32) NOT NULL REFERENCES vendors(id),
    request_type    VARCHAR(50) NOT NULL CHECK (request_type IN ('pop','uniform','exhibidor','muestra','otro')),
    description     TEXT NOT NULL,
    status          VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested','approved','in_process','dispatched','rejected')),
    admin_notes     TEXT,
    requested_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP,
    resolved_by     INTEGER REFERENCES users(id)
);

CREATE INDEX idx_pop_vendor ON pop_requests(vendor_id);
CREATE INDEX idx_pop_status ON pop_requests(status);

-- =============================================================================
-- 16. POSTULANTES / CANDIDATOS A VENDEDOR
-- =============================================================================
-- Formulario externo de postulación (postulacion.html). El CEO revisa,
-- aprueba (convirtiendo en vendor) o rechaza.
-- =============================================================================
CREATE TABLE applicants (
    id              VARCHAR(32) PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    zone            VARCHAR(100),                   -- Ciudad/Estado deseado
    city            VARCHAR(100),
    ramo            VARCHAR(100),                   -- Sector de experiencia
    experience      TEXT,                           -- Resumen de experiencia
    active_clients  INTEGER DEFAULT 0,              -- Clientes que traería
    score           INTEGER DEFAULT 0,              -- Puntuación de evaluación
    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    approved_at     TIMESTAMP,
    rejected_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by    INTEGER REFERENCES users(id)
);

CREATE INDEX idx_applicants_status ON applicants(status);

-- =============================================================================
-- 17. GAMIFICACIÓN - XP Y MEDALLAS
-- =============================================================================
-- Registro detallado de eventos de gamificación. Cada fila es una acción
-- que otorgó XP a un vendedor. Permite calcular ranking, rachas y
-- comisiones con bonificación.
-- =============================================================================
CREATE TABLE gamification_events (
    id              SERIAL PRIMARY KEY,
    vendor_id       VARCHAR(32) NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    event_type      VARCHAR(50) NOT NULL CHECK (event_type IN (
                        'task_complete','payment_full','payment_partial',
                        'delivery_confirm','new_client','order_created',
                        'daily_bonus','team_bonus','streak_bonus'
                    )),
    xp_earned       INTEGER NOT NULL DEFAULT 0,
    description     VARCHAR(255),
    reference_id    VARCHAR(32),                    -- ID relacionado (task, order, etc.)
    event_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gamification_vendor ON gamification_events(vendor_id);
CREATE INDEX idx_gamification_date ON gamification_events(event_date DESC);

-- =============================================================================
-- 18. MEDALLAS / LOGROS DESBLOQUEADOS
-- =============================================================================
-- Catálogo estático de medallas + relación de cuáles tiene cada vendedor.
-- Las medallas son mensuales o históricas (según month_key).
-- =============================================================================
CREATE TABLE medal_definitions (
    id              VARCHAR(50) PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(255),
    icon            VARCHAR(50),                    -- Emoji o icono
    criteria_type   VARCHAR(50),                    -- Condición para ganarla
    xp_bonus        INTEGER DEFAULT 0
);

CREATE TABLE vendor_medals (
    id              SERIAL PRIMARY KEY,
    vendor_id       VARCHAR(32) NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    medal_id        VARCHAR(50) NOT NULL REFERENCES medal_definitions(id),
    month_key       VARCHAR(7) NOT NULL,            -- Formato YYYY-MM
    earned_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vendor_id, medal_id, month_key)
);

CREATE INDEX idx_vendor_medals_vendor ON vendor_medals(vendor_id);

-- =============================================================================
-- 19. CONFIGURACIÓN DE NOTIFICACIONES POR USUARIO
-- =============================================================================
-- Preferencias de alertas del perfil de cada vendedor.
-- =============================================================================
CREATE TABLE user_settings (
    user_id         INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    alert_invoices  BOOLEAN DEFAULT TRUE,
    alert_anniversaries BOOLEAN DEFAULT TRUE,
    alert_ia_briefing BOOLEAN DEFAULT TRUE,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 20. SESIONES Y AUDITORÍA (Opcional pero recomendado)
-- =============================================================================
-- Registro de actividad crítica para seguridad y trazabilidad.
-- =============================================================================
CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    table_name      VARCHAR(50) NOT NULL,
    record_id       VARCHAR(32) NOT NULL,
    action          VARCHAR(20) NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
    old_values      JSONB,
    new_values      JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_table ON audit_logs(table_name, record_id);

-- =============================================================================
-- VISTAS ÚTILES (VIEWS)
-- =============================================================================

-- Vista: Resumen de CxC por cliente (pedidos entregados no pagados)
CREATE VIEW cxc_summary AS
SELECT 
    c.id AS client_id,
    c.razon_social,
    c.assigned_vendor,
    SUM(o.total) AS total_deuda,
    MAX(o.delivered_at) AS last_delivered,
    COUNT(o.id) AS pending_orders
FROM clients c
JOIN orders o ON o.client_id = c.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.razon_social, c.assigned_vendor;

-- Vista: Ranking de vendedores del mes actual
CREATE VIEW vendor_monthly_ranking AS
SELECT 
    v.id,
    v.name,
    v.zone,
    COALESCE(SUM(o.total), 0) AS monthly_sales,
    COUNT(o.id) AS monthly_orders,
    COALESCE(SUM(ge.xp_earned), 0) AS month_xp,
    v.streak
FROM vendors v
LEFT JOIN orders o ON o.vendor_id = v.id 
    AND o.status = 'paid' 
    AND DATE_TRUNC('month', o.paid_at) = DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN gamification_events ge ON ge.vendor_id = v.id 
    AND DATE_TRUNC('month', ge.event_date) = DATE_TRUNC('month', CURRENT_DATE)
WHERE v.is_active = TRUE
GROUP BY v.id, v.name, v.zone, v.streak
ORDER BY monthly_sales DESC;

-- =============================================================================
-- DATOS INICIALES MÍNIMOS (SEED)
-- =============================================================================

-- Insertar usuarios internos base (PINs deben hashearse en producción)
INSERT INTO users (email, pin_hash, role) VALUES
('ceo@ultraseco.shop', '$2y$10$placeholder', 'CEO'),
('admin@ultraseco.shop', '$2y$10$placeholder', 'admin'),
('ops@ultraseco.shop', '$2y$10$placeholder', 'ops');

-- Insertar definiciones de medallas base
INSERT INTO medal_definitions (id, name, description, icon, criteria_type, xp_bonus) VALUES
('rookie', 'Novato del Mes', 'Primer mes activo en el sistema', '🌱', 'first_month', 50),
('closer', 'Cerrador', '5 pedidos facturados en el mes', '🔥', 'orders_count', 100),
('collector', 'Cobrador de Oro', '100% de efectividad de cobranza', '💰', 'collection_rate', 150),
('explorer', 'Explorador', '10 clientes nuevos registrados', '🗺️', 'new_clients', 100),
('discipline', 'Disciplinado', '30 días de tareas completadas', '📅', 'daily_tasks_streak', 200),
('top_seller', 'Top Vendedor', '#1 en ranking mensual', '🏆', 'ranking_first', 300);

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================
