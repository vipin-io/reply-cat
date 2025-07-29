#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;
use sysinfo::{System, SystemExt};

mod gmail;
mod oauth;
mod keychain;

#[tauri::command]
fn get_total_ram_gb() -> u64 {
    let mut sys = System::new();
    sys.refresh_memory();
    sys.total_memory() / 1024 / 1024 // MB to GB
}

#[tauri::command]
fn get_ollama_version() -> Result<String, String> {
    let output = if cfg!(target_os = "windows") {
        Command::new("ollama.exe").arg("--version").output()
    } else {
        Command::new("ollama").arg("--version").output()
    };
    match output {
        Ok(out) if out.status.success() => {
            let v = String::from_utf8_lossy(&out.stdout).trim().to_string();
            Ok(v)
        }
        _ => Err("Ollama not found".into()),
    }
}

#[tauri::command]
fn gmail_session_present() -> bool {
    // Check keychain for Gmail token
    keychain::get_token("gmail").is_ok()
}

#[tauri::command]
fn gmail_start_oauth() {
    let _ = oauth::start_oauth_flow();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_total_ram_gb,
            get_ollama_version,
            gmail_session_present,
            gmail_start_oauth,
            gmail::gmail_list_threads,
            gmail::gmail_get_thread,
            gmail::gmail_insert_draft
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
} 