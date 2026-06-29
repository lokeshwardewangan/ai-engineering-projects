// Implementation details
let conversations = new Map<string, string>();

export const conversationReposatory = {
  getLastResponseId(conversationId: string) {
    return conversations.get(conversationId);
  },
  setLastResponseId(conversationId: string, responseId: string) {
    conversations.set(conversationId, responseId);
  },
};
