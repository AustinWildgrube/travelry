import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Heart } from '@tamagui/lucide-icons';

import { Card } from '&/components/atoms';
import { AppNavProps } from '&/navigators/app-navigator';

interface PostProps {
  navigation: AppNavProps<'Post'>;
}

export function FeedPost({ navigation }: PostProps): JSX.Element {
  return (
    <Pressable>
      <Card style={styles.post}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1674925271211-cef66b0db2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
              }}
              style={styles.accountAvatar}
            />

            <View>
              <Text style={styles.accountName}>Austin Wildgrube</Text>
              <Text style={styles.location}>Maui, Hawaii</Text>
            </View>
          </View>

          <View style={styles.likeButton}>
            <Heart size={21} color="#7C8089" />
            <Text style={styles.likeAmount}>15</Text>
          </View>
        </View>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1675432980667-95da207814a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
          }}
          style={styles.mainImage}
        />

        <View style={styles.secondaryImages}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1675659999529-630a3febadfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
            }}
            style={styles.secondaryImage}
          />

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1675670412085-1a8ff853895c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
            }}
            style={[styles.secondaryImage, { marginHorizontal: 4 }]}
          />

          <View style={styles.moreContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1675667329170-736408ff7a68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
              }}
              style={styles.secondaryImage}
              blurRadius={5}
            />

            <Text style={styles.overflowNumber}>+2</Text>
          </View>
        </View>

        <Text numberOfLines={3} style={styles.caption}>
          Lorem ipsum dolet amir solot Lorem ipsum dolet amir solot Lorem ipsum dolet amir solot Lorem ipsum dolet amir
          solot Lorem ipsum dolet amir solot Lorem ipsum
        </Text>

        <Text style={styles.lapsedTime}>Posted 1 hour ago</Text>
      </Card>
    </Pressable>
  );
}

const dimensions = Dimensions.get('window');
const height = Math.round(dimensions.width / 3);
const width = Math.round(dimensions.width - 64);

const styles = StyleSheet.create({
  post: {
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  accountAvatar: {
    borderRadius: 50,
    height: 32,
    marginRight: 8,
    width: 32,
  },
  accountName: {
    color: '#0C0F14',
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    color: '#7C8089',
  },
  likeButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeAmount: {
    color: '#7C8089',
    marginLeft: 8,
  },
  mainImage: {
    borderRadius: 4,
    height: height,
    marginBottom: 2,
    marginTop: 8,
    width: '100%',
  },
  secondaryImages: {
    flexDirection: 'row',
  },
  secondaryImage: {
    borderRadius: 4,
    height: Math.round(dimensions.width / 4),
    marginVertical: 8,
    width: width / 3,
  },
  moreContainer: {
    alignItems: 'center',
    flex: 1,
    height: Math.round(dimensions.width / 4),
    justifyContent: 'center',
    marginTop: 8,
    position: 'relative',
    width: width / 3,
  },
  overflowNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 8,
    position: 'absolute',
  },
  caption: {
    color: '#0C0F14',
    fontSize: 12,
    marginBottom: 8,
  },
  lapsedTime: {
    color: '#7C8089',
    fontSize: 12,
  },
});
