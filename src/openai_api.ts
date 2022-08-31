import { getConfig } from './config';
import { Configuration, OpenAIApi } from "openai";

const config = getConfig();

const configuration = new Configuration({
  apiKey: config.openAiApiKey ? process.env.OPENAIAI_API_KEY : '',
});
const openai = new OpenAIApi(configuration);

/**
 * Send a request to the OpenAI server to get the tokens following prompt.
 */
// export const getEditResult = (
//   req: string
// ): Promise<string> => {
//   return new Promise(async (resolve, reject) => {
//     const createEditRequest = await openai.createEdit({
//           /* eslint-disable @typescript-eslint/naming-convention */
//           model: config.editsModel,
//           input: req,
//           instruction: config.editInstructions,
//           n: config.n,
//           temperature: config.temperature,
//           top_p: config.topP,
//         }), editResult = JSON.parse(createEditRequest.data.choices[0].text),
//         checkEditResult = async (Error: any) => {
//           if (Error) {
//             let message: string;
//             // If the API specified an error message, return it.
//             if (Error.response.text) {
//               message = JSON.parse(Error.response.text).error.message;
//             } else {
//               message = Error;
//             }
//             reject(new Error(message));
//             return;
//           }
//
//           if (editResult["choices"].length === 0) {
//             reject(new Error("No code returned by the server."));
//           } else {
//             resolve(String(editResult["choices"][0]["text"]));
//           }
//         };
//   });
// };


/**
 * Send a request to the OpenAI server to get the tokens following prompt.
 */
export const getEditResult = (
    req: string
): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const createEditRequest = await openai.createEdit({
                /* eslint-disable @typescript-eslint/naming-convention */
                model: config.editsModel,
                input: req,
                instruction: config.editInstructions,
                n: config.n,
                temperature: config.temperature,
                top_p: config.topP
            }), editResult = JSON.parse(createEditRequest.data.choices[0].text),
            getEditResult.then (Error: any) => {
                if (Error) {
                    let message: string;
                    // If the API specified an error message, return it.
                    if (Error.response.text) {
                        message = JSON.parse(Error.response.text).error.message;
                    } else {
                        message = Error;
                    }
                    reject(new Error(message));
                    return;
                }

                if (editResult["choices"].length === 0) {
                    reject(new Error("No code returned by the server."));
                } else {
                    resolve(String(editResult["choices"][0]["text"]));
                }
            };
    });
};

