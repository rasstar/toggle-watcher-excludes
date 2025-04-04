const vscode = require("vscode");

const EXCLUDES = [
  "**/node_modules/**",
  "**/.venv/**",
  "**/env/**",
  "**/__pycache__/**",
  "**/.mypy_cache/**",
  "**/.pytest_cache/**",
  "**/.git/**",
  "**/dist/**"
];

function toggleWatcherExclude(context) {
  const configTarget = vscode.workspace.workspaceFolders
    ? vscode.ConfigurationTarget.Workspace
    : vscode.ConfigurationTarget.Global;

  const config = vscode.workspace.getConfiguration();
  const current = config.get("files.watcherExclude") || {};
  const updated = { ...current };

  let changesMade = false;

  EXCLUDES.forEach((pattern) => {
    if (updated[pattern]) {
      delete updated[pattern];
      vscode.window.showInformationMessage(`❌ Removed: ${pattern}`);
      changesMade = true;
    } else {
      updated[pattern] = true;
      vscode.window.showInformationMessage(`✅ Added: ${pattern}`);
      changesMade = true;
    }
  });

  if (changesMade) {
    config
      .update("files.watcherExclude", updated, configTarget)
      .then(() => {
        vscode.window.showInformationMessage(
          `🔄 Watcher exclusions updated in ${configTarget === vscode.ConfigurationTarget.Global ? "Global" : "Workspace"} settings.`
        );
      });
  }
}

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.toggleWatcherExclude",
    () => toggleWatcherExclude(context)
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
