/* =====================================================
   ULTRAFORCE 360 — JavaScript Engine v4
   Ultra Seco | Venezuela 2026 | Gamificación + IA
   ===================================================== */
'use strict';

const UF = (() => {

    /* ================================================
       PRODUCTS CATALOG
       ================================================ */
    const PRODUCTS = [
        { id: 'p01', name: 'Estuco Bloqueador', cat: 'Construcción', presentations: [{ size: '1L', price: 12 }, { size: '4L', price: 40 }, { size: '20L', price: 170 }] },
        { id: 'p02', name: 'Fortificador', cat: 'Construcción', presentations: [{ size: '1L', price: 12 }, { size: '4L', price: 38 }, { size: '20L', price: 160 }] },
        { id: 'p03', name: 'Solución Exteriores', cat: 'Construcción', presentations: [{ size: '1L', price: 14 }, { size: '4L', price: 48 }, { size: '20L', price: 190 }] },
        { id: 'p04', name: 'Solución Interiores', cat: 'Construcción', presentations: [{ size: '1L', price: 13 }, { size: '4L', price: 44 }, { size: '20L', price: 180 }] },
        { id: 'p05', name: 'Pintura Súper Hidrofóbica', cat: 'Construcción', presentations: [{ size: '1L', price: 16 }, { size: '4L', price: 56 }] },
        { id: 'p06', name: 'Nano Aditivo', cat: 'Construcción', presentations: [{ size: '250ml', price: 18 }, { size: '1L', price: 58 }] },
        { id: 'p07', name: 'Champú Nano-Concentrado', cat: 'Vehicular', presentations: [{ size: '500ml', price: 15 }, { size: '1L', price: 24 }] },
        { id: 'p08', name: 'Cera Nano Protectora', cat: 'Hogar', presentations: [{ size: '500ml', price: 18 }, { size: '1L', price: 30 }] },
        { id: 'p09', name: 'Escudo Cerámico', cat: 'Hogar', presentations: [{ size: '200ml', price: 22 }, { size: '500ml', price: 48 }] },
        { id: 'p10', name: 'Ultra F3 AR (Anti-Incendio)', cat: 'Industria', presentations: [{ size: '5L', price: 85 }, { size: '20L', price: 300 }] },
        { id: 'p11', name: 'Eco Capturador (Minería)', cat: 'Industria', presentations: [{ size: '1L', price: 65 }, { size: '5L', price: 290 }] },
    ];

    /* ================================================
       DB LAYER (localStorage)
       ================================================ */
    const DB = {
        get: (k) => { try { const v = JSON.parse(localStorage.getItem('uf_' + k)); return Array.isArray(v) ? v : []; } catch { return []; } },
        set: (k, v) => localStorage.setItem('uf_' + k, JSON.stringify(v)),
        getObj: (k) => { try { return JSON.parse(localStorage.getItem('uf_' + k)) || {}; } catch { return {}; } },
        setObj: (k, v) => localStorage.setItem('uf_' + k, JSON.stringify(v)),
        uid: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    };

    const data = {
        save: (col, arr) => DB.set(col, arr),
        getAll: (col) => DB.get(col),
        add: (col, item) => { const arr = DB.get(col); item.id = item.id || DB.uid(); item.createdAt = item.createdAt || new Date().toISOString(); arr.push(item); DB.set(col, arr); return item; },
        update: (col, id, ch) => { const arr = DB.get(col); const i = arr.findIndex(x => x.id === id); if (i > -1) { Object.assign(arr[i], ch); DB.set(col, arr); return arr[i]; } return null; },
        remove: (col, id) => { const arr = DB.get(col).filter(x => x.id !== id); DB.set(col, arr); },
        find: (col, id) => DB.get(col).find(x => x.id === id),
        where: (col, fn) => DB.get(col).filter(fn),
        config: () => DB.getObj('config'),
        setConf: (k, v) => { const c = DB.getObj('config'); c[k] = v; DB.setObj('config', c); },
    };

    /* ================================================
       DEMO DATA SEEDER
       ================================================ */
    function seedDemo() {
        const currentVendors = data.getAll('vendors');
        if (currentVendors.length > 0 && currentVendors.some(v => v.active)) return;
        
        // Clear all to re-seed demo data cleanly if it was corrupted
        DB.set('vendors', []);
        DB.set('clients', []);
        DB.set('orders', []);
        DB.set('payments', []);
        DB.set('gamification_events', []);
        DB.set('dailytasks', []);
        DB.set('postulations', []);

        const vendors = [
            { id: 'v1', name: 'Carlos Morales', zone: 'Maracaibo', phone: '0414-1234567', active: true, monthGoal: 3000 },
            { id: 'v2', name: 'Luisa Rodríguez', zone: 'Caracas', phone: '0412-7654321', active: true, monthGoal: 2500 },
            { id: 'v3', name: 'Pedro Álvarez', zone: 'Valencia', phone: '0416-9876543', active: true, monthGoal: 2500 },
            { id: 'v4', name: 'María García', zone: 'Maracay', phone: '0424-1112233', active: true, monthGoal: 2000 },
            { id: 'v5', name: 'José Torres', zone: 'Pto. La Cruz', phone: '0426-3334455', active: true, monthGoal: 2000 },
        ];
        data.save('vendors', vendors);

        const clients = [
            { id: 'c01', vendorId: 'v1', razonSocial: 'Ferretería El Clavo', rif: 'J-12345678-0', city: 'Maracaibo', type: 'Ferretería', balance: 340, lastBuy: '2026-03-18', anniversary: '2020-03-15', score: 'A' },
            { id: 'c02', vendorId: 'v1', razonSocial: 'Constructora Bolivar', rif: 'J-23456789-1', city: 'Maracaibo', type: 'Constructora', balance: 0, lastBuy: '2026-04-01', anniversary: '2019-06-22', score: 'A' },
            { id: 'c03', vendorId: 'v1', razonSocial: 'Pinturas Maracaibo', rif: 'J-34567890-2', city: 'Cabimas', type: 'Distribuidor', balance: 220, lastBuy: '2026-03-25', anniversary: '2021-11-10', score: 'B' },
            { id: 'c04', vendorId: 'v2', razonSocial: 'Multi-Hogar Caracas', rif: 'J-45678901-3', city: 'Caracas', type: 'Ferretería', balance: 0, lastBuy: '2026-04-03', anniversary: '2022-01-08', score: 'A' },
            { id: 'c05', vendorId: 'v2', razonSocial: 'Inmobiliaria del Norte', rif: 'J-56789012-4', city: 'Los Teques', type: 'Constructora', balance: 560, lastBuy: '2026-03-10', anniversary: '2021-08-30', score: 'C' },
            { id: 'c06', vendorId: 'v3', razonSocial: 'Ferretería Valencia', rif: 'J-67890123-5', city: 'Valencia', type: 'Ferretería', balance: 120, lastBuy: '2026-04-01', anniversary: '2020-12-05', score: 'B' },
            { id: 'c07', vendorId: 'v4', razonSocial: 'Acabados del Centro', rif: 'J-78901234-6', city: 'Maracay', type: 'Distribuidor', balance: 0, lastBuy: '2026-03-28', anniversary: '2023-04-12', score: 'B' },
            { id: 'c08', vendorId: 'v5', razonSocial: 'Ferropetrol', rif: 'J-89012345-7', city: 'Pto. La Cruz', type: 'Ferretería', balance: 890, lastBuy: '2026-03-05', anniversary: '2021-07-19', score: 'C' },
        ];
        data.save('clients', clients);

        const orders = [
            { id: 'o01', vendorId: 'v1', clientId: 'c01', clientName: 'Ferretería El Clavo', items: [{ product: 'Estuco Bloqueador 20L', qty: 5, price: 170 }], total: 994, status: 'pending', date: '2026-04-04' },
            { id: 'o02', vendorId: 'v2', clientId: 'c04', clientName: 'Multi-Hogar Caracas', items: [{ product: 'Pintura Hidrofóbica 4L', qty: 8, price: 56 }], total: 448, status: 'accepted', date: '2026-04-03' },
            { id: 'o03', vendorId: 'v1', clientId: 'c02', clientName: 'Constructora Bolivar', items: [{ product: 'Fortificador 20L', qty: 3, price: 160 }], total: 770, status: 'process', date: '2026-04-02' },
            { id: 'o04', vendorId: 'v3', clientId: 'c06', clientName: 'Ferretería Valencia', items: [{ product: 'Estuco Bloqueador 4L', qty: 10, price: 40 }], total: 400, status: 'dispatch', date: '2026-04-01', dispatchTime: '2026-04-02 08:30', vehicle: 'Camión Azul' },
            { id: 'o05', vendorId: 'v4', clientId: 'c07', clientName: 'Acabados del Centro', items: [{ product: 'Cera Nano 500ml', qty: 12, price: 18 }], total: 216, status: 'delivered', date: '2026-03-30', deliveredTime: '2026-04-01 14:20' },
            { id: 'o06', vendorId: 'v2', clientId: 'c05', clientName: 'Inmobiliaria del Norte', items: [{ product: 'Solución Exteriores 20L', qty: 4, price: 190 }], total: 760, status: 'pending', date: '2026-04-05' },
        ];
        data.save('orders', orders);

        const payments = [
            { id: 'py01', vendorId: 'v1', clientId: 'c01', clientName: 'Ferretería El Clavo', amount: 500, method: 'Zelle', type: 'abono', date: '2026-04-02', ref: '#ZL29847', confirmed: true },
            { id: 'py02', vendorId: 'v2', clientId: 'c04', clientName: 'Multi-Hogar Caracas', amount: 448, method: 'Banesco', type: 'completo', date: '2026-04-03', ref: '#BN10293', confirmed: true },
            { id: 'py03', vendorId: 'v1', clientId: 'c02', clientName: 'Constructora Bolivar', amount: 385, method: 'Bancamiga', type: 'abono', date: '2026-04-02', ref: '#BM49283', confirmed: true },
            { id: 'py04', vendorId: 'v3', clientId: 'c06', clientName: 'Ferretería Valencia', amount: 400, method: 'Pago Móvil', type: 'completo', date: '2026-04-01', ref: '#PM83749', confirmed: true },
            { id: 'py05', vendorId: 'v4', clientId: 'c07', clientName: 'Acabados del Centro', amount: 216, method: 'Efectivo USD', type: 'completo', date: '2026-04-01', ref: '#EF-CASH', confirmed: true },
        ];
        data.save('payments', payments);

        // Seed rich XP history for each vendor to populate medals
        const today = new Date().toISOString().split('T')[0];
        const xpLog = [
            // v1 - Carlos (top performer)
            { vendorId: 'v1', action: 'order_created', xp: 25, date: '2026-04-04' },
            { vendorId: 'v1', action: 'order_created', xp: 25, date: '2026-04-02' },
            { vendorId: 'v1', action: 'payment_full', xp: 30, date: '2026-04-02' },
            { vendorId: 'v1', action: 'client_new', xp: 40, date: '2026-03-28' },
            { vendorId: 'v1', action: 'delivery_confirm', xp: 15, date: '2026-04-01' },
            { vendorId: 'v1', action: 'daily_complete', xp: 50, date: '2026-04-04' },
            { vendorId: 'v1', action: 'daily_complete', xp: 50, date: '2026-04-03' },
            { vendorId: 'v1', action: 'daily_complete', xp: 50, date: '2026-04-02' },
            { vendorId: 'v1', action: 'daily_complete', xp: 50, date: '2026-04-01' },
            { vendorId: 'v1', action: 'visit_register', xp: 10, date: '2026-04-04' },
            { vendorId: 'v1', action: 'anniversary_logged', xp: 15, date: '2026-04-01' },
            { vendorId: 'v1', action: 'payment_partial', xp: 15, date: '2026-04-02' },
            // v2 - Luisa
            { vendorId: 'v2', action: 'order_created', xp: 25, date: '2026-04-03' },
            { vendorId: 'v2', action: 'payment_full', xp: 30, date: '2026-04-03' },
            { vendorId: 'v2', action: 'daily_complete', xp: 50, date: '2026-04-03' },
            { vendorId: 'v2', action: 'daily_complete', xp: 50, date: '2026-04-02' },
            { vendorId: 'v2', action: 'visit_register', xp: 10, date: '2026-04-03' },
            { vendorId: 'v2', action: 'client_new', xp: 40, date: '2026-04-01' },
            // v3 - Pedro
            { vendorId: 'v3', action: 'order_created', xp: 25, date: '2026-04-01' },
            { vendorId: 'v3', action: 'payment_full', xp: 30, date: '2026-04-01' },
            { vendorId: 'v3', action: 'daily_complete', xp: 50, date: '2026-04-01' },
            { vendorId: 'v3', action: 'delivery_confirm', xp: 15, date: '2026-04-02' },
            // v4 - María
            { vendorId: 'v4', action: 'delivery_confirm', xp: 15, date: '2026-04-01' },
            { vendorId: 'v4', action: 'payment_full', xp: 30, date: '2026-04-01' },
            { vendorId: 'v4', action: 'daily_complete', xp: 50, date: '2026-04-01' },
            // v5 - José
            { vendorId: 'v5', action: 'order_created', xp: 25, date: '2026-03-30' },
        ];
        data.save('xplog', xpLog);

        // Seed daily tasks (v1 has several done today)
        const dailyTasks = [
            { vendorId: 'v1', date: today, task: 'briefing', done: true },
            { vendorId: 'v1', date: today, task: 'visits', done: true },
            // Streak history for Carlos (past 4 days)
            { vendorId: 'v1', date: '2026-04-05', task: 'visits', done: true },
            { vendorId: 'v1', date: '2026-04-04', task: 'visits', done: true },
            { vendorId: 'v1', date: '2026-04-03', task: 'visits', done: true },
            { vendorId: 'v1', date: '2026-04-02', task: 'visits', done: true },
            { vendorId: 'v1', date: '2026-04-01', task: 'visits', done: true },
            { vendorId: 'v2', date: '2026-04-05', task: 'visits', done: true },
            { vendorId: 'v2', date: '2026-04-04', task: 'visits', done: true },
            { vendorId: 'v2', date: '2026-04-03', task: 'visits', done: true },
        ];
        data.save('dailytasks', dailyTasks);

        const postulations = [
            { id: 'post1', name: 'Andrés Romero', ci: '18.234.567', zone: 'Barquisimeto', phone: '0412-9876543', ramo: 'Ferretería', clients: 45, volume: 2800, vehicle: 'Carro', score: 82, status: 'pending', date: '2026-04-04' },
            { id: 'post2', name: 'Daniela Ramos', ci: '22.345.678', zone: 'Mérida', phone: '0414-1112233', ramo: 'Construcción', clients: 28, volume: 1900, vehicle: 'Moto', score: 71, status: 'pending', date: '2026-04-03' },
            { id: 'post3', name: 'Luis Méndez', ci: '15.456.789', zone: 'Maracaibo', phone: '0416-2223344', ramo: 'Ferretería', clients: 60, volume: 3500, vehicle: 'Camioneta', score: 91, status: 'approved', date: '2026-04-01' },
        ];
        data.save('postulations', postulations);

        DB.setObj('config', {
            commissionBase: 0.08,
            bonusTeam: 0.01,
            bonusTasks: 0.01,
            monthGoalTeam: 15000,
            teamSales: 10960,   // current team sales (simulated)
            pins: { CEO: '9090', admin: '5678', ops: '3322' },
        });

        data.add('seeded', { seeded: true });
    }

    /* ================================================
       AUTH
       ================================================ */
    const Auth = {
        login(role, vendorId, pin) {
            const conf = data.config();
            if (role === 'vendor') {
                const v = data.find('vendors', vendorId);
                if (!v) return false;
                DB.setObj('session', { role: 'vendor', vendorId, name: v.name });
                return v;
            }
            if (pin !== conf.pins[role]) return false;
            const names = { CEO: 'CEO — Ultra Seco', admin: 'Administradora', ops: 'Equipo Operativo' };
            DB.setObj('session', { role, name: names[role] });
            return true;
        },
        logout() { DB.setObj('session', {}); },
        session() { return DB.getObj('session'); },
    };

    /* ================================================
       HELPERS
       ================================================ */
    function sameMonth(dateStr) {
        const d = new Date(dateStr), n = new Date();
        return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }

    function computeStreak(vendorId) {
        const tasks = data.where('dailytasks', t => t.vendorId === vendorId && t.task === 'visits' && t.done);
        const days = [...new Set(tasks.map(t => t.date))].sort().reverse();
        if (!days.length) return 0;
        let streak = 0, cursor = new Date(); cursor.setHours(0, 0, 0, 0);
        for (const d of days) {
            const dt = new Date(d); dt.setHours(0, 0, 0, 0);
            if (Math.round((cursor - dt) / 86400000) <= 1) { streak++; cursor = dt; }
            else break;
        }
        return streak;
    }

    /* ================================================
       XP ACTION MAP
       ================================================ */
    const XP_MAP = {
        visit_register: 10,
        order_created: 25,
        delivery_confirm: 15,
        payment_full: 30,
        payment_partial: 15,
        client_new: 40,
        cold_client_reactivated: 20,
        document_upload: 10,
        anniversary_logged: 15,
        daily_complete: 50,
        weekly_goal: 100,
        monthly_goal: 300,
        task_delegated_complete: 30,
    };

    /* ================================================
       MEDALS (17 total — 3 categories)
       ================================================ */
    const MEDALS = [
        // === ACTIVIDAD ===
        {
            id: 'first_step', icon: '👟', name: 'Primer Paso', cat: 'Actividad',
            desc: 'Registrar su primer pedido',
            condition: (log) => log.some(e => e.action === 'order_created'),
        },
        {
            id: 'streak7', icon: '🔥', name: 'En Racha', cat: 'Actividad',
            desc: '7 días consecutivos completando todas las tareas',
            condition: (log, vId) => computeStreak(vId) >= 7,
        },
        {
            id: 'streak30', icon: '⚡', name: 'Imparable', cat: 'Actividad',
            desc: '30 días consecutivos completando todas las tareas',
            condition: (log, vId) => computeStreak(vId) >= 30,
        },
        {
            id: 'hunter5', icon: '🎯', name: 'Cazador', cat: 'Actividad',
            desc: 'Sumar 5 clientes nuevos en un mes',
            condition: (log) => log.filter(e => e.action === 'client_new' && sameMonth(e.date)).length >= 5,
        },
        {
            id: 'expander', icon: '🗺️', name: 'Expansor', cat: 'Actividad',
            desc: 'Clientes activos en 3 o más ciudades',
            condition: (log, vId) => {
                const cities = [...new Set(data.where('clients', c => c.vendorId === vId).map(c => c.city))];
                return cities.length >= 3;
            },
        },
        {
            id: 'documented', icon: '📁', name: 'Documentado', cat: 'Actividad',
            desc: '100% de clientes con documentos cargados',
            condition: (log) => log.filter(e => e.action === 'document_upload').length >= 5,
        },
        // === VENTAS ===
        {
            id: 'first_close', icon: '🥇', name: 'Primer Cierre', cat: 'Ventas',
            desc: 'Primer pedido entregado y cobrado',
            condition: (log) => log.some(e => e.action === 'delivery_confirm'),
        },
        {
            id: 'top_month', icon: '🏆', name: 'Vendedor del Mes', cat: 'Ventas',
            desc: 'Mayor volumen de ventas del mes',
            condition: (log, vId) => {
                const ranking = _getBasicRanking();
                return ranking.length > 0 && ranking[0].id === vId;
            },
        },
        {
            id: 'top3', icon: '🎖️', name: 'Top 3', cat: 'Ventas',
            desc: 'Quedar entre los 3 primeros del ranking mensual',
            condition: (log, vId) => {
                const ranking = _getBasicRanking();
                return ranking.slice(0, 3).some(v => v.id === vId);
            },
        },
        {
            id: 'centurion', icon: '⚔️', name: 'Centurión', cat: 'Ventas',
            desc: '100 pedidos entregados acumulados',
            condition: (log) => log.filter(e => e.action === 'delivery_confirm').length >= 100,
        },
        {
            id: 'elite_collector', icon: '💰', name: 'Cobrador Élite', cat: 'Ventas',
            desc: 'Registrar 8+ pagos completos en un mes',
            condition: (log) => log.filter(e => e.action === 'payment_full' && sameMonth(e.date)).length >= 8,
        },
        {
            id: 'ultra_vendor', icon: '🌟', name: 'Ultra Vendedor', cat: 'Ventas',
            desc: 'Cumplir meta 3 meses consecutivos',
            condition: (log) => log.filter(e => e.action === 'monthly_goal').length >= 3,
        },
        {
            id: 'legend', icon: '👑', name: 'Leyenda Ultra', cat: 'Ventas',
            desc: 'Cumplir meta 6 meses consecutivos',
            condition: (log) => log.filter(e => e.action === 'monthly_goal').length >= 6,
        },
        // === FIDELIZACIÓN ===
        {
            id: 'fidelizer', icon: '🤝', name: 'Fidelizador', cat: 'Fidelización',
            desc: '10 clientes que compran ≥2 veces al mes por 3 meses',
            condition: (log) => log.filter(e => e.action === 'payment_full').length >= 10,
        },
        {
            id: 'anti_abandon', icon: '🛡️', name: 'Anti-Abandono', cat: 'Fidelización',
            desc: 'Reactivar 3 clientes fríos en un mes',
            condition: (log) => log.filter(e => e.action === 'cold_client_reactivated' && sameMonth(e.date)).length >= 3,
        },
        {
            id: 'anniversary_pro', icon: '🎂', name: 'Aniversarista', cat: 'Fidelización',
            desc: 'Felicitar 10 aniversarios de clientes',
            condition: (log) => log.filter(e => e.action === 'anniversary_logged').length >= 10,
        },
        {
            id: 'visit_king', icon: '🚗', name: 'Rey de Visitas', cat: 'Fidelización',
            desc: 'Registrar 50 visitas a clientes',
            condition: (log) => log.filter(e => e.action === 'visit_register').length >= 50,
        },
    ];

    function _getBasicRanking() {
        const vendors = data.getAll('vendors').filter(v => v.active);
        return vendors.map(v => {
            const sales = data.where('orders', o => o.vendorId === v.id && sameMonth(o.date)).reduce((s, o) => s + (o.total || 0), 0);
            return { ...v, monthlySales: sales };
        }).sort((a, b) => b.monthlySales - a.monthlySales);
    }

    /* ================================================
       GAMIFICATION ENGINE
       ================================================ */
    const Gamification = {
        logXP(vendorId, action) {
            const xp = XP_MAP[action] || 0;
            if (!xp) return 0;
            data.add('xplog', { vendorId, action, xp, date: new Date().toISOString().split('T')[0] });
            return xp;
        },

        getXP(vendorId) {
            const log = data.where('xplog', e => e.vendorId === vendorId);
            const monthXP = log.filter(e => sameMonth(e.date)).reduce((s, e) => s + e.xp, 0);
            const totalXP = log.reduce((s, e) => s + e.xp, 0);
            return { monthXP, totalXP };
        },

        getMedals(vendorId) {
            const log = data.where('xplog', e => e.vendorId === vendorId);
            return MEDALS.map(m => ({ ...m, earned: (() => { try { return m.condition(log, vendorId); } catch { return false; } })() }));
        },

        getRanking() {
            const vendors = data.getAll('vendors').filter(v => v.active);
            return vendors.map(v => {
                const xp = Gamification.getXP(v.id);
                const sales = data.where('orders', o => o.vendorId === v.id && sameMonth(o.date)).reduce((s, o) => s + (o.total || 0), 0);
                const pay = data.where('payments', p => p.vendorId === v.id && sameMonth(p.date)).reduce((s, p) => s + (p.amount || 0), 0);
                const medals = Gamification.getMedals(v.id).filter(m => m.earned);
                return {
                    ...v,
                    monthXP: xp.monthXP,
                    totalXP: xp.totalXP,
                    streak: computeStreak(v.id),
                    monthlySales: sales,
                    monthlyCollected: pay,
                    earnedMedals: medals,
                };
            }).sort((a, b) => b.monthXP - a.monthXP);
        },

        getClientScore(client) {
            const daysSince = Math.round((new Date() - new Date(client.lastBuy || client.createdAt)) / 86400000);
            if (daysSince <= 15 && client.balance === 0) return 'A';
            if (daysSince <= 30) return 'B';
            return 'C';
        },
    };

    /* ================================================
       COMMISSION ENGINE (8% base + 2% bonuses)
       ================================================ */
    const Commission = {
        calc(vendorId) {
            const conf = data.config();
            const now = new Date();

            const payments = data.where('payments', p => p.vendorId === vendorId && sameMonth(p.date));
            const collected = payments.reduce((s, p) => s + (p.amount || 0), 0);
            const orders = data.where('orders', o => o.vendorId === vendorId && sameMonth(o.date));
            const sales = orders.reduce((s, o) => s + (o.total || 0), 0);
            const base = collected * conf.commissionBase;

            // Team bonus (when team reaches 100% of monthly goal)
            const teamPct = Math.min((conf.teamSales || 0) / (conf.monthGoalTeam || 15000), 1);
            const bonusTeam = teamPct >= 1 ? collected * conf.bonusTeam : 0;

            // Task discipline bonus (all working days completed this month)
            const daysInMonth = now.getDate();
            const doneDaysSet = [...new Set(
                data.where('dailytasks', t => t.vendorId === vendorId && t.task === 'visits' && t.done && sameMonth(t.date)).map(t => t.date)
            )];
            const doneDays = doneDaysSet.length;
            const bonusTasks = doneDays >= daysInMonth ? collected * conf.bonusTasks : 0;

            // Projection: how much more to hit team goal
            const teamGoal = conf.monthGoalTeam || 15000;
            const teamSales = conf.teamSales || 0;
            const remaining = Math.max(0, teamGoal - teamSales);
            const teamProg = Math.min(teamPct * 100, 100);

            // Projection if team hits goal
            const projectedIfTeam = base + (collected * conf.bonusTeam) + bonusTasks;

            return {
                collected, sales, base, bonusTeam, bonusTasks,
                total: base + bonusTeam + bonusTasks,
                teamPct, teamProg, doneDays, daysInMonth,
                teamGoal, teamSales, remaining,
                projectedIfTeam,
                streak: computeStreak(vendorId),
            };
        },
    };

    /* ================================================
       CLIENT ALERTS ENGINE
       ================================================ */
    const Alerts = {
        generate(vendorId) {
            const alerts = [];
            const today = new Date();
            const clients = data.where('clients', c => c.vendorId === vendorId);

            clients.forEach(c => {
                const last = new Date(c.lastBuy || c.createdAt);
                const daysSince = Math.round((today - last) / 86400000);

                if (c.balance > 0 && daysSince > 30)
                    alerts.push({ type: 'danger', label: `${c.razonSocial}: $${c.balance} — ${daysSince}d sin comprar` });
                else if (daysSince > 20)
                    alerts.push({ type: 'warn', label: `${c.razonSocial} lleva ${daysSince} días sin comprar` });

                if (c.anniversary) {
                    const anniv = new Date(c.anniversary);
                    anniv.setFullYear(today.getFullYear());
                    if (anniv < today) anniv.setFullYear(today.getFullYear() + 1);
                    const daysTo = Math.round((anniv - today) / 86400000);
                    if (daysTo <= 7)
                        alerts.push({ type: 'ok', label: `🎂 Aniversario de ${c.razonSocial} en ${daysTo || 'HOY'} día(s)` });
                }
            });

            data.where('orders', o => o.vendorId === vendorId && o.status === 'dispatch').forEach(o => {
                const hrs = Math.round((today - new Date(o.dispatchTime || o.date)) / 3600000);
                if (hrs >= 48) alerts.push({ type: 'warn', label: `Pedido ${o.id} despachado hace ${Math.round(hrs / 24)} días sin confirmar` });
            });

            return alerts;
        },
    };

    /* ================================================
       AI BRIEFING GENERATOR (Motivacional + Contextual)
       ================================================ */
    const Briefing = {
        generate(vendorId) {
            const v = data.find('vendors', vendorId);
            if (!v) return { greet: 'Hola', msg: '' };

            const today = new Date();
            const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
            const com = Commission.calc(vendorId);
            const xp = Gamification.getXP(vendorId);
            const streak = com.streak;
            const alerts = Alerts.generate(vendorId).filter(a => a.type !== 'ok');
            const pending = data.where('orders', o => o.vendorId === vendorId && ['pending', 'accepted'].includes(o.status)).length;
            const clients = data.where('clients', c => c.vendorId === vendorId);
            const cold = clients.filter(c => Math.round((today - new Date(c.lastBuy || c.createdAt)) / 86400000) > 20).length;
            const tasks = Tasks.getToday(vendorId);
            const doneToday = tasks.filter(t => t.done).length;

            const firstName = v.name.split(' ')[0];
            let greet = `¡Buenos días, ${firstName}!`;
            let lines = [];

            // Streak message
            if (streak >= 30) lines.push(`⚡ IMPARABLE: Llevas <strong>${streak} días consecutivos</strong> completando tareas. ¡Eres una máquina!`);
            else if (streak >= 7) lines.push(`🔥 Llevas <strong>${streak} días en racha</strong>. ¡${30 - streak} más para la medalla IMPARABLE!`);
            else if (streak >= 1) lines.push(`🔥 Racha activa: <strong>${streak} días</strong>. ¡Sigue así!`);
            else lines.push(`💪 Nuevo día, nueva oportunidad. ¡Reactiva tu racha de tareas hoy!`);

            // Commission snapshot
            lines.push(`💵 Comisión estimada este mes: <strong>$${com.total.toFixed(2)}</strong> sobre $${com.collected} cobrado.`);

            // Team goal message
            if (com.teamProg < 100) {
                lines.push(`🎯 El equipo va al <strong>${com.teamProg.toFixed(0)}%</strong> de la meta. Faltan $${com.remaining.toFixed(0)} para activar el bono colectivo de +1%.`);
            } else {
                lines.push(`🏆 El equipo alcanzó la meta. ¡El bono de +1% está <strong>ACTIVO</strong>!`);
            }

            // Alerts
            if (alerts.length > 0) lines.push(`⚠️ Tienes <strong>${alerts.length} alerta(s)</strong> de clientes que necesitan atención.`);
            if (cold > 0) lines.push(`❄️ <strong>${cold} cliente(s)</strong> llevan más de 20 días sin comprar. Contáctalos hoy.`);
            if (pending > 0) lines.push(`📦 <strong>${pending} pedido(s)</strong> esperando confirmación.`);

            // Tasks status
            if (doneToday === tasks.length) lines.push(`✅ ¡Todas las tareas de hoy completadas! Ganaste <strong>+50 XP bonus</strong>.`);
            else lines.push(`📋 Tareas de hoy: <strong>${doneToday}/${tasks.length}</strong> completadas. Termínalas para ganar el bono.`);

            // XP gamification nudge
            const medals = Gamification.getMedals(vendorId);
            const nextMedal = medals.find(m => !m.earned);
            if (nextMedal) lines.push(`🏅 Próxima medalla disponible: <strong>${nextMedal.icon} ${nextMedal.name}</strong> — ${nextMedal.desc}.`);

            return { greet, msg: lines.join('<br>') };
        },

        getMotivationalAlertPills(vendorId) {
            const com = Commission.calc(vendorId);
            const streak = com.streak;
            const pills = [];
            if (streak >= 7) pills.push({ type: 'ok', icon: '🔥', label: `Racha ${streak}d` });
            if (com.teamProg >= 100) pills.push({ type: 'ok', icon: '🏆', label: 'Bono equipo activo' });
            else pills.push({ type: 'warn', icon: '🎯', label: `Equipo ${com.teamProg.toFixed(0)}%` });
            if (com.doneDays >= com.daysInMonth) pills.push({ type: 'ok', icon: '✅', label: '+1% disciplina' });
            return pills;
        },
    };

    /* ================================================
       DAILY TASKS ENGINE
       ================================================ */
    const Tasks = {
        definitions: [
            { id: 'briefing', icon: '🧠', label: 'Revisar briefing del Gerente IA', xp: 10 },
            { id: 'visits', icon: '🚗', label: 'Registrar mínimo 2 clientes visitados', xp: 20 },
            { id: 'alerts', icon: '⚠️', label: 'Atender todas las alertas de mora activas', xp: 15 },
            { id: 'orders', icon: '📦', label: 'Actualizar estatus de pedidos pendientes', xp: 15 },
        ],
        getToday(vendorId) {
            const today = new Date().toISOString().split('T')[0];
            const done = data.where('dailytasks', t => t.vendorId === vendorId && t.date === today);
            return Tasks.definitions.map(def => ({ ...def, done: done.some(d => d.task === def.id) }));
        },
        complete(vendorId, taskId) {
            const today = new Date().toISOString().split('T')[0];
            if (!data.where('dailytasks', t => t.vendorId === vendorId && t.task === taskId && t.date === today).length) {
                data.add('dailytasks', { vendorId, task: taskId, date: today, done: true });
                Gamification.logXP(vendorId, taskId === 'visits' ? 'visit_register' : 'document_upload');
            }
            // Check if all done → bonus XP
            const allNow = Tasks.getToday(vendorId).every(t => t.done || t.id === taskId);
            if (allNow) { Gamification.logXP(vendorId, 'daily_complete'); return true; }
            return false;
        },
        delegate(senderId, senderName, receiverId, title, desc, dueDate) {
            return data.add('delegated_tasks', {
                senderId, senderName, receiverId, title, desc, dueDate,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        },
        getDelegated(userId, role) {
            return data.where('delegated_tasks', t => 
                t.receiverId === userId || 
                t.receiverId === 'role_' + role || 
                t.receiverId === 'role_any'
            );
        },
        completeDelegated(taskId, userId) {
            const t = data.find('delegated_tasks', taskId);
            if (!t) return null;
            if (t.receiverId.startsWith('role_')) {
                const cb = t.completedBy || [];
                if (!cb.includes(userId)) cb.push(userId);
                data.update('delegated_tasks', taskId, { completedBy: cb });
            } else {
                data.update('delegated_tasks', taskId, { status: 'done', completedAt: new Date().toISOString() });
            }
            Gamification.logXP(userId, 'task_delegated_complete');
            return t;
        }
    };

    /* ================================================
       ORDERS
       ================================================ */
    const Orders = {
        STATUS_LABELS: {
            pending: '🟡 Por Aceptar',
            accepted: '🔵 Aceptado',
            process: '🔧 En Proceso',
            dispatch: '🚚 Despachado',
            delivered: '✅ Entregado',
        },
        STATUS_CSS: {
            pending: 'status-pending', accepted: 'status-accepted',
            process: 'status-process', dispatch: 'status-dispatch', delivered: 'status-delivered',
        },
        advance(orderId, newStatus, extra = {}) {
            return data.update('orders', orderId, { status: newStatus, ...extra });
        },
    };

    /* ================================================
       CEO ANALYTICS
       ================================================ */
    const Analytics = {
        overview() {
            const orders = data.getAll('orders');
            const payments = data.getAll('payments');
            const monthPay = payments.filter(p => sameMonth(p.date));
            const totalCollected = monthPay.reduce((s, p) => s + (p.amount || 0), 0);
            const totalSales = orders.filter(o => sameMonth(o.date)).reduce((s, o) => s + (o.total || 0), 0);
            const activeClients = [...new Set(orders.filter(o => sameMonth(o.date)).map(o => o.clientId))].length;
            const byStatus = {};
            Object.keys(Orders.STATUS_LABELS).forEach(k => byStatus[k] = orders.filter(o => o.status === k).length);
            const conf = data.config();
            const teamPct = Math.min((conf.teamSales || 0) / (conf.monthGoalTeam || 15000), 1);

            return {
                totalCollected, totalSales, activeClients, byStatus,
                vendors: data.getAll('vendors').filter(v => v.active).length,
                pendingPostulations: data.where('postulations', p => p.status === 'pending').length,
                teamPct, teamSales: conf.teamSales || 0, teamGoal: conf.monthGoalTeam || 15000,
            };
        },
    };

    /* ================================================
       NETLIFY API HELPERS (Absolute URL for GitHub Pages)
       ================================================ */
    const API_BASE = 'https://tu-sitio-en-netlify.netlify.app/.netlify/functions/api';

    async function api(path, opts = {}) {
        const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
        const res = await fetch(url, {
            ...opts,
            headers: {
                'Content-Type': 'application/json',
                ...(opts.headers || {}),
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${res.status}`);
        }
        return res.json();
    }

    const API = {
        products: ()           => api('/products'),
        product: (id)          => api(`/products/${id}`),
        orders: (qs = '')      => api(`/orders${qs}`),
        createOrder: (body)    => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
        clients: (qs = '')     => api(`/clients${qs}`),
        createClient: (body)   => api('/clients', { method: 'POST', body: JSON.stringify(body) }),
        vendors: ()            => api('/vendors'),
        users: (body)          => api('/users',   { method: 'POST', body: JSON.stringify(body) }),
    };

    /* ================================================
       FORMATTERS
       ================================================ */
    const fmt = {
        usd: (n) => `$${Number(n || 0).toFixed(2)}`,
        date: (s) => { if (!s) return '-'; const d = new Date(s); return isNaN(d) ? s : d.toLocaleDateString('es-VE'); },
        dateAgo: (s) => { if (!s) return '-'; const diff = Math.round((new Date() - new Date(s)) / 86400000); if (diff === 0) return 'Hoy'; if (diff === 1) return 'Ayer'; return `Hace ${diff}d`; },
        pct: (n) => `${(n * 100).toFixed(1)}%`,
    };

    /* ================================================
       TOAST UTILITY
       ================================================ */
    function toast(msg, type = 'info') {
        const c = document.getElementById('uf-toast-container');
        if (!c) return;
        const t = document.createElement('div');
        t.className = `uf-toast ${type}`;
        const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
        t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(60px)'; t.style.transition = 'all 0.3s'; setTimeout(() => t.remove(), 300); }, 3500);
    }

    function openModal(id) { document.getElementById(id)?.classList.add('open'); }
    function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

    /* ================================================
       PUBLIC API
       ================================================ */
    return {
        PRODUCTS, MEDALS, XP_MAP, DB, data, Auth,
        Gamification, Commission, Alerts, Briefing, Tasks, Orders, Analytics,
        toast, openModal, closeModal, fmt, sameMonth, computeStreak,
        API,
        init() { this.seedDemo(); return this; },
        seedDemo,
    };

})();
