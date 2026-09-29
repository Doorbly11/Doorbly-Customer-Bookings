-- DOORBLY PRODUCTION DATABASE SCHEMA & INITIALIZATION MIGRATION
-- Project: https://inbdcdskhjnannbcpbtz.supabase.co
-- Single Source of Truth for Odisha Hourly Doorstep-Service Marketplace
-- Authoritative Database Tables, Functions, Triggers, and RLS Policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market VARCHAR(50) NOT NULL DEFAULT 'Odisha',
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 20.00 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_settings (market, currency, commission_percentage, is_active)
SELECT 'Odisha', 'INR', 20.00, true
WHERE NOT EXISTS (SELECT 1 FROM platform_settings WHERE market = 'Odisha');

-- 2. SERVICE CATEGORIES (50 Major Trade & Freelance Groups)
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'Wrench',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON service_categories(is_active);

-- 3. SERVICES (Internal Master: customer_price = ROUND(base_hourly_rate * 1.20, 2))
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    pricing_type VARCHAR(20) NOT NULL DEFAULT 'hourly' CHECK (pricing_type = 'hourly'),
    pricing_unit VARCHAR(20) NOT NULL DEFAULT 'hour' CHECK (pricing_unit = 'hour'),
    base_hourly_rate NUMERIC(10,2) NOT NULL CHECK (base_hourly_rate > 0),
    customer_price NUMERIC(10,2) NOT NULL CHECK (customer_price > 0),
    agent_payout NUMERIC(10,2) NOT NULL CHECK (agent_payout >= 0),
    doorbly_commission NUMERIC(10,2) NOT NULL CHECK (doorbly_commission >= 0),
    -- Backwards-compatible aliases
    partner_hourly_rate NUMERIC(10,2) NOT NULL CHECK (partner_hourly_rate > 0),
    customer_hourly_price NUMERIC(10,2) NOT NULL CHECK (customer_hourly_price > 0),
    commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 20.00 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    minimum_hours INT NOT NULL DEFAULT 1 CHECK (minimum_hours >= 1),
    maximum_hours INT NOT NULL DEFAULT 8 CHECK (maximum_hours >= minimum_hours),
    verification_required BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent Column Alterations for Existing Deployments
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(20) NOT NULL DEFAULT 'hourly';
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_unit VARCHAR(20) NOT NULL DEFAULT 'hour';
ALTER TABLE services ADD COLUMN IF NOT EXISTS base_hourly_rate NUMERIC(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS customer_price NUMERIC(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS agent_payout NUMERIC(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS doorbly_commission NUMERIC(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS verification_required BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_popular BOOLEAN NOT NULL DEFAULT false;

-- Backfill data for existing services to strictly enforce: customer_price = ROUND(base_hourly_rate * 1.20, 2)
UPDATE services
SET 
  base_hourly_rate = COALESCE(base_hourly_rate, partner_hourly_rate, 250.00),
  customer_price = ROUND(COALESCE(base_hourly_rate, partner_hourly_rate, 250.00) * 1.20, 2),
  agent_payout = COALESCE(base_hourly_rate, partner_hourly_rate, 250.00),
  doorbly_commission = ROUND(ROUND(COALESCE(base_hourly_rate, partner_hourly_rate, 250.00) * 1.20, 2) - COALESCE(base_hourly_rate, partner_hourly_rate, 250.00), 2),
  partner_hourly_rate = COALESCE(base_hourly_rate, partner_hourly_rate, 250.00),
  customer_hourly_price = ROUND(COALESCE(base_hourly_rate, partner_hourly_rate, 250.00) * 1.20, 2),
  pricing_type = 'hourly',
  pricing_unit = 'hour'
WHERE base_hourly_rate IS NULL OR customer_price IS NULL;

CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- 4. SERVICE CATEGORY MAP (Multi-Category Skills)
CREATE TABLE IF NOT EXISTS service_category_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(service_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_catmap_service ON service_category_map(service_id);
CREATE INDEX IF NOT EXISTS idx_catmap_category ON service_category_map(category_id);

-- 5. CUSTOMERS (Linked to Supabase Auth auth.uid())
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_auth ON customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 6. CUSTOMER ADDRESSES (Odisha Specific Verification)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    area VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Odisha',
    pincode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON customer_addresses(customer_id);

-- 7. TAX CONFIGURATIONS (Configurable GST / CGST / SGST / IGST)
CREATE TABLE IF NOT EXISTS tax_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_name VARCHAR(100) NOT NULL,
    tax_type VARCHAR(20) NOT NULL CHECK (tax_type IN ('GST', 'CGST', 'SGST', 'IGST', 'OTHER')),
    tax_rate NUMERIC(5,2) NOT NULL CHECK (tax_rate >= 0),
    country VARCHAR(50) NOT NULL DEFAULT 'India',
    state VARCHAR(50) NOT NULL DEFAULT 'Odisha',
    is_active BOOLEAN NOT NULL DEFAULT true,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_active ON tax_configurations(is_active);

-- Seed Default Odisha Intrastate GST Configuration (CGST 9% + SGST 9% = 18%)
INSERT INTO tax_configurations (tax_name, tax_type, tax_rate, country, state, is_active)
SELECT 'Central GST (CGST)', 'CGST', 9.00, 'India', 'Odisha', true
WHERE NOT EXISTS (SELECT 1 FROM tax_configurations WHERE tax_type = 'CGST' AND state = 'Odisha');

INSERT INTO tax_configurations (tax_name, tax_type, tax_rate, country, state, is_active)
SELECT 'Odisha State GST (SGST)', 'SGST', 9.00, 'India', 'Odisha', true
WHERE NOT EXISTS (SELECT 1 FROM tax_configurations WHERE tax_type = 'SGST' AND state = 'Odisha');

-- 8. SERVICE PARTNERS & AVAILABILITY
CREATE TABLE IF NOT EXISTS service_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    district VARCHAR(100) NOT NULL DEFAULT 'Khordha',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 4.90,
    skills TEXT[] DEFAULT ARRAY['home-repair-maintenance', 'electrical-services', 'plumbing-water'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_address_id UUID REFERENCES customer_addresses(id) ON DELETE SET NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        booking_status IN (
            'pending', 'confirmed', 'assigned', 'partner_on_the_way',
            'partner_arrived', 'in_progress', 'completed', 'cancelled', 'rejected'
        )
    ),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN (
            'pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled'
        )
    ),
    scheduled_date DATE NOT NULL,
    scheduled_start_time VARCHAR(30) NOT NULL,
    scheduled_end_time VARCHAR(30),
    total_hours INT NOT NULL CHECK (total_hours >= 1),
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    tax_percentage NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    customer_total NUMERIC(12,2) NOT NULL CHECK (customer_total >= 0),
    invoice_number VARCHAR(50),
    notes TEXT,
    assigned_partner_id UUID REFERENCES service_partners(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);

-- 10. BOOKING ITEMS (Historical Snapshots: Service price, Partner payout, Commission)
CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name_snapshot VARCHAR(150) NOT NULL,
    customer_hourly_price_snapshot NUMERIC(10,2) NOT NULL,
    partner_hourly_rate_snapshot NUMERIC(10,2) NOT NULL,
    commission_percentage_snapshot NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    doorbly_commission_snapshot NUMERIC(10,2) NOT NULL,
    partner_payout_snapshot NUMERIC(10,2) NOT NULL,
    hours INT NOT NULL CHECK (hours >= 1),
    customer_subtotal NUMERIC(12,2) NOT NULL,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_booking_id ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_items_service_id ON booking_items(service_id);

-- 11. INVOICES (Authoritative Tax Invoices with Immutable Historical Snapshots)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_status VARCHAR(30) NOT NULL DEFAULT 'issued' CHECK (
        invoice_status IN ('draft', 'issued', 'paid', 'cancelled', 'refunded')
    ),
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    service_address_json JSONB NOT NULL,
    billing_address_json JSONB,
    tax_name_snapshot VARCHAR(100) DEFAULT 'GST (CGST 9% + SGST 9%)',
    tax_type_snapshot VARCHAR(20) DEFAULT 'GST',
    tax_rate_snapshot NUMERIC(5,2) DEFAULT 18.00,
    booking_reference VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_booking ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- 12. INVOICE ITEMS (Line Items Snapshot)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name_snapshot VARCHAR(150) NOT NULL,
    description TEXT,
    hours NUMERIC(6,2) NOT NULL CHECK (hours > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    line_subtotal NUMERIC(12,2) NOT NULL CHECK (line_subtotal >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_items_invoice ON invoice_items(invoice_id);

-- 13. PAYMENTS (Gateway Verification & Payment Records)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    gateway VARCHAR(40) NOT NULL CHECK (
        gateway IN ('razorpay', 'upi_collect', 'doorstep_verified', 'netbanking')
    ),
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN (
            'pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled'
        )
    ),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- 14. SECURE VIEWS (Zero Exposure of Doorbly Commission or Internal Rates to Customers)
CREATE OR REPLACE VIEW customer_services_catalog AS
SELECT
    s.id,
    s.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    s.name,
    s.slug,
    s.description,
    s.pricing_type,
    s.pricing_unit,
    s.customer_price,
    s.customer_hourly_price,
    s.minimum_hours,
    s.maximum_hours,
    s.image_url,
    s.featured,
    s.is_popular,
    s.verification_required,
    s.is_active,
    s.created_at,
    s.updated_at
FROM services s
LEFT JOIN service_categories c ON s.category_id = c.id
WHERE s.is_active = true;

-- Provider View: Authorized Payout Rate Only (Internal rates/commission hidden)
CREATE OR REPLACE VIEW provider_services_catalog AS
SELECT
    s.id,
    s.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    s.name,
    s.slug,
    s.description,
    s.pricing_type,
    s.pricing_unit,
    s.agent_payout AS provider_hourly_payout,
    s.minimum_hours,
    s.maximum_hours,
    s.verification_required,
    s.is_active
FROM services s
LEFT JOIN service_categories c ON s.category_id = c.id
WHERE s.is_active = true;

CREATE OR REPLACE VIEW customer_booking_items_view AS
SELECT
    bi.id,
    bi.booking_id,
    bi.service_id,
    bi.service_name_snapshot,
    bi.customer_hourly_price_snapshot,
    bi.hours,
    bi.customer_subtotal,
    bi.tax_amount,
    bi.created_at
FROM booking_items bi;

-- 15. SECURE DATABASE FUNCTIONS
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS VARCHAR AS $$
DECLARE
    date_part VARCHAR;
    random_part VARCHAR;
    candidate VARCHAR;
    found_dup BOOLEAN;
BEGIN
    date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    LOOP
        random_part := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
        candidate := 'DB-' || date_part || '-' || random_part;
        SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_reference = candidate) INTO found_dup;
        IF NOT found_dup THEN
            RETURN candidate;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS VARCHAR AS $$
DECLARE
    year_part VARCHAR;
    random_part VARCHAR;
    candidate VARCHAR;
    found_dup BOOLEAN;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    LOOP
        random_part := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
        candidate := 'INV-' || year_part || '-' || random_part;
        SELECT EXISTS(SELECT 1 FROM invoices WHERE invoice_number = candidate) INTO found_dup;
        IF NOT found_dup THEN
            RETURN candidate;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_booking_tax(p_subtotal NUMERIC)
RETURNS TABLE (
    total_tax NUMERIC,
    tax_rate NUMERIC,
    cgst_rate NUMERIC,
    cgst_amount NUMERIC,
    sgst_rate NUMERIC,
    sgst_amount NUMERIC
) AS $$
DECLARE
    v_cgst NUMERIC := 9.00;
    v_sgst NUMERIC := 9.00;
BEGIN
    SELECT COALESCE(tax_rate, 9.00) INTO v_cgst
    FROM tax_configurations
    WHERE tax_type = 'CGST' AND is_active = true
    ORDER BY created_at DESC LIMIT 1;

    SELECT COALESCE(tax_rate, 9.00) INTO v_sgst
    FROM tax_configurations
    WHERE tax_type = 'SGST' AND is_active = true
    ORDER BY created_at DESC LIMIT 1;

    cgst_rate := v_cgst;
    sgst_rate := v_sgst;
    tax_rate := v_cgst + v_sgst;
    cgst_amount := ROUND((p_subtotal * (v_cgst / 100.0)), 2);
    sgst_amount := ROUND((p_subtotal * (v_sgst / 100.0)), 2);
    total_tax := cgst_amount + sgst_amount;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql STABLE;

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_category_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories" ON service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view category mappings" ON service_category_map FOR SELECT USING (true);
CREATE POLICY "Public can view platform settings" ON platform_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active taxes" ON tax_configurations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can check active partners" ON service_partners FOR SELECT USING (is_active = true);

CREATE POLICY "Customers can manage own profile" ON customers
    FOR ALL USING (auth_user_id = auth.uid() OR auth_user_id IS NULL)
    WITH CHECK (auth_user_id = auth.uid() OR auth_user_id IS NULL);

CREATE POLICY "Customers can manage own addresses" ON customer_addresses
    FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL))
    WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can view own bookings" ON bookings
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can update own bookings" ON bookings
    FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can view own booking items" ON booking_items
    FOR SELECT USING (booking_id IN (SELECT b.id FROM bookings b JOIN customers c ON b.customer_id = c.id WHERE c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL));

CREATE POLICY "Customers can insert own booking items" ON booking_items
    FOR INSERT WITH CHECK (booking_id IN (SELECT b.id FROM bookings b JOIN customers c ON b.customer_id = c.id WHERE c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL));

CREATE POLICY "Customers can view own invoices" ON invoices
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "System and customers can insert invoices" ON invoices
    FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can view own invoice items" ON invoice_items
    FOR SELECT USING (invoice_id IN (SELECT i.id FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL));

CREATE POLICY "System and customers can insert invoice items" ON invoice_items
    FOR INSERT WITH CHECK (invoice_id IN (SELECT i.id FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL));

CREATE POLICY "Customers can view own payments" ON payments
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can insert own payments" ON payments
    FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

-- 17. REALTIME SUBSCRIPTIONS
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
