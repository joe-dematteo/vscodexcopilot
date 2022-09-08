import * as vscode from 'vscode';

import { getConfig } from './codexUtils/codexSettings';
import { getEditResult } from './codexUtils/createEdit';
import { getCompletionResult } from './codexUtils/createCompletion';


const codexChannel = vscode.window.createOutputChannel("CodexCo");


const registerExtensionCommands = (): vscode.Disposable[] => {
  let disposables: vscode.Disposable[] = [];
  disposables = [
    ...disposables,
    vscode.commands.registerCommand("codexco.codeRefactor", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const doc = editor.document;
      const text = doc.getText(editor.selection);
      const newText = await getEditResult(text);
      editor.edit((editBuilder) => {
        editBuilder.replace(editor.selection, newText);
      });
    }),
  ];
  if (getConfig().completionEngineEnabled) {
    codexChannel.appendLine(`Completion model enabled: ${getConfig().completionsModel}`);
    disposables = [
      ...disposables,
      vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "*" },
        {
          async provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext
          ) {
            // debug logging
            codexChannel.appendLine(
              `provideCompletionItems: ${document.uri.fsPath} ${position.line} ${position.character}`
            );
            codexChannel.appendLine(`provideCompletionItemsContext: ${JSON.stringify(context)}`);
            token.onCancellationRequested(() => {
              codexChannel.appendLine(`provideCompletionItems: Cancelled`);
            });
            const text = document.getText(new vscode.Range(new vscode.Position(position.line-3, 0), position));

            const completionsResponse = await getCompletionResult(text);
            codexChannel.appendLine(
              `provideCompletionItems: ${JSON.stringify(completionsResponse)}`
            );
            return completionsResponse;
          },
        },
        ".",
        "\n",
        ":",
        "\t",
        ","
      ),
    ];
  }
  return disposables;
};
export function activate(context: vscode.ExtensionContext) {
  let config = vscode.workspace.getConfiguration("codexco");
  // Add configuration
  let disposables: vscode.Disposable[] = [];
  disposables = registerExtensionCommands();
  context.subscriptions.push(...disposables);
  // Listen for configuration changes and reload extension commands
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("codexco")) {
      config = vscode.workspace.getConfiguration("codexco");
      disposables.forEach((disposable) => disposable.dispose());
      disposables = registerExtensionCommands();
      context.subscriptions.push(...disposables);
    }
  });
  context.subscriptions.push(configWatcher);
}
