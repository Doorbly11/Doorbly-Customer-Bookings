-- ==============================================================================
-- DOORBLY CATALOG MIGRATION VERIFICATION QUERY
-- Run this query in Supabase SQL Editor to audit catalog completeness and pricing
-- ==============================================================================

SELECT 
    COALESCE(c.name, 'Uncategorized') AS category_name,
    s.name AS service_name,
    s.partner_hourly_rate,
    s.customer_hourly_price,
    s.commission_percentage,
    CASE 
        WHEN s.partner_hourly_rate IS NULL OR s.partner_hourly_rate <= 0 
          OR s.customer_hourly_price IS NULL OR s.customer_hourly_price <= 0 THEN true
        ELSE false
    END AS missing_price,
    COUNT(*) OVER (PARTITION BY s.name, c.name) AS duplicate_count
FROM services s
LEFT JOIN service_categories c ON s.category_id = c.id
ORDER BY c.sort_order ASC NULLS LAST, s.name ASC;

-- Summary counts verification
SELECT 
    (SELECT COUNT(*) FROM service_categories WHERE is_active = true) AS total_active_categories,
    (SELECT COUNT(*) FROM services WHERE is_active = true) AS total_active_services,
    (SELECT COUNT(*) FROM services WHERE customer_hourly_price != (partner_hourly_rate / 0.80)) AS pricing_discrepancies,
    (SELECT COUNT(*) FROM services WHERE partner_hourly_rate IS NULL OR partner_hourly_rate <= 0) AS missing_rates_count;
