import { Configuration, OpenAIApi } from "openai";
import {getConfig} from "../config";

const config = getConfig();

const configuration = new Configuration({
    apiKey: config.openAiApiKey ? process.env.OPENAIAI_API_KEY : '',
});
const openai = new OpenAIApi(configuration);



export type CreateCompletionResult = {
    createCompletionResultChoices: string,
};


/**
 * Send a request to the OpenAI server to get the tokens following prompt.
 */
export const  getCompletionResult = (req: string): Promise<CreateCompletionResult> => {
    return new Promise(async (resolve, reject) => {
        await openai.createCompletion({
            /* eslint-disable @typescript-eslint/naming-convention */
            model: config.completionsModel,
            prompt: req,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            top_p: config.topP,
            n: config.n,
            stop: config.completionEngineDefaultstop,
            presence_penalty: config.presencePenalty,
            frequency_penalty: config.frequencyPenalty
        })
            .then((res: any) => {
                const resp = JSON.parse(res.text);

                if (resp["choices"].length === 0) {
                    reject(new Error("No code returned by the server."));
                } else {
                    resolve((resp["choices"][0]["text"]));
                }
            })
            .catch((Error: any) => {
                if (Error) {
                    let message: string;
                    // If the API specified an error message, return it.
                    if (Error.response.text) {
                        message = JSON.parse(Error.response.text).error.message;
                    } else {
                        message = Error;
                    }
                    reject(new Error(message));
                }}

            );
    });
};
