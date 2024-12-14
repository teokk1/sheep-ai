import { OpenAIService } from "@/services/openai-service";

const INSTRUCTIONS = `
  You retrieve information about the mentioned country's tax code, tax laws and business laws.
  You are given a specific question about the mentioned country's regulation.
  You will search for the relevant information in your knowledge base.
  You will return all relevant information in a natural language response.
  Your response has to comprehensive and feature all aspects of the mentioned country's regulations for the given question.
  Your response will be used by an aggregator to compile a comprehensive overview of the mentioned country's regulations.
  The aggregator will handle the formatting and the presentation of the information, just return pure text with no formatting.
  Avoid filler words, but make sure to include all relevant information.

  COUNTRY CODE:
`;

const MODEL = "gpt-4o";

const QUESTIONS = [
  "What is the standard VAT rate in the country?",
  "Are there any reduced VAT rates? If yes, what are they, and to which goods or services do they apply?",
  "Are there any exemptions from VAT? If yes, which goods or services are exempt?",
];

export const RetrievalService = {
  getInfoForCountry: async (countryCode: string) => {
    const assistant = await RetrievalService.getAssistantForCountry(
      countryCode
    );

    const processQuestion = async (question: string) => {
      try {
        const response = await OpenAIService.getAssistantCompletion(
          assistant.id,
          question
        );

        if (response.content && Array.isArray(response.content)) {
          const textContent = response.content
            .filter((content) => content.type === "text")
            .map((content) => content.text?.value)
            .filter(Boolean)
            .join("\n");

          if (textContent) {
            return textContent;
          }
        }

        console.warn(
          `No information found for question: ${question} in country ${countryCode}`
        );
        return "No information found";
      } catch (error) {
        console.error(
          `Error processing question: ${question} for country ${countryCode}:`,
          error
        );
        return "Error retrieving information";
      }
    };

    // Process questions in parallel with concurrency control
    const batchSize = 5; // Adjust this number based on your system's capabilities
    const answers = [];

    for (let i = 0; i < QUESTIONS.length; i += batchSize) {
      const batch = QUESTIONS.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((question) => processQuestion(question))
      );
      answers.push(...batchResults);
    }

    return answers;
  },

  createAssistantForCountry: async (countryCode: string) => {
    const vectorStore = await OpenAIService.createVectorStore(`${countryCode}`);

    const assistant = await OpenAIService.createAssistant(
      `${countryCode}`,
      `${INSTRUCTIONS} ${countryCode}`,
      MODEL,
      vectorStore.id
    );

    return assistant;
  },

  getAssistantForCountry: async (countryCode: string) => {
    const assistant = await OpenAIService.getAssistantByName(`${countryCode}`);
    return assistant;
  },
};

export default RetrievalService;
