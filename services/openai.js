const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    organization: "org-LFZTSLsuaN7l9YgCLmhwSCHI",
    apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

async function getRes(query) {

    console.log('API',process.env.OPENAI_API_KEY)
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: query,
            max_tokens: 60,
            temperature: 0.3,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
    });

    return completion.data.choices[0].text;
}

//getRes('How hot is the sun?');
module.exports = {getRes}
