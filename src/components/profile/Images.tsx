import { Fragment, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Image, Paragraph, YStack } from 'tamagui';

import { useCurrentUser } from '../../contexts/AuthProvider';
import { downloadSupabaseMedia } from '../../utilities/helpers';
import { getPosts, PostMedia } from '../../queries/posts';
import type { Post } from '../../queries/posts';

export function Images(): JSX.Element {
  const user = useCurrentUser();
  const [posts, setPosts] = useState<Post[] | null>();

  const combineMediaByLocation = (posts: Post[]): Post[] => {
    const result = new Map<string, Post>();
    posts.reduce((object: Map<string, Post>, post: Post) => {
      const { location, post_media } = post;
      if (object.has(location)) {
        object.get(location)?.post_media.push(...post_media);
      } else {
        object.set(location, { location, post_media });
      }

      return object;
    }, result);

    return [...result.values()];
  };

  const renderItem = ({ item }: { item: PostMedia }): JSX.Element => (
    <Image src={downloadSupabaseMedia('posts', item.file_url)} height={200} width={200} mr="$2" key={item.id} />
  );

  useEffect(() => {
    const getUsersPosts = async (): Promise<void> => {
      if (user.id) {
        const posts: Post[] | null = await getPosts(user.id);
        if (posts) {
          const combinedPosts: Post[] = combineMediaByLocation(posts);
          setPosts(combinedPosts);
        }
      }
    };

    getUsersPosts();
  }, [user]);

  return (
    <Fragment>
      {posts &&
        posts.map((data: any) => (
          <YStack mt="$4" key={data.location}>
            <Paragraph mb="$2">
              {data.location} &#xb7; {data.post_media.length} Images
            </Paragraph>

            <FlatList
              data={data.post_media}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(image: PostMedia) => image.id}
              horizontal
            />
          </YStack>
        ))}
    </Fragment>
  );
}
