import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OpenAIService = {
  createVectorStore: async (name: string) => {
    const vectorStore = await openai.beta.vectorStores.create({
      name: `${name}`,
    });

    return vectorStore;
  },

  getVectorStoreByName: async (name: string) => {
    const vectorStores = await openai.beta.vectorStores.list();

    const vectorStore = vectorStores.data.find(
      (vectorStore) => vectorStore.name === name
    );

    if (!vectorStore) {
      throw new Error("Vector store not found");
    }

    return vectorStore;
  },

  getVectorStoreById: async (id: string) => {
    const vectorStore = await openai.beta.vectorStores.retrieve(id);

    if (!vectorStore) {
      throw new Error("Vector store not found");
    }

    return vectorStore;
  },

  uploadFile: async (file: File) => {
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    if (!uploadedFile) {
      throw new Error("Failed to upload file");
    }

    return uploadedFile;
  },

  uploadFileToVectorStore: async (vectorStoreId: string, fileId: string) => {
    const vectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStoreId,
      {
        file_id: fileId,
      }
    );

    if (!vectorStoreFile) {
      throw new Error("Failed to upload file to vector store");
    }

    return vectorStoreFile;
  },

  uploadFilesToVectorStore: async (
    vectorStoreId: string,
    fileIds: string[]
  ) => {
    const vectorStoreFileBatch =
      await openai.beta.vectorStores.fileBatches.create(vectorStoreId, {
        file_ids: fileIds,
      });

    if (!vectorStoreFileBatch) {
      throw new Error("Failed to create vector store file batch");
    }

    return vectorStoreFileBatch;
  },

  createAssistant: async (
    name: string,
    instructions: string,
    model: string,
    vectorStoreId: string
  ) => {
    const assistant = await openai.beta.assistants.create({
      instructions: instructions,
      name: name,
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreId],
        },
      },
      model: model,
    });

    if (!assistant) {
      throw new Error("Failed to create assistant");
    }

    return assistant;
  },

  getAssistantByName: async (name: string) => {
    const assistants = await openai.beta.assistants.list();

    const assistant = assistants.data.find(
      (assistant) => assistant.name === name
    );

    if (!assistant) {
      throw new Error(`Assistant not found: ${name}`);
    }

    return assistant;
  },

  getAssistantById: async (id: string) => {
    const assistant = await openai.beta.assistants.retrieve(id);

    if (!assistant) {
      throw new Error(`Assistant not found: ${id}`);
    }

    return assistant;
  },

  getAssistantCompletion: async (assistantId: string, prompt: string) => {
    const run = await OpenAIService.createThreadAndRun(assistantId, prompt);
    const lastMessage = await OpenAIService.getLastThreadMessage(run.thread_id);

    return lastMessage;
  },

  createThreadAndRun: async (assistantId: string, prompt: string) => {
    try {
      const assistant = await openai.beta.assistants.retrieve(assistantId);
      console.log("Assistant details:", JSON.stringify(assistant, null, 2));

      const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [{ role: "user", content: prompt }],
        },
      });

      if (!run) {
        throw new Error("Failed to create thread and run");
      }

      let runStatus;
      const runId = run.id;
      const threadId = run.thread_id;
      let attempts = 0;
      const maxAttempts = 60; // 1 minute timeout

      do {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        console.log(`Run status: ${runStatus.status}`);
        attempts++;

        if (attempts >= maxAttempts) {
          throw new Error("Thread run timed out");
        }

        // Handle other potential statuses
        if (
          runStatus.status === "requires_action" ||
          runStatus.status === "expired" ||
          runStatus.status === "cancelled" ||
          runStatus.status === "failed"
        ) {
          console.error(
            "Run failed with status:",
            JSON.stringify(runStatus, null, 2)
          );
          throw new Error(
            `Thread run ${runStatus.status}: ${
              runStatus.last_error?.message || "Unknown error"
            }`
          );
        }
      } while (runStatus.status !== "completed");

      return run;
    } catch (error) {
      console.error("Full error details:", error);
      console.error("Assistant ID:", assistantId);
      console.error("Prompt:", prompt);
      throw error;
    }
  },

  getLastThreadMessage: async (threadId: string) => {
    const messages = await openai.beta.threads.messages.list(threadId);

    if (!messages) {
      throw new Error("Failed to get thread messages");
    }

    const lastMessage = messages.data[messages.data.length - 1];

    if (!lastMessage) {
      throw new Error("Failed to get last thread message");
    }

    return lastMessage;
  },

  getCompletion: async (
    systemPrompt: string,
    userPrompt: string,
    model: string,
    temperature: number = 0.2
  ) => {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: model,
      temperature: temperature,
    });

    return completion;
  },
};

export default OpenAIService;
