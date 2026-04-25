// =============================================================================
// UltraForce 360 — API REST con Neon Serverless Postgres
// Netlify Function: /.netlify/functions/api
// =============================================================================
// Este handler enruta peticiones REST hacia Neon Postgres usando el driver
// @neondatabase/serverless, optimizado para runtimes serverless/edge.
//
// Variables de entorno requeridas en Netlify:
//   DATABASE_URL = postgres://user:pass@host.neon.tech/dbname?sslmode=require
//
// Endpoints:
//   GET  /api/products          → Lista el catálogo (articulos)
//   GET  /api/products/:id      → Detalle de un producto
//   POST /api/users             → Registrar un nuevo usuario/vendedor
//   POST /api/orders            → Crear un pedido/reporte
//   GET  /api/orders            → Listar pedidos
//   GET  /api/clients           → Listar clientes
//   POST /api/clients           → Crear cliente
//   GET  /api/vendors           → Listar vendedores
// =============================================================================

import { neon } from '@neondatabase/serverless';

// ── CORS headers ─────────────────────────────────────────────────────────────
const ALLOWED_ORIGIN = 'https://ultraseco.github.io';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

// ── Helper: respuesta JSON estandarizada ─────────────────────────────────────
const json = (status, body) => ({
  statusCode: status,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
});

// ── Helper: parsear path ─────────────────────────────────────────────────────
const parsePath = (rawPath) => {
  const clean = rawPath.replace('/.netlify/functions/api', '').replace('/api', '');
  const segments = clean.split('/').filter(Boolean);
  return { resource: segments[0] || '', id: segments[1] || null };
};

// ── Helper: validar body mínimo ──────────────────────────────────────────────
const safeJson = (str, fallback = {}) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

// ── Main handler ─────────────────────────────────────────────────────────────
export const handler = async (event, context) => {
  // Responder inmediatamente a preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const { resource, id } = parsePath(event.path);
  const sql = neon(process.env.DATABASE_URL);

  try {
    // ═══════════════════════════════════════════════════════════════════════
    // GET /api/products  →  Catálogo de productos (articulos)
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'GET' && resource === 'products') {
      if (id) {
        const rows = await sql`
          SELECT p.*, json_agg(
            json_build_object(
              'id', po.id,
              'label', po.label,
              'sku', po.sku,
              'price', po.price,
              'wholesale_price', po.wholesale_price
            )
          ) AS options
          FROM products p
          LEFT JOIN product_options po ON po.product_id = p.id
          WHERE p.id = ${id}
          GROUP BY p.id
        `;
        if (!rows.length) return json(404, { error: 'Producto no encontrado' });
        return json(200, { product: rows[0] });
      }

      const rows = await sql`
        SELECT p.*, json_agg(
          json_build_object(
            'id', po.id,
            'label', po.label,
            'sku', po.sku,
            'price', po.price,
            'wholesale_price', po.wholesale_price
          )
        ) AS options
        FROM products p
        LEFT JOIN product_options po ON po.product_id = p.id
        WHERE p.is_active = true
        GROUP BY p.id
        ORDER BY p.category, p.name
      `;
      return json(200, { products: rows });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GET /api/orders  →  Listar pedidos
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'GET' && resource === 'orders') {
      const { vendorId, clientId, status } = event.queryStringParameters || {};
      let query = sql`SELECT o.*, c.razon_social AS client_name, v.name AS vendor_name
        FROM orders o
        JOIN clients c ON c.id = o.client_id
        JOIN vendors v ON v.id = o.vendor_id
        WHERE 1=1`;

      if (vendorId) query = sql`${query} AND o.vendor_id = ${vendorId}`;
      if (clientId) query = sql`${query} AND o.client_id = ${clientId}`;
      if (status) query = sql`${query} AND o.status = ${status}`;

      query = sql`${query} ORDER BY o.date DESC LIMIT 200`;
      const rows = await query;
      return json(200, { orders: rows });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // POST /api/orders  →  Crear pedido (reporte de venta)
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'POST' && resource === 'orders') {
      const body = safeJson(event.body);
      const { vendor_id, client_id, items, global_discount = 0, notes = '' } = body;

      if (!vendor_id || !client_id || !Array.isArray(items) || items.length === 0) {
        return json(400, { error: 'Faltan campos obligatorios: vendor_id, client_id, items[]' });
      }

      // Calcular totales
      let lineSubtotal = 0;
      items.forEach((i) => {
        const qty = parseFloat(i.qty) || 1;
        const price = parseFloat(i.price) || 0;
        const disc = parseFloat(i.discount) || 0;
        lineSubtotal += qty * price * (1 - disc / 100);
      });
      const grandTotal = lineSubtotal * (1 - parseFloat(global_discount) / 100);
      const orderId = `ord_${Date.now().toString(36)}`;

      // Insertar orden
      await sql`
        INSERT INTO orders (id, vendor_id, client_id, status, total, global_discount, notes, date)
        VALUES (${orderId}, ${vendor_id}, ${client_id}, 'pending_approval', ${grandTotal}, ${global_discount}, ${notes}, NOW())
      `;

      // Insertar líneas
      for (const item of items) {
        const qty = parseFloat(item.qty) || 1;
        const price = parseFloat(item.price) || 0;
        const disc = parseFloat(item.discount) || 0;
        const lineTotal = qty * price * (1 - disc / 100);
        await sql`
          INSERT INTO order_items (order_id, product_id, option_id, name, label, sku, price, qty, discount, line_total)
          VALUES (
            ${orderId}, ${item.product_id || null}, ${item.option_id || null},
            ${item.name}, ${item.label || ''}, ${item.sku || ''},
            ${price}, ${qty}, ${disc}, ${lineTotal}
          )
        `;
      }

      return json(201, { success: true, order_id: orderId, total: grandTotal });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GET /api/clients  →  Listar clientes
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'GET' && resource === 'clients') {
      const { vendorId, stage, type } = event.queryStringParameters || {};
      let rows = await sql`SELECT * FROM clients WHERE 1=1`;
      if (vendorId) rows = await sql`SELECT * FROM clients WHERE vendor_id = ${vendorId} OR assigned_vendor = ${vendorId}`;
      if (stage) rows = await sql`SELECT * FROM clients WHERE stage = ${stage}`;
      if (type) rows = await sql`SELECT * FROM clients WHERE type = ${type}`;
      return json(200, { clients: rows });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // POST /api/clients  →  Crear cliente
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'POST' && resource === 'clients') {
      const b = safeJson(event.body);
      const clientId = `cli_${Date.now().toString(36)}`;

      await sql`
        INSERT INTO clients (
          id, vendor_id, assigned_vendor, razon_social, rif, phone, email,
          address, city, lat, lng, manager_name, manager_phone, social_media,
          type, stage, score, balance, created_at
        ) VALUES (
          ${clientId}, ${b.vendor_id || null}, ${b.assigned_vendor || b.vendor_id || null},
          ${b.razon_social}, ${b.rif || ''}, ${b.phone || ''}, ${b.email || ''},
          ${b.address}, ${b.city || ''}, ${b.lat || null}, ${b.lng || null},
          ${b.manager_name || ''}, ${b.manager_phone || ''}, ${b.social_media || ''},
          ${b.type || 'Ferretería'}, ${b.stage || 'lead'}, ${b.score || 'B'}, 0, NOW()
        )
      `;
      return json(201, { success: true, client_id: clientId });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GET /api/vendors  →  Listar vendedores
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'GET' && resource === 'vendors') {
      const rows = await sql`SELECT id, name, email, phone, zone, ramo, sector, xp_total, streak, is_active, joined_at FROM vendors WHERE is_active = true`;
      return json(200, { vendors: rows });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // POST /api/users  →  Registrar nuevo usuario + vendedor
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'POST' && resource === 'users') {
      const b = safeJson(event.body);
      const { name, email, phone, zone, ramo, role = 'vendor' } = b;

      if (!name || !email) {
        return json(400, { error: 'Faltan campos obligatorios: name, email' });
      }

      // Crear usuario base
      const userRows = await sql`
        INSERT INTO users (email, role, is_active, created_at)
        VALUES (${email}, ${role}, true, NOW())
        RETURNING id
      `;
      const userId = userRows[0].id;

      // Si es vendedor, crear ficha
      let vendorId = null;
      if (role === 'vendor') {
        vendorId = `v_${Date.now()}`;
        await sql`
          INSERT INTO vendors (id, user_id, name, email, phone, zone, ramo, joined_at, is_active)
          VALUES (${vendorId}, ${userId}, ${name}, ${email}, ${phone || ''}, ${zone || ''}, ${ramo || ''}, NOW(), true)
        `;
      }

      return json(201, { success: true, user_id: userId, vendor_id: vendorId });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // POST /api/reports  →  Crear reporte (alias de orders para semántica)
    // ═══════════════════════════════════════════════════════════════════════
    if (event.httpMethod === 'POST' && resource === 'reports') {
      // Reutiliza la lógica de orders
      event.path = '/api/orders';
      return handler(event, context);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 404 — Recurso no encontrado
    // ═══════════════════════════════════════════════════════════════════════
    return json(404, { error: 'Recurso no encontrado', path: event.path, method: event.httpMethod });

  } catch (err) {
    console.error('API Error:', err);
    return json(500, { error: 'Error interno del servidor', detail: err.message });
  }
};
