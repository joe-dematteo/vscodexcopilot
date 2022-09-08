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
      vscode.workspace.getConfiguration('codexco').get('openAiApiKey') ??
      process.env.OPENAI_API_KEY ??
      '',
    editsModel:
      vscode.workspace.getConfiguration('codexco').get('codeRefactor.editsModel') ??
      'code-davinci-edit-001',
    completionsModel:
      vscode.workspace.getConfiguration('codexco').get('codeCompletion.completionsModel') ??
      'code-davinci-002',
    editInstructions:
      vscode.workspace.getConfiguration('codexco').get('codeRefactor.editInstructions') ??
      'Refactor this code',
    maxTokens:
        vscode.workspace.getConfiguration('codexco').get('codeCompletion.maxTokens') ?? 64,
    n:
        vscode.workspace.getConfiguration('codexco').get('settings.n') ?? 64,
    temperature:
      vscode.workspace.getConfiguration('codexco').get('settings.temperature') ?? 0,
    topP: vscode.workspace.getConfiguration('codexco').get('settings.topP') ?? 1,
    presencePenalty:
      vscode.workspace.getConfiguration('codexco').get('codeCompletion.presencePenalty') ?? 0,
    frequencyPenalty:
      vscode.workspace.getConfiguration('codexco').get('codeCompletion.frequencyPenalty') ?? 0,
    completionEngineDefaultStop:
      vscode.workspace.getConfiguration('codexco').get('codeCompletion.StopSequence') ??
      [],
    completionEngineEnabled:
      vscode.workspace.getConfiguration('codexco').get('codeCompletion.activated') ??
      true,
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