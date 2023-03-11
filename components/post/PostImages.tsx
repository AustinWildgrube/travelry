import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { type PostMedia } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostImageProps {
  postLocation: string;
  postMedia: PostMedia[];
  startIndex: number;
}

export function PostImages({ postLocation, postMedia, startIndex }: PostImageProps): JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.postTop}>
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={styles.backButton}>
          <Feather name="chevron-left" size={18} color="#2D323E" />
        </Pressable>

        <View style={styles.location}>
          <Text style={styles.cityCountry}>{postLocation}</Text>
        </View>
      </View>

      <SwiperFlatList
        data={postMedia}
        showPagination={false}
        index={startIndex}
        renderItem={({ item }) => (
          <Image
            source={{ uri: downloadSupabaseMedia('posts', item.file_url) }}
            accessibilityLabel="Post image"
            style={styles.postImage}
          />
        )}
      />
    </View>
  );
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  postTop: {
    flex: 0.65,
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
  backButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    opacity: 0.6,
    width: 38,
  },
  location: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    opacity: 0.6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cityCountry: {
    color: '#0C0F14',
  },
  postImage: {
    height: '100%',
    width: width,
  },
});
