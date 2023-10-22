import { supabase } from '&/services/supabase';
import { type Conversation } from '&/types/types';

export const getConversations = async (accountId: string): Promise<Conversation[]> => {
  const { data: conversations, error } = await supabase
    .from('conversation_target')
    .select(
      `
        last_read,
        deleted_at,
        details:conversation (
          id,
          created_at,
          updated_at,
          origin_account_id (
            id,
            username,
            first_name,
            last_name,
            avatar_url,
            avatar_placeholder
          ),
          conversation_target:account!conversation_target (
            id,
            username,
            first_name,
            last_name,
            avatar_url,
            avatar_placeholder
          ),
          messages:conversation_message (
            id,
            body,
            created_at,
            updated_at,
            account_id (
              id,
              username,
              first_name,
              last_name,
              avatar_url,
              avatar_placeholder
            )
          )
        )
      `,
    )
    .is('deleted_at', null)
    .eq('account_id', accountId)
    .order('id', { foreignTable: 'conversation.conversation_message', ascending: false })
    .limit(1, { foreignTable: 'conversation.conversation_message' });

  if (error) throw new Error(`getConversations(${error.code}): ${error.message}`);

  return conversations.sort((a: any, b: any): number => {
    const mostRecentMessageA = a.details.messages[0].created_at;
    const mostRecentMessageB = b.details.messages[0].created_at;
    return new Date(mostRecentMessageB).getTime() - new Date(mostRecentMessageA).getTime();
  }) as Conversation[];
};

export const getConversation = async (conversationId: string): Promise<Conversation[]> => {
  const { data: conversation, error } = await supabase
    .from('conversation_target')
    .select(
      `
        last_read,
        deleted_at,
        details:conversation (
          id,
          created_at,
          updated_at,
          origin_account_id (
            id,
            username,
            first_name,
            last_name,
            avatar_url,
            avatar_placeholder
          ),
          conversation_target:account!conversation_target (
            id,
            username,
            first_name,
            last_name,
            avatar_url,
            avatar_placeholder
          ),
          messages:conversation_message (
            id,
            body,
            created_at,
            updated_at,
            account_id (
              id,
              username,
              first_name,
              last_name,
              avatar_url,
              avatar_placeholder
            )
          )
        )
      `,
    )
    .is('deleted_at', null)
    .eq('conversation_id', conversationId)
    .limit(1);

  if (error) throw new Error(`getConversation(${error.code}): ${error.message}`);

  return conversation as Conversation[];
};

export const createConversation = async (chosenRecipients: string[], accountId: string): Promise<string> => {
  const { data: conversation, error } = await supabase
    .from('conversation')
    .insert([
      {
        origin_account_id: accountId,
      },
    ])
    .select(`id`)
    .single();

  if (error) throw new Error(`createConversation(${error.code}): ${error.message}`);

  return conversation.id;
};

export const createConversationTargets = async (conversationId: string, accountId: string, chosenRecipients: string[]): Promise<void> => {
  const conversationTargets = chosenRecipients.map(account_id => ({ conversation_id: conversationId, account_id }));
  conversationTargets.push({ conversation_id: conversationId, account_id: accountId }); // add ourselves to the conversation

  const { error } = await supabase.from('conversation_target').insert(conversationTargets);
  if (error) throw new Error(`createConversationTargets(${error.code}): ${error.message}`);
};

export const createConversationMessage = async (conversationId: string, accountId: string, body: string): Promise<void> => {
  const { error } = await supabase.from('conversation_message').insert([
    {
      conversation_id: conversationId,
      account_id: accountId,
      body,
    },
  ]);

  if (error) throw new Error(`createConversationMessage(${error.code}): ${error.message}`);
};

export const updateConversationLastRead = async (conversationId: string, accountId: string): Promise<void> => {
  const { error } = await supabase
    .from('conversation_target')
    .update({ last_read: new Date() })
    .eq('conversation_id', conversationId)
    .eq('account_id', accountId);

  if (error) throw new Error(`updateConversationLastRead(${error.code}): ${error.message}`);
};

export const deleteConversationTargetByAccountId = async (accountId: string, conversationId: number): Promise<void> => {
  // if the user is the last one in the conversation, delete the whole conversation
  const { data: conversation, error: conversationError } = await supabase
    .from('conversation_target')
    .select(
      `
        details:conversation (
          conversation_target (
            account_id,
            deleted_at
          )
        )
      `,
    )
    .eq('conversation_id', conversationId)
    .eq('account_id', accountId)
    .single();

  if (conversationError) throw new Error(`deleteConversationTargetByAccountId(${conversationError.code}): ${conversationError.message}`);

  // TODO: this is a hacky way to get around TS not liking the above query
  const conversationIII = conversation as any;
  const conversationTargetCount = conversationIII.details.conversation_target.filter((target: any) => target.deleted_at === null).length;

  if (conversationTargetCount === 1) {
    const { error } = await supabase.from('conversation').delete().eq('id', conversationId);
    if (error) throw new Error(`deleteConversationTargetByAccountIdOne(${error.code}): ${error.message}`);
  } else {
    const { error } = await supabase.from('conversation_target').update({ deleted_at: new Date() }).eq('account_id', accountId);
    if (error) throw new Error(`deleteConversationTargetByAccountIdTwo(${error.code}): ${error.message}`);
  }
};

export const deleteMessageById = async (messageId: number): Promise<void> => {
  const { error } = await supabase.from('conversation_message').delete().eq('id', messageId);
  if (error) throw new Error(`deleteMessage(${error.code}): ${error.message}`);
};
