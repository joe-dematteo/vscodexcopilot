import { Configuration, OpenAIApi } from "openai";
import * as vscode from 'vscode';

export type Config = {
  openAiApiKey: string;
  editsModel: string;
  completionsModel: string;
  editInstructions: string;
  maxTokens: number;
  n: number;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  completionEngineDefaultstop: Array<string>;
  completionEngineEnabled: boolean;
};

/**
 * Get the configuration from the settings.
 *
 * TODO: Return different value for `stop` depending on the level.
 */
export const getConfig = (): Config => {
  return {
    openAiApiKey:
      vscode.workspace.getConfiguration('general').get('openAiApiKey') ??
      process.env.OPENAI_API_KEY ??
      '',
    editsModel:
      vscode.workspace.getConfiguration('general').get('editsModel') ??
      'code-davinci-edit-001',
    completionsModel:
      vscode.workspace.getConfiguration('general').get('completionsModel') ??
      'code-davinci-002',
    editInstructions:
      vscode.workspace.getConfiguration('general').get('editInstructions') ??
      'Refactor this code',
    maxTokens:
        vscode.workspace.getConfiguration('general').get('maxTokens') ?? 64,
    n:
        vscode.workspace.getConfiguration('general').get('n') ?? 64,
    temperature:
      vscode.workspace.getConfiguration('general').get('temperature') ?? 0,
    topP: vscode.workspace.getConfiguration('general').get('topP') ?? 1,
    presencePenalty:
      vscode.workspace.getConfiguration('general').get('presencePenalty') ?? 0,
    frequencyPenalty:
      vscode.workspace.getConfiguration('general').get('frequencyPenalty') ?? 0,
    completionEngineDefaultstop:
      vscode.workspace.getConfiguration('general').get('completionEngineStopSequence') ??
      [],
    completionEngineEnabled:
      vscode.workspace.getConfiguration('general').get('completionEngineEnabled') ??
      false,
  };
};

/**
 * Get API key, firstly from the extension settings and if not found, then from the environment variables.
 * TODO: export a constant function that containts an openai api configuration with the api key.
 */

// export const getOpenAiApiKey = (): any => {
//   const configuration = new Configuration({
//     apiKey: vscode.workspace.getConfiguration('general').get("OPENAI_API_KEY") ?? process.env.OPENAI_API_KEY ?? '',
//   const openai = new OpenAIApi(configuration);
//     return getConfig().openAiApiKey;
//   });
//   };

//  export const getApiKey = (): string => {
//   return vscode.workspace.getConfiguration('general').get("OPENAI_API_KEY") ?? process.env.OPENAI_API_KEY ?? "";
// };