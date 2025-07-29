use reqwest::blocking::Client;
use serde_json::json;
use serde::{Deserialize, Serialize};
use crate::oauth;

const GMAIL_API: &str = "https://gmail.googleapis.com/gmail/v1/users/me";

#[derive(Serialize, Deserialize, Debug)]
pub struct GmailThread {
    pub id: String,
    pub snippet: String,
    pub history_id: Option<String>,
}

#[tauri::command]
pub fn gmail_list_threads(limit: usize) -> Result<serde_json::Value, String> {
    oauth::refresh_token_if_needed()?;
    let token = oauth::get_access_token()?;
    let client = Client::new();
    let url = format!("{}/threads?maxResults={}", GMAIL_API, limit);
    let resp = client.get(&url)
        .bearer_auth(token)
        .send().map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("Gmail list threads failed: {}", resp.status()));
    }
    let v: serde_json::Value = resp.json().map_err(|e| e.to_string())?;
    Ok(v)
}

#[tauri::command]
pub fn gmail_get_thread(thread_id: String) -> Result<serde_json::Value, String> {
    oauth::refresh_token_if_needed()?;
    let token = oauth::get_access_token()?;
    let client = Client::new();
    let url = format!("{}/threads/{}?format=full", GMAIL_API, thread_id);
    let resp = client.get(&url)
        .bearer_auth(token)
        .send().map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("Gmail get thread failed: {}", resp.status()));
    }
    let v: serde_json::Value = resp.json().map_err(|e| e.to_string())?;
    Ok(v)
}

#[tauri::command]
pub fn gmail_insert_draft(
    thread_id: String,
    subject: String,
    body_html: String,
    body_text: String,
    to: Vec<String>,
    cc: Vec<String>,
    in_reply_to: String,
    references: String,
) -> Result<(), String> {
    oauth::refresh_token_if_needed()?;
    let token = oauth::get_access_token()?;
    let client = Client::new();
    // Build RFC822 message
    let mut headers = vec![
        format!("Subject: {}", subject),
        format!("To: {}", to.join(", ")),
    ];
    if !cc.is_empty() {
        headers.push(format!("Cc: {}", cc.join(", ")));
    }
    headers.push(format!("In-Reply-To: {}", in_reply_to));
    headers.push(format!("References: {}", references));
    headers.push("Content-Type: multipart/alternative; boundary=boundary42".to_string());
    let quoted = format!(
        "--boundary42\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n{}\r\n--boundary42\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n{}\r\n--boundary42--",
        body_text, body_html
    );
    let raw = base64::encode_config(
        format!("{}\r\n\r\n{}", headers.join("\r\n"), quoted),
        base64::URL_SAFE_NO_PAD,
    );
    let msg = json!({
        "message": {
            "raw": raw,
            "threadId": thread_id
        }
    });
    let url = format!("{}/drafts", GMAIL_API);
    let resp = client.post(&url)
        .bearer_auth(token)
        .json(&msg)
        .send().map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("Gmail insert draft failed: {}", resp.status()));
    }
    Ok(())
} 