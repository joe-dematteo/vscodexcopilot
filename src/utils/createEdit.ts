import {getConfig, openai} from "../config";

const config = getConfig();



export type CreateEditResult = {
    createEditResultChoices: string,
};


/**
 * Send a request to the OpenAI API createEdit endpoint to get an edits response
 * following the input given.
 */

export const  getEditResult = (req: string): Promise<CreateEditResult> => {
    return new Promise(async (resolve, reject) => {
        await openai.createEdit({
            /* eslint-disable @typescript-eslint/naming-convention */
            model: config.editsModel,
            input: req,
            instruction: config.editInstructions,
            n: config.n,
            temperature: config.temperature,
            top_p: config.topP
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
