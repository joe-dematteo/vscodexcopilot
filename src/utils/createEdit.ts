import { getConfig } from '../config';
import { Configuration, OpenAIApi } from "openai";

const config = getConfig();

const configuration = new Configuration({
  apiKey: config.openAiApiKey ? process.env.OPENAIAI_API_KEY : '',
});
const openai = new OpenAIApi(configuration);


export const getEditResult = async (req: string) => {
	const createEditRequest = await openai.createEdit({
    /* eslint-disable @typescript-eslint/naming-convention */
    model: config.editsModel,
    input: req,
    instruction: config.editIntructions,
    n: config.n,
    temperature: config.temperature,
    top_p: config.topP,
  });
  const editResult = createEditRequest.data.choices[0].text;
};