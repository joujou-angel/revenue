-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE contract_status AS ENUM ('active', 'terminated', 'completed');
CREATE TYPE installment_status AS ENUM ('pending', 'paid', 'cancelled');

-- 1. Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    name TEXT NOT NULL,
    phone TEXT,
    id_number TEXT, -- Consider encryption in application layer if strictly needed, or use pgcrypto
    bank_details TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contracts Table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    policy_no TEXT,
    sign_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    commission_rate NUMERIC(5, 4) NOT NULL, -- e.g. 0.2400 for 24%
    duration_months INT NOT NULL CHECK (duration_months IN (6, 12)),
    termination_penalty NUMERIC(12, 2) DEFAULT 0,
    status contract_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Installments Table
CREATE TABLE installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    period_number INT NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status installment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Clients
CREATE POLICY "Users can view their own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Contracts
CREATE POLICY "Users can view their own contracts" ON contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contracts" ON contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contracts" ON contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contracts" ON contracts FOR DELETE USING (auth.uid() = user_id);

-- Installments
CREATE POLICY "Users can view their own installments" ON installments FOR SELECT USING (auth.uid() = user_id);
-- Note: Installments are mostly managed by triggers, but if manual adjustment is needed, ensure policy exists.
CREATE POLICY "Users can update their own installments" ON installments FOR UPDATE USING (auth.uid() = user_id);
-- Insert/Delete usually restricted or handled by system/triggers, but for simplicity allowing owner access if needed.
CREATE POLICY "Users can delete their own installments" ON installments FOR DELETE USING (auth.uid() = user_id);


-- Automation Logic: Function to Generate Installments
CREATE OR REPLACE FUNCTION generate_installments()
RETURNS TRIGGER AS $$
DECLARE
    total_commission NUMERIC(12, 2);
    monthly_base NUMERIC(12, 2);
    final_amount NUMERIC(12, 2);
    calc_amount NUMERIC(12, 2);
    i INT;
BEGIN
    -- 1. Calculate Total Commission
    total_commission := NEW.total_amount * NEW.commission_rate;
    
    -- 2. Calculate Base Amount (Round down to 2 decimals)
    -- Using floor to ensure we don't overpay in early months
    monthly_base := floor((total_commission / NEW.duration_months) * 100) / 100;
    
    -- 3. Loop to create installments
    FOR i IN 1..NEW.duration_months LOOP
        -- Date Logic: Sign Date + i months
        
        -- Amount Logic: "Penny Perfect"
        IF i = NEW.duration_months THEN
            -- Last month: takes the remainder
            calc_amount := total_commission - (monthly_base * (NEW.duration_months - 1));
        ELSE
            -- Normal month
            calc_amount := monthly_base;
        END IF;

        INSERT INTO installments (
            user_id,
            contract_id,
            period_number,
            due_date,
            amount,
            status
        ) VALUES (
            NEW.user_id,
            NEW.id,
            i,
            (NEW.sign_date + (i || ' month')::interval)::date,
            calc_amount,
            'pending'
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Insert
CREATE TRIGGER trigger_generate_installments
AFTER INSERT ON contracts
FOR EACH ROW
EXECUTE FUNCTION generate_installments();


-- Logic: Handle Termination
CREATE OR REPLACE FUNCTION handle_contract_termination()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if status changed to 'terminated'
    IF NEW.status = 'terminated' AND OLD.status != 'terminated' THEN
        -- Update all PENDING installments to CANCELLED
        UPDATE installments
        SET status = 'cancelled'
        WHERE contract_id = NEW.id
          AND status = 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Update
CREATE TRIGGER trigger_handle_termination
AFTER UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION handle_contract_termination();

-- View for Dashboard Stats (Simplifies Frontend Queries)
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    user_id,
    -- 1. Month Estimated Income (Pending or Paid this month)
    COALESCE(SUM(CASE 
        WHEN date_trunc('month', due_date) = date_trunc('month', CURRENT_DATE) 
             AND status != 'cancelled' 
        THEN amount ELSE 0 END), 0) as this_month_income,
    
    -- 2. Total Pending (Unpaid)
    COALESCE(SUM(CASE 
        WHEN status = 'pending' 
        THEN amount ELSE 0 END), 0) as total_pending,
        
    -- 3. Active Contracts Count (Needs join, implementing as scalar subquery or separate call usually better, 
    -- but for view we can try approximate or leave for frontend to count contracts table)
    (SELECT COUNT(*) FROM contracts c WHERE c.user_id = auth.uid() AND c.status = 'active') as active_contracts_count
FROM installments
WHERE user_id = auth.uid()
GROUP BY user_id;
