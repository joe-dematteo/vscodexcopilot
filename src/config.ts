import {Configuration, OpenAIApi} from 'openai';
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
  completionEngineDefaultStop: Array<string>;
  completionEngineEnabled: boolean;
};


/**
 * Get the configuration from VScode settings.
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
    completionEngineDefaultStop:
      vscode.workspace.getConfiguration('general').get('completionEngineStopSequence') ??
      [],
    completionEngineEnabled:
      vscode.workspace.getConfiguration('general').get('completionEngineEnabled') ??
      false,
  };
};


/**
 * Bind a new configuration from openai API to a constant and use that to create
 * a new OpenAIApi interface.
 */

const configuration = new Configuration({
  apiKey: getConfig().openAiApiKey,
});
export const openai = new OpenAIApi(configuration);