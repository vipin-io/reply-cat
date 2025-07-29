use std::net::TcpListener;
use std::io::Read;
use std::time::{SystemTime, UNIX_EPOCH};
use urlencoding::encode;
use rand::{distributions::Alphanumeric, Rng};
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use base64::{Engine, engine::general_purpose};
use crate::keychain;

const CLIENT_ID: &str = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const REDIRECT_URI: &str = "http://127.0.0.1"; // Port will be appended
const SCOPES: &str = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify";
const TOKEN_URL: &str = "https://oauth2.googleapis.com/token";
const AUTH_URL: &str = "https://accounts.google.com/o/oauth2/v2/auth";
const ACCOUNT_ID: &str = "gmail";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Token {
    pub access_token: String,
    pub refresh_token: String,
    pub expiry: u64,
}

fn gen_code_verifier() -> String {
    rand::thread_rng().sample_iter(&Alphanumeric).take(64).map(char::from).collect()
}

fn code_challenge(verifier: &str) -> String {
    use sha2::{Digest, Sha256};
    let hash = Sha256::digest(verifier.as_bytes());
    general_purpose::URL_SAFE_NO_PAD.encode(hash)
}

pub fn start_oauth_flow() -> Result<(), String> {
    let port = 8000 + rand::thread_rng().gen_range(0..1000);
    let redirect_uri = format!("{}:{}", REDIRECT_URI, port);
    let verifier = gen_code_verifier();
    let challenge = code_challenge(&verifier);
    let url = format!(
        "{}?client_id={}&redirect_uri={}&response_type=code&scope={}&code_challenge={}&code_challenge_method=S256&access_type=offline&prompt=consent",
        AUTH_URL,
        CLIENT_ID,
        encode(&redirect_uri),
        encode(SCOPES),
        challenge
    );
    // Open browser
    if open::that(&url).is_err() {
        return Err("Failed to open browser".into());
    }
    // Listen for redirect
    let listener = TcpListener::bind(("127.0.0.1", port)).map_err(|e| e.to_string())?;
    let (mut stream, _) = listener.accept().map_err(|e| e.to_string())?;
    let mut buf = [0; 4096];
    let n = stream.read(&mut buf).map_err(|e| e.to_string())?;
    let req = String::from_utf8_lossy(&buf[..n]);
    let code = req.split("code=").nth(1).and_then(|s| s.split_whitespace().next()).and_then(|s| s.split('&').next()).ok_or("No code in redirect")?;
    // Exchange code for token
    let token = exchange_code_for_token(code, &verifier, &redirect_uri)?;
    // Save to keychain
    let json = serde_json::to_string(&token).map_err(|e| e.to_string())?;
    keychain::set_token(ACCOUNT_ID, &json)?;
    Ok(())
}

fn exchange_code_for_token(code: &str, verifier: &str, redirect_uri: &str) -> Result<Token, String> {
    let client = Client::new();
    let params = [
        ("client_id", CLIENT_ID),
        ("code", code),
        ("code_verifier", verifier),
        ("redirect_uri", redirect_uri),
        ("grant_type", "authorization_code"),
    ];
    let resp = client.post(TOKEN_URL)
        .form(&params)
        .send().map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("Token exchange failed: {}", resp.status()));
    }
    let v: serde_json::Value = resp.json().map_err(|e| e.to_string())?;
    let access_token = v["access_token"].as_str().ok_or("No access_token")?.to_string();
    let refresh_token = v["refresh_token"].as_str().ok_or("No refresh_token")?.to_string();
    let expires_in = v["expires_in"].as_u64().unwrap_or(3600);
    let expiry = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() + expires_in;
    Ok(Token { access_token, refresh_token, expiry })
}

pub fn refresh_token_if_needed() -> Result<(), String> {
    let json = keychain::get_token(ACCOUNT_ID)?;
    let mut token: Token = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    if token.expiry > now + 60 {
        return Ok(()); // Still valid
    }
    // Refresh
    let client = Client::new();
    let params = [
        ("client_id", CLIENT_ID),
        ("grant_type", "refresh_token"),
        ("refresh_token", &token.refresh_token),
    ];
    let resp = client.post(TOKEN_URL)
        .form(&params)
        .send().map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("Token refresh failed: {}", resp.status()));
    }
    let v: serde_json::Value = resp.json().map_err(|e| e.to_string())?;
    token.access_token = v["access_token"].as_str().ok_or("No access_token")?.to_string();
    let expires_in = v["expires_in"].as_u64().unwrap_or(3600);
    token.expiry = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() + expires_in;
    // Save updated token
    let json = serde_json::to_string(&token).map_err(|e| e.to_string())?;
    keychain::set_token(ACCOUNT_ID, &json)?;
    Ok(())
}

pub fn get_access_token() -> Result<String, String> {
    let json = keychain::get_token(ACCOUNT_ID)?;
    let token: Token = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    Ok(token.access_token)
} 