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
    try {
      console.log("Getting completion for prompt:", prompt);
      const run = await OpenAIService.createThreadAndRun(assistantId, prompt);
      console.log("Run completed, getting messages");

      // Wait a short moment to ensure messages are available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const messages = await openai.beta.threads.messages.list(run.thread_id);
      console.log("Retrieved messages:", JSON.stringify(messages, null, 2));

      // Get the last assistant message
      const assistantMessage = messages.data.find(
        (message) => message.role === "assistant"
      );

      if (!assistantMessage || !assistantMessage.content) {
        console.error("No assistant message found");
        throw new Error("No response from assistant");
      }

      // Extract text content from the message
      const textContent = assistantMessage.content
        .filter((content) => content.type === "text")
        .map((content) => content.text?.value)
        .filter(Boolean)
        .join("\n");

      if (!textContent) {
        console.error("No text content in assistant message");
        throw new Error("Empty response from assistant");
      }

      console.log("Final response:", textContent);
      return textContent;
    } catch (error) {
      console.error("Error in getAssistantCompletion:", error);
      throw error;
    }
  },

  createThreadAndRun: async (assistantId: string, prompt: string) => {
    try {
      const assistant = await openai.beta.assistants.retrieve(assistantId);
      console.log("Assistant details:", JSON.stringify(assistant, null, 2));

      // Create a thread with the initial message
      const thread = await openai.beta.threads.create({
        messages: [{ role: "user", content: prompt }],
      });

      // Create a run on that thread
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      if (!run) {
        throw new Error("Failed to create thread and run");
      }

      let runStatus;
      const runId = run.id;
      const threadId = thread.id;
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

      return { thread_id: threadId, id: runId };
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
