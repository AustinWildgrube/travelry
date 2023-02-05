import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import CountryFlag from 'react-native-country-flag';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { AppNavProps } from '&/navigators/app-navigator';
import { type Post } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostImageProps {
  navigation: AppNavProps<'Post'>;
  post: Post;
  startIndex: number;
}

export function PostImages({ navigation, post, startIndex }: PostImageProps): JSX.Element {
  return (
    <View style={styles.postTop}>
      <View style={styles.topNav}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back" style={styles.backButton}>
          <Feather name="chevron-left" size={18} color="#2D323E" />
        </Pressable>

        <View style={styles.location}>
          <CountryFlag isoCode="fr" size={18} style={styles.flag} />
          <Text style={styles.cityCountry}>Paris, France</Text>
        </View>
      </View>

      <SwiperFlatList
        data={post.post_media}
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
  flag: {
    borderRadius: 2,
    marginRight: 8,
  },
  cityCountry: {
    color: '#0C0F14',
  },
  postImage: {
    height: '100%',
    width: width,
  },
});
