import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import CountryFlag from 'react-native-country-flag';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { AppNavProps } from '&/navigators/app-navigator';
import type { Post } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostImageProps {
  post: Post;
  startIndex: number;
}

export function PostImages({ post, startIndex }: PostImageProps): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();

  return (
    <View style={styles.postTop}>
      <View style={styles.topNav}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 8,
            height: 38,
            justifyContent: 'center',
            opacity: 0.6,
            width: 38,
          }}>
          <Feather name="chevron-left" size={18} color="#2D323E" />
        </Pressable>

        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 8,
            height: 38,
            flexDirection: 'row',
            justifyContent: 'center',
            opacity: 0.6,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}>
          <CountryFlag isoCode="fr" size={18} style={{ borderRadius: 2, marginRight: 8 }} />
          <Text style={{ color: '#0C0F14' }}>Paris, France</Text>
        </View>
      </View>

      <SwiperFlatList
        data={post.post_media}
        showPagination={false}
        index={startIndex}
        renderItem={({ item }) => (
          <Image source={{ uri: downloadSupabaseMedia('posts', item.file_url) }} style={styles.postImage} />
        )}
      />
    </View>
  );
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  postTop: {
    height: '65%',
    position: 'relative',
  },
  topNav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 30,
    width: '100%',
    zIndex: 1,
  },
  postImage: {
    height: '100%',
    width: width,
  },
});
