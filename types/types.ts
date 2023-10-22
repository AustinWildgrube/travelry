import { z } from 'zod';

// Zod Schemas
export const UserStatSchema = z.object({
  following_count: z.number().nonnegative(),
  followers_count: z.number().nonnegative(),
  trip_count: z.number().nonnegative(),
});

export type UserStat = z.infer<typeof UserStatSchema>;

export const UserAlbumSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cover: z.string().nullable(),
  cover_placeholder: z.string().nullable(),
  post_count: z.number().nonnegative(),
});

export type UserAlbum = z.infer<typeof UserAlbumSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  avatar_placeholder: z.string().nullable(),
  bio: z.string().nullable(),
  account_stat: UserStatSchema,
  album: z.array(UserAlbumSchema),
  is_following: z.union([
    z.boolean(),
    z.array(
      z.object({
        count: z.number().nonnegative(),
      }),
    ),
  ]),
});

export type User = z.infer<typeof UserSchema>;

// Types
export type AlbumPostMedia = {
  id: string;
  album_id: string;
  post_media: PostMedia[];
};

export type Conversation = {
  last_read: string;
  deleted_at: string;
  details: {
    id: number;
    created_at: string;
    updated_at: string;
    origin_account_id: UserSummary;
    conversation_target: UserSummary[];
    messages: ConversationMessage[];
  };
};

export type ConversationMessage = {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  account_id: UserSummary;
};

export type Comment = {
  id: number;
  text: string;
  post_id: string;
  account: UserSummary;
  comment_stat: CommentStat;
  comment_like: {
    id: number;
    comment_id: number;
    account_id: string;
  };
  reply_origin_comment_id: number | null;
  in_reply_to_comment_id: {
    id: number;
    account: Pick<User, 'id' | 'first_name' | 'last_name'>;
  } | null;
};

export type CommentStat = {
  id: number;
  likes_count: number;
  replies_count: number;
};

export type InfiniteQuery<T> = {
  pageParams: number[];
  pages: T[];
};

export type PaginatedData<T> = {
  data: T[];
  count: number;
  cursor: number;
};

export type Post = {
  id: string;
  caption: string;
  created_at: string;
  location: string;
  account: UserSummary;
  post_media: PostMedia[];
  post_stat: {
    id: string;
    likes_count: number;
  };
  post_like: {
    id: string;
    post_id: string;
    account_id: string;
  };
};

export type PostMedia = {
  id: string;
  file_url: string;
  file_placeholder: string;
};

export type UserFollows = {
  id: string;
  account: UserSummary;
  is_following?: boolean | { count: number }[];
};

export type UserSummary = Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar_url' | 'avatar_placeholder'>;
