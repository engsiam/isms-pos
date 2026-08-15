use serde::Serialize;

/// Represents the runtime environment the desktop app boots in.
#[derive(Debug, Serialize)]
pub struct DeviceInfo {
    pub name: String,
    pub platform: String,
    pub version: String,
    pub arch: String,
    pub uptime_seconds: u64,
}

/// A point-of-sale ready ping used to verify the Rust <-> UI bridge.
#[derive(Debug, Serialize)]
pub struct PingResponse {
    pub ok: bool,
    pub message: String,
    pub timestamp: u64,
}

/// Simple greeting command, the classic Tauri smoke test.
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! The desktop shell is alive.", name)
}

/// Returns the packaged app version from Cargo metadata.
#[tauri::command]
pub fn get_app_version() -> String {
    option_env!("CARGO_PKG_VERSION")
        .unwrap_or("unknown")
        .to_string()
}

/// Returns basic host/OS information to render in the UI.
#[tauri::command]
pub fn get_device_info() -> DeviceInfo {
    DeviceInfo {
        name: std::env::var("COMPUTERNAME")
            .or_else(|_| std::env::var("HOSTNAME"))
            .unwrap_or_else(|_| "unknown".into()),
        platform: std::env::consts::OS.to_string(),
        version: std::env::consts::ARCH.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        uptime_seconds: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs(),
    }
}

/// Health check the UI can call to confirm the IPC bridge is connected.
#[tauri::command]
pub fn ping() -> PingResponse {
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    PingResponse {
        ok: true,
        message: "Pong — Rust backend reachable".into(),
        timestamp,
    }
}