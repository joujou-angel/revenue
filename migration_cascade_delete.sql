-- Migration: Add ON DELETE CASCADE to agent_rewards and Support Termination

-- 1. Drop existing constraint (assuming default name or finding it dynamically)
-- Since we can't easily know the name, we'll try the standard naming convention first.
-- Usually: agent_rewards_contract_id_fkey
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'agent_rewards_contract_id_fkey') THEN
        ALTER TABLE public.agent_rewards DROP CONSTRAINT agent_rewards_contract_id_fkey;
    END IF;
END $$;

-- 2. Re-add constraint with ON DELETE CASCADE
ALTER TABLE public.agent_rewards
    ADD CONSTRAINT agent_rewards_contract_id_fkey
    FOREIGN KEY (contract_id)
    REFERENCES public.contracts(id)
    ON DELETE CASCADE;

-- 3. Ensure contracts status column can handle 'terminated' 
-- (It's likely just text, but good to note. No schema change needed if it's text.)
