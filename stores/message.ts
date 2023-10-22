import { create } from 'zustand';

type RecipientStore = {
  chosenRecipients: string[];
  addRecipient: (recipientId: string) => void;
  removeRecipient: (recipientId: string) => void;
};

export const useMessageStore = create<RecipientStore>(set => ({
  chosenRecipients: [],
  addRecipient: recipientId => {
    set(state => ({
      chosenRecipients: [...state.chosenRecipients, recipientId],
    }));
  },
  removeRecipient: recipientId => {
    set(state => ({
      chosenRecipients: state.chosenRecipients.filter(recipient => recipient !== recipientId),
    }));
  },
}));
