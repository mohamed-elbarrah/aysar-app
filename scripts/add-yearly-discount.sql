ALTER TABLE plans_page ADD COLUMN IF NOT EXISTS yearly_discount_percent INTEGER DEFAULT 15;
UPDATE plans_page SET yearly_discount_percent = 15 WHERE yearly_discount_percent IS NULL;
