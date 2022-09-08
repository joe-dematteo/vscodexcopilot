import { getConfig, openai } from './codexSettings';


type CreateCompletionResult = {
    createCompletionResultChoices: any
};


/*
*    This code is calling the OpenAI API createCompletion endpoint to generate
*    code given the prompt and parameters filled with settings from the config file.
*/

export const  getCompletionResult = (req: any): Promise<CreateCompletionResult> => {
    return new Promise((resolve, reject) => {
        const createCompletionRequest =  openai.createCompletion({
            /* eslint-disable @typescript-eslint/naming-convention */
            model: getConfig().completionsModel,
            prompt: req,
            max_tokens: getConfig().maxTokens,
            temperature: getConfig().temperature,
            top_p: getConfig().topP,
            n: getConfig().n,
            stop: getConfig().completionEngineDefaultStop,
            presence_penalty: getConfig().presencePenalty,
            frequency_penalty: getConfig().frequencyPenalty
        });
        createCompletionRequest.then((response: any) => {
            if(!response.data || !response.data.choices || response.data.choices.length === 0) {
                reject(new Error("No code returned by the server."));
                } else {
                    resolve(response.data.choices[0]?.text ?? "Undefined case");
                }
        });
        createCompletionRequest.catch((error: string | undefined) => {
            // If the API specified an error message, return it.
            reject(new Error(error));
        });
    });
};


