import { getConfig, openai } from './codexSettings';


export type CreateEditResult = {
    createEditResultChoices: any;
};


/*
*    This code is calling the OpenAI API createEdit endpoint to generate
*    code given the prompt and parameters filled with settings from the config file.
*/

export const  getEditResult = (req: any): Promise<CreateEditResult> => {
    return new Promise((resolve, reject) => {
        const createEditRequest = openai.createEdit({
            /* eslint-disable @typescript-eslint/naming-convention */
            model: getConfig().editsModel,
            input: req,
            instruction: getConfig().editInstructions,
            n: getConfig().n,
            temperature: getConfig().temperature,
            top_p: getConfig().topP
        });
            createEditRequest.then((response: any) => {
                if(!response.data || !response.data.choices || response.data.choices.length === 0) {
                    reject(new Error("No code returned by the server."));
                    } else {
                        resolve(response.data.choices[0]?.text ?? "Undefined case");
                    }
            });
            createEditRequest.catch((error: string | undefined) => {
                // If the API specified an error message, return it.
                reject(new Error(error));
            });
    });
};
