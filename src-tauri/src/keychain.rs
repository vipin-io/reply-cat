use keyring::Entry;

const SERVICE: &str = "com.replycat.desktop";

pub fn set_token(account_id: &str, token_json: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE, account_id).map_err(|e| e.to_string())?;
    entry.set_password(token_json).map_err(|e| e.to_string())
}

pub fn get_token(account_id: &str) -> Result<String, String> {
    let entry = Entry::new(SERVICE, account_id).map_err(|e| e.to_string())?;
    entry.get_password().map_err(|e| e.to_string())
}

pub fn clear_token(account_id: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE, account_id).map_err(|e| e.to_string())?;
    entry.delete_password().map_err(|e| e.to_string())
} 