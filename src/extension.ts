import * as vscode from 'vscode';

import { getConfig } from './codexUtils/codexSettings';
import { getEditResult } from './codexUtils/createEdit';
import { getCompletionResult } from './codexUtils/createCompletion';

const codexChannel = vscode.window.createOutputChannel('CodexCo');

const registerExtensionCommands = (): vscode.Disposable[] => {
  let disposables: vscode.Disposable[] = [];
  disposables = [
    ...disposables,
    vscode.commands.registerCommand('codexco.codeRefactor', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const doc = editor.document;
      const text = doc.getText(editor.selection);
      const newText = await getEditResult(text);
      if (text.length === 0) {
        vscode.window.showErrorMessage(
          'You must select code to refactor first! '
        );
      } else {
        editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, newText);
        });
      }
    }),
  ];
  if (getConfig().completionEngineEnabled) {
    codexChannel.appendLine(
      `Completion model enabled: ${getConfig().completionsModel}`
    );
    disposables = [
      ...disposables,
      vscode.commands.registerCommand('codexco.codeCompletion', async () => {
        const provider: vscode.InlineCompletionItemProvider = {
          provideInlineCompletionItems: async (
            document,
            position,
						context,
						token
          ) => {
            const textBeforeCursor = document.getText(
              new vscode.Range(position.with(undefined, 0), position)
            );
            let items: any[] = [];

            if (position.line <= 0) {
              let completionsResponse;
              try {
                completionsResponse = await getCompletionResult(
                  textBeforeCursor
                );
                if (completionsResponse) {
                  items = completionsResponse.results.map((item) => {
                    const output = `\n${completionsResponse} \n${item.code}`;
                    return {
                      text: output,
                      insertText: output,
                      range: new vscode.Range(
                        position.translate(0, output.length),
                        position
                      ),
                    };
                  });
                }
              } catch (err: any) {
                vscode.window.showErrorMessage(err.toString());
              }
              return { items };
            }
            return;
          },
        };
        vscode.languages.registerInlineCompletionItemProvider(
          { pattern: '**' },
          provider
        );
      }),
    ];
  }
  return disposables;
};
export function activate(context: vscode.ExtensionContext) {
  let config = vscode.workspace.getConfiguration('codexco');
  // Add configuration
  let disposables: vscode.Disposable[] = [];
  disposables = registerExtensionCommands();
  context.subscriptions.push(...disposables);
  // Listen for configuration changes and reload extension commands
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('codexco')) {
      config = vscode.workspace.getConfiguration('codexco');
      disposables.forEach((disposable) => disposable.dispose());
      disposables = registerExtensionCommands();
      context.subscriptions.push(...disposables);
    }
  });
  context.subscriptions.push(configWatcher);
}
