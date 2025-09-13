-- Create claims table
CREATE TABLE claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  description TEXT NOT NULL,
  file_hashes TEXT[] NOT NULL,
  metadata JSONB,
  status TEXT CHECK (status IN ('pending', 'processing', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create proofs table
CREATE TABLE proofs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  anchor_id TEXT UNIQUE NOT NULL,
  commitment_hash TEXT NOT NULL,
  block_height BIGINT,
  transaction_hash TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created_at ON claims(created_at);
CREATE INDEX idx_proofs_anchor_id ON proofs(anchor_id);
CREATE INDEX idx_proofs_commitment_hash ON proofs(commitment_hash);
CREATE INDEX idx_proofs_verified ON proofs(verified);

-- Create updated_at trigger for claims
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_claims_updated_at 
    BEFORE UPDATE ON claims 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();