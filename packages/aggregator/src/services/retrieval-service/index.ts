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
  "What is the VAT registration threshold for domestic sellers?",
  "What is the VAT registration threshold for non-established sellers?",
  "What is the VAT registration threshold for intra-EU distance selling of goods and services (if applicable)?",
  "What is the VAT registration threshold for non-resident, non-EU-based suppliers of electronically supplied services?",
  "What is the format of VAT identification numbers for individuals?",
  "What is the format of VAT identification numbers for businesses?",
  "Is there a tool to validate VAT identification numbers? If yes, how can it be accessed?",
  "Are there specific VAT rules for electronically supplied services (ESS)?",
  "What is the VAT rate for ESS for B2B and B2C transactions?",
  "What are examples of taxable electronically supplied services in the country?",
  "Are there special rules for VAT on digital services provided by non-residents? If yes, what are they?",
  "What is the filing frequency for VAT returns (monthly, quarterly, annually)?",
  "What is the name of the VAT return form?",
  "What are the deadlines for VAT filing and payments?",
  "Are there penalties for late filing or misdeclarations? If yes, what are they?",
  "What is the payment currency for VAT?",
  "Are VAT returns and payments required to be submitted electronically?",
  "Is there a system for simplified VAT returns? If yes, who qualifies for it?",
  "Is e-invoicing mandatory in the country? If yes, for which transactions?",
  "What are the requirements for e-invoices (mandatory fields)?",
  "Is there a central platform for e-invoicing? If yes, what is it?",
  "Which governmental body is responsible for e-invoicing and digital reporting?",
  "What details must be included on a VAT invoice?",
  "Are there specific requirements for simplified invoices? If yes, what are they?",
  "Are there rules for reverse charge, margin schemes, or VAT exemptions to be mentioned on invoices?",
  "Are there specific VAT rules for marketplace and platform operators?",
  "What are the VAT obligations for marketplaces that facilitate the supply of goods?",
  "What are the VAT obligations for marketplaces that facilitate the supply of services?",
  "Are there specific territories excluded from the scope of VAT in the country?",
  "Are there temporary VAT rate reductions or special measures in place (e.g., Covid-19 measures)?",
  "What is the penalty structure for non-compliance with VAT regulations?",
  "What is the name of the tax authority responsible for VAT?",
  "What is the official website of the tax authority?",
  "Are there resources or guides provided by the tax authority for businesses?",
];

export const RetrievalService = {
  getInfoForCountry: async (countryCode: string) => {
    const assistant = await RetrievalService.getAssistantForCountry(
      countryCode
    );

    // Helper function to process a single question
    const processQuestion = async (question: string) => {
      try {
        const response = await OpenAIService.getAssistantCompletion(
          assistant.id,
          question
        );

        return response.content.length > 0
          ? response.content
          : (() => {
              console.warn(
                `No information found for question: ${question} in country ${countryCode}`
              );
              return "No information found";
            })();
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
