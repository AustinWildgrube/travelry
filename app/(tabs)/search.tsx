import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { Input, Layout } from '&/components/atoms';
import { ProfileUserItem } from '&/components/profile';
import { getUserFromSearch } from '&/queries/users';

export default function Search(): JSX.Element {
  const [search, setSearch] = useState<string>('');

  const { data: searchData, refetch: refetchSearch } = useQuery({
    queryKey: ['search'],
    queryFn: () => getUserFromSearch(search),
    enabled: false,
  });

  useEffect(() => {
    if (search !== '') {
      refetchSearch();
    }
  }, [search]);

  return (
    <View style={styles.container}>
      <Layout>
        <Input label="Search" placeholder="Explore Users & Places" onChangeText={setSearch} />

        <FlatList
          data={searchData}
          renderItem={({ item }) => <ProfileUserItem account={item} />}
          keyExtractor={item => item.id}
          style={{ backgroundColor: 'white' }}
        />

        <Stack.Screen options={{ headerShown: false }} />
      </Layout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});
