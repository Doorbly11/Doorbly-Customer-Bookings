import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Database,
  ExternalLink,
  FileCode,
  ShieldCheck,
  Sparkles,
  Terminal,
  Layers,
  AlertCircle,
  RefreshCw,
  Play,
  Download,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES_MASTER, SERVICES_MASTER } from '../data/serviceCatalogMaster';
import { getSupabaseConfig, seedDatabaseIfEmpty, syncMasterCatalogToSupabase } from '../lib/supabase';
import { generateProductionSchemaSql, generateMasterCatalogMigrationSql } from '../lib/sqlExport';

export const AdminSqlPanel: React.FC = () => {
  const [activeSqlTab, setActiveSqlTab] = useState<'master-catalog' | 'schema' | 'seed' | 'audit' | 'realtime'>('master-catalog');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [isSyncingMaster, setIsSyncingMaster] = useState<boolean>(false);
  const [masterSyncProgress, setMasterSyncProgress] = useState<string | null>(null);
  const [masterSyncResult, setMasterSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const config = getSupabaseConfig();
  const projectRef = 'inbdcdskhjnannbcpbtz';
  const supabaseSqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleDownloadSql = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSyncMasterCatalog = async () => {
    setIsSyncingMaster(true);
    setMasterSyncProgress('Initializing catalog synchronization...');
    setMasterSyncResult(null);
    try {
      const res = await syncMasterCatalogToSupabase((progress) => {
        setMasterSyncProgress(progress);
      });
      setMasterSyncResult(res);
    } catch (err: any) {
      setMasterSyncResult({
        success: false,
        message: err?.message || 'Synchronization encountered an issue. Try running the SQL migration in Supabase SQL Editor.'
      });
    } finally {
      setIsSyncingMaster(false);
      setMasterSyncProgress(null);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedDatabaseIfEmpty();
      setSeedResult(res.message);
    } catch (err: any) {
      setSeedResult(`Seeding notification: ${err?.message || 'Attempted seed. Verify network or table permissions in Supabase.'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Master Catalog Migration SQL (50 Categories & 978 Unique Services)
  const masterCatalogSql = useMemo(() => {
    return generateMasterCatalogMigrationSql();
  }, []);

  // 1. Complete DDL Schema SQL directly from the authoritative export
  const fullSchemaSql = useMemo(() => {
    return generateProductionSchemaSql();
  }, []);

  // 2. Catalog Seed Data SQL (32 Categories & 379 Services)
  const catalogSeedSql = useMemo(() => {
    const catInserts = CATEGORIES_MASTER.map(c => {
      const escapedName = c.name.replace(/'/g, "''");
      const escapedDesc = (c.description || '').replace(/'/g, "''");
      return `INSERT INTO service_categories (name, slug, description, icon_name, sort_order, is_active)
VALUES ('${escapedName}', '${c.slug}', '${escapedDesc}', '${c.icon}', ${c.sort_order}, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  sort_order = EXCLUDED.sort_order;`;
    }).join('\n\n');

    const srvInserts = SERVICES_MASTER.map(s => {
      const escapedName = s.name.replace(/'/g, "''");
      const escapedDesc = (s.description || '').replace(/'/g, "''");
      return `INSERT INTO services (
  category_id, name, slug, description, pricing_type,
  partner_hourly_rate, customer_hourly_price, commission_percentage,
  minimum_hours, maximum_hours, is_active
)
SELECT 
  id, '${escapedName}', '${s.slug}', '${escapedDesc}', 'hourly',
  ${s.partner_hourly_rate}, ${s.customer_hourly_price}, 20.00,
  ${s.minimum_hours}, ${s.maximum_hours}, true
FROM service_categories WHERE slug = '${s.category_slug}'
ON CONFLICT (slug) DO UPDATE SET
  partner_hourly_rate = EXCLUDED.partner_hourly_rate,
  customer_hourly_price = EXCLUDED.customer_hourly_price,
  commission_percentage = EXCLUDED.commission_percentage,
  description = EXCLUDED.description,
  is_active = true;`;
    }).join('\n\n');

    return `-- ==============================================================================
-- DOORBLY CATALOG SEED DATA (32 Categories & 379 Hourly Trade Services)
-- Formula: customer_hourly_price = partner_hourly_rate / 0.80 (20% commission)
-- Safe to re-run: Idempotent ON CONFLICT updates
-- ==============================================================================

-- 1. SEED 32 SERVICE CATEGORIES
${catInserts}

-- 2. SEED 379 SERVICES WITH 20% COMMISSION FORMULA
${srvInserts}
`;
  }, []);

  // 3. Verification & Audit SQL
  const auditSql = useMemo(() => {
    return `-- ==============================================================================
-- DOORBLY VERIFICATION & AUDIT QUERIES
-- Run to verify catalog counts, commission compliance, and booking structures
-- ==============================================================================

-- 1. Verify Category and Service Counts
SELECT 'Categories' AS entity, COUNT(*) AS count FROM service_categories
UNION ALL
SELECT 'Services' AS entity, COUNT(*) FROM services
UNION ALL
SELECT 'Platform Settings' AS entity, COUNT(*) FROM platform_settings
UNION ALL
SELECT 'Tax Configurations' AS entity, COUNT(*) FROM tax_configurations
UNION ALL
SELECT 'Bookings Placed' AS entity, COUNT(*) FROM bookings
UNION ALL
SELECT 'Invoices Created' AS entity, COUNT(*) FROM invoices;

-- 2. Audit Pricing Formula: customer_price = ROUND(base_hourly_rate * 1.20, 2)
SELECT 
    s.name AS service_name,
    c.name AS category,
    s.base_hourly_rate,
    s.customer_price,
    s.agent_payout,
    s.doorbly_commission,
    ROUND(s.base_hourly_rate * 1.20, 2) AS expected_customer_price,
    ROUND(s.customer_price - ROUND(s.base_hourly_rate * 1.20, 2), 2) AS discrepancy
FROM services s
JOIN service_categories c ON s.category_id = c.id
WHERE ABS(COALESCE(s.customer_price, 0) - ROUND(COALESCE(s.base_hourly_rate, 0) * 1.20, 2)) > 1.00;

-- 3. Review Latest Customer Bookings with Invoices
SELECT 
    b.booking_reference,
    b.customer_name,
    b.customer_phone,
    b.scheduled_date,
    b.scheduled_start_time,
    b.customer_total,
    b.tax_amount,
    b.booking_status,
    i.invoice_number,
    i.payment_status
FROM bookings b
LEFT JOIN invoices i ON b.id = i.booking_id
ORDER BY b.created_at DESC
LIMIT 10;
`;
  }, []);

  // 4. Realtime & RLS Setup SQL
  const realtimeSql = useMemo(() => {
    return `-- ==============================================================================
-- REALTIME REPLICATION & SECURITY POLICIES
-- ==============================================================================

-- Enable Realtime for Bookings
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;

-- Verify RLS Status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
`;
  }, []);

  const currentSqlText = useMemo(() => {
    switch (activeSqlTab) {
      case 'master-catalog':
        return masterCatalogSql;
      case 'schema':
        return fullSchemaSql;
      case 'seed':
        return catalogSeedSql;
      case 'audit':
        return auditSql;
      case 'realtime':
        return realtimeSql;
      default:
        return masterCatalogSql;
    }
  }, [activeSqlTab, masterCatalogSql, fullSchemaSql, catalogSeedSql, auditSql, realtimeSql]);

  const filteredSqlText = useMemo(() => {
    if (!searchQuery.trim()) return currentSqlText;
    const lines = currentSqlText.split('\n');
    const query = searchQuery.toLowerCase();
    return lines.filter(l => l.toLowerCase().includes(query)).join('\n');
  }, [currentSqlText, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Production • 50 Categories & 978 Services</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Master Catalog Migration & Database Sync</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Add the complete 50-category, 978-service Master Earning Opportunity Catalog with final hourly pricing formula (<code className="text-amber-300">customer_price = base_hourly_rate × 1.20</code>) into your Supabase database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleSyncMasterCatalog}
              disabled={isSyncingMaster}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSyncingMaster ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
              <span>{isSyncingMaster ? 'Syncing Catalog...' : 'Sync 978 Services to Supabase'}</span>
            </button>

            <a
              href={supabaseSqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sync Status / Progress */}
        {isSyncingMaster && masterSyncProgress && (
          <div className="mt-4 p-3.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
            <span className="font-mono">{masterSyncProgress}</span>
          </div>
        )}

        {masterSyncResult && (
          <div className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-3 ${
            masterSyncResult.success 
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
          }`}>
            {masterSyncResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{masterSyncResult.message}</span>
          </div>
        )}

        {seedResult && (
          <div className="mt-4 p-3 bg-indigo-950/80 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{seedResult}</span>
          </div>
        )}
      </div>

      {/* SQL Category Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => { setActiveSqlTab('master-catalog'); setSearchQuery(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSqlTab === 'master-catalog'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>★ Master Catalog Migration (50 Cats & 978 Services)</span>
          </button>

          <button
            onClick={() => { setActiveSqlTab('schema'); setSearchQuery(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSqlTab === 'schema'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Production DDL Schema</span>
          </button>

          <button
            onClick={() => { setActiveSqlTab('seed'); setSearchQuery(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSqlTab === 'seed'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Legacy 32-Category Seed</span>
          </button>

          <button
            onClick={() => { setActiveSqlTab('audit'); setSearchQuery(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSqlTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit & Verification Queries</span>
          </button>

          <button
            onClick={() => { setActiveSqlTab('realtime'); setSearchQuery(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSqlTab === 'realtime'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Realtime & RLS</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SQL code..."
            className="w-full sm:w-48 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SQL Script Viewer Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Code Box Toolbar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-200">
              {activeSqlTab === 'master-catalog' && 'doorbly_master_catalog_50_categories_migration.sql (50 Categories & 978 Services)'}
              {activeSqlTab === 'schema' && 'supabase_schema.sql (Complete DDL + RLS + Functions + Views)'}
              {activeSqlTab === 'seed' && 'catalog_seed.sql (32 Categories & 379 Services)'}
              {activeSqlTab === 'audit' && 'verification_query.sql (Catalog Pricing & Discrepancy Audit)'}
              {activeSqlTab === 'realtime' && 'realtime_publication.sql (Realtime Bookings Channel)'}
            </span>
            <span className="text-slate-600">•</span>
            <span>{currentSqlText.split('\n').length} lines</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const filename = activeSqlTab === 'master-catalog' 
                  ? 'doorbly_master_catalog_50_categories_migration.sql'
                  : `${activeSqlTab}_script.sql`;
                handleDownloadSql(currentSqlText, filename);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Download SQL file"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download .sql</span>
            </button>

            <button
              onClick={() => copyToClipboard(currentSqlText, activeSqlTab)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {copiedType === activeSqlTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Output */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[560px] overflow-y-auto leading-relaxed select-all">
          <pre>{filteredSqlText}</pre>
        </div>
      </div>
    </div>
  );
};
