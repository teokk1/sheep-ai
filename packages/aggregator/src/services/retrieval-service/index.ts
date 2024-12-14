import { OpenAIService } from "@/services/openai-service";

const INSTRUCTIONS = `
  You retrieve information about the mentioned country's tax code, tax laws and business laws.
  You are given a specific question about the mentioned country's regulation.
  You will search for the relevant information in your knowledge base.
  You will return all relevant information in a natural language response.
  Your response has to comprehensive and feature all aspects of the mentioned country's regulations for the given question.
  Avoid filler words, but make sure to include all relevant information.

  COUNTRY CODE:
`;

const MODEL = "gpt-4o";

const QUESTIONS = [
  "What is the standard VAT rate in the country? Are there any reduced VAT rates? If yes, what are they, and to which goods or services do they apply? Are there any exemptions from VAT? If yes, which goods or services are exempt?",
  "What are the VAT registration thresholds for domestic sellers, non-established sellers, and non-resident, non-EU-based suppliers of electronically supplied services?",
  "Is e-invoicing mandatory in the country? If yes, for which transactions? What are the requirements for e-invoices, and what details must be included on a VAT invoice?",
  "What is the official website of the tax authority?",
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

        if (response) {
          return response;
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

    // Process questions sequentially
    const answers = [];
    for (const question of QUESTIONS) {
      const answer = await processQuestion(question);
      answers.push(answer);
    }

    return answers;
  },

  createAssistantForCountry: async (countryCode: string) => {
    let existingAssistant;
    try {
      existingAssistant = await RetrievalService.getAssistantForCountry(
        countryCode
      );
    } catch (error) {
      console.error(
        `Error fetching existing assistant for country ${countryCode}:`,
        error
      );
    }

    if (existingAssistant) {
      return existingAssistant;
    }

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
