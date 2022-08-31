import { getConfig } from '../config';
import { Configuration, OpenAIApi } from "openai";




const config = getConfig();

const configuration = new Configuration({
  apiKey: config.openAiApiKey ? process.env.OPENAIAI_API_KEY : '',
});
const openai = new OpenAIApi(configuration);


export const getCompletionResult = async (req: string, res: { status: (statusCode: number) => { (): any; new(): any; json: { (resText: { text: string | undefined; }): void; new(): any; }; }; }) => {
	const createCompletionRequest = await openai.createCompletion({
    /* eslint-disable @typescript-eslint/naming-convention */
    model: config.completionsModel,
    prompt: req,
    temperature: config.temperature,
    max_tokens: config.maxTokens, 
    top_p: config.topP,
    presence_penalty: config.presencePenalty,
    frequency_penalty: config.frequencyPenalty,
    stop: config.completionEngineDefaultstop.length === 0 ? null : config.completionEngineDefaultstop // API does not accept empty array
  });
  res.status(200).json({text:  createCompletionRequest.data.choices[0].text });
};
