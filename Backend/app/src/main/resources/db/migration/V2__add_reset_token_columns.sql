ALTER TABLE users
ADD reset_token VARCHAR(255) NULL,
    reset_token_expiry DATETIME NULL;