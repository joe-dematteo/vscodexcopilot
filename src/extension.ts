import * as vscode from 'vscode';

import { Config } from './config';
import { Configuration, OpenAIApi } from "openai";



export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'VSCodex.inline-completion-settings',
    () => {
      vscode.window.showInformationMessage('Show settings');
    }
  );

  context.subscriptions.push(disposable);
  let someTrackingIdCounter = 0;

  const provider: vscode.InlineCompletionItemProvider = {
    provideInlineCompletionItems: async (
      document,
      position,
      context,
      token
    ) => {
      console.log('provideInlineCompletionItems triggered');

      const regexp = /\/\/ \[(.+),(.+)\):(.*)/;
      if (position.line <= 0) {
        return;
      }

      const lineBefore = document.lineAt(position.line - 1).text;
      const matches = lineBefore.match(regexp);
      if (matches) {
        const start = matches[1];
        const startInt = parseInt(start, 10);
        const end = matches[2];
        const endInt =
          end === '*'
            ? document.lineAt(position.line).text.length
            : parseInt(end, 10);
        const insertText = matches[3].replace(/\\n/g, '\n');

        return [
          {
            insertText,
            range: new vscode.Range(
              position.line,
              startInt,
              position.line,
              endInt
            ),
            someTrackingId: someTrackingIdCounter++,
          },
        ] as MyInlineCompletionItem[];
      }
    },
  };

  vscode.languages.registerInlineCompletionItemProvider(
    { pattern: '**' },
    provider
  );
}

interface MyInlineCompletionItem extends vscode.InlineCompletionItem {
  someTrackingId: number;
}





const registerExtensionCommands = (
  config: Config,
): vscode.Disposable[] => {
  let disposables: vscode.Disposable[] = [];
  disposables = [
    ...disposables,
    vscode.commands.registerCommand("extension.CodexReplaceSelection", async (req, res) => {
      const _createCodeEditRequest = async (
        _model: string,
        _input: string,
        _instruction: string,
        _temperature: number,
        _topP: number) => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        const doc = editor.document;
        let input = doc.getText(editor.selection);

        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
      
        const createCodeEditRequest = await openai.createEdit({
          /* eslint-disable @typescript-eslint/naming-convention */
          model: config.editsModel,
          input: input,
          instruction: config.editIntructions,
          temperature: config.temperature,
          top_p: config.topP
        });
          
        const newCode = res.status(200).json({text: `${createCodeEditRequest.data.choices[0].text}`});
        editor.edit((editBuilder) => {
        editBuilder.replace(editor.selection, newCode);
      
      });
      };
    }),
  ];
  if (config.completionEngineEnabled) {
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
            // Use memoized clientComplete to avoid multiple calls to the OpenAI API
            const gptResponse = await client.complete({
              temperature: config.temperature,
              maxTokens: config.maxTokens,
              topP: config.topP,
              frequencyPenalty: config.frequencyPenalty,
              presencePenalty: config.presencePenalty,
              model: config.completionsModel,
              stop: config.completionEngineDefaultstop,
              prompt: text,
            });
            codexChannel.appendLine(`provideCompletionGptResponse: ${JSON.stringify(gptResponse.data)}`);
            const items = gptResponse.data.choices.map((choice) => {
              const item = new vscode.CompletionItem({label: `${choice.text.split('\n',1)[0].trim()}`, description: "Detail", detail: "AI"}, vscode.CompletionItemKind.Text);
              item.insertText = choice.text.trim();
              item.detail = "Codex Completion";
              item.documentation = choice.text.trim();
              item.preselect = true;
              item.sortText = "000AAAaaa";
              return item;
            });
            codexChannel.appendLine(`provideCompletionItems: ${JSON.stringify(items)}`);
            return items;
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