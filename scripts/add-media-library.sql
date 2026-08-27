-- Media Library metadata table                                                                    
-- Actual files are stored in Supabase Storage bucket: site-media                                  
                                                                                                   
CREATE OR REPLACE FUNCTION update_updated_at_column()                                              
RETURNS TRIGGER AS $$                                                                              
BEGIN                                                                                              
  NEW.updated_at = now();                                                                          
  RETURN NEW;                                                                                      
END;                                                                                               
$$ LANGUAGE plpgsql;                                                                               
                                                                                                   
CREATE TABLE IF NOT EXISTS media_assets (                                                          
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),                                                   
                                                                                                   
  original_name text NOT NULL,                                                                     
                                                                                                   
  storage_path text NOT NULL UNIQUE,                                                               
                                                                                                   
  public_url text NOT NULL,                                                                        
                                                                                                   
  mime_type text NOT NULL,                                                                         
                                                                                                   
  file_size bigint NOT NULL CHECK (file_size > 0),                                                 
                                                                                                   
  status text NOT NULL DEFAULT 'active'                                                            
    CHECK (status IN ('active', 'archived', 'deleted')),                                           
                                                                                                   
  uploaded_by text                                                                                 
    REFERENCES users(id)                                                                           
    ON DELETE SET NULL,                                                                            
                                                                                                   
  created_at timestamptz NOT NULL DEFAULT now(),                                                   
                                                                                                   
  updated_at timestamptz NOT NULL DEFAULT now()                                                    
);                                                                                                 
                                                                                                   
CREATE INDEX IF NOT EXISTS media_assets_created_at_idx                                             
  ON media_assets (created_at DESC);                                                               
                                                                                                   
CREATE INDEX IF NOT EXISTS media_assets_status_idx                                                 
  ON media_assets (status);                                                                        
                                                                                                   
CREATE INDEX IF NOT EXISTS media_assets_mime_type_idx                                              
  ON media_assets (mime_type);                                                                     
                                                                                                   
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;                                                
                                                                                                   
DROP TRIGGER IF EXISTS media_assets_updated_at ON media_assets;                                    
                                                                                                   
CREATE TRIGGER media_assets_updated_at                                                             
  BEFORE UPDATE ON media_assets                                                                    
  FOR EACH ROW                                                                                     
  EXECUTE FUNCTION update_updated_at_column();  