mod commands;

/// Bootstraps and runs the Tauri application.
///
/// # Panics
/// Panics if the Tauri runtime fails to initialize.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::get_app_version,
            commands::get_device_info,
            commands::ping,
        ])
        .run(tauri::generate_context!())
        .expect("error while running ISM POS");
}