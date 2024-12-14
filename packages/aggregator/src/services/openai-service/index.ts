import { z } from "zod";
import { OpenAI } from "openai";

export const OpenAIService = {
  createVectorStore: async (name: string) => {
    // Call openai service to create vector store
    // Named after country code
    // Return vector store object
  },

  getVectorStoreByName: async (name: string) => {
    // Call openai service to get vector store
    // Named after country code
    // Return vector store object
  },

  getVectorStoreById: async (id: string) => {
    // Call openai service to get vector store
    // Return vector store object
  },

  uploadFile: async (file: File) => {
    // Upload file to openai
    // Purpose = assistants
    // Return file id
  },

  uploadFileToVectorStore: async (vectorStoreId: string, fileId: string) => {
    // Upload file to vector store
    // Return file id
  },

  uploadFilesToVectorStore: async (
    vectorStoreId: string,
    fileIds: string[]
  ) => {
    // Upload files to vector store
    // Return file ids
  },

  createAssistant: async (name: string) => {
    // Create assistant
    // Named after country code
    // Return assistant object
  },

  getAssistantByName: async (name: string) => {
    // Get assistant
    // Named after country code
    // Return assistant object
  },

  getAssistantById: async (id: string) => {
    // Get assistant
    // Return assistant object
  },

  getAssistantCompletion: async (assistantId: string, prompt: string) => {
    // Get completion from assistant
    // Return completion object
  },
};

export default OpenAIService;
