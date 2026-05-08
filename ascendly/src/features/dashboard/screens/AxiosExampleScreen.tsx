import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components';
import { useTheme } from '@shared/theme';
import { jsonPlaceholderClient } from '@core/api';
import { createStyles } from './AxiosExampleStyles';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const AxiosExampleScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await jsonPlaceholderClient.get<Post[]>('/posts?_limit=10');
      setPosts(response.data);
    } catch (error) {
      console.error('[AxiosExample] GET Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    const newPostData = {
      title: 'New Post Added',
      body: 'This post was created using a POST request.',
      userId: 1,
    };

    try {
      const response = await jsonPlaceholderClient.post<Post>('/posts', newPostData);
      setPosts([response.data, ...posts]);
      Alert.alert("Success", "Post created successfully! (Simulated)");
    } catch (error) {
      console.error('[AxiosExample] POST Error:', error);
    }
  };

  const handleUpdatePost = async (id: number) => {
    const updatedData = {
      title: 'Post Updated',
      body: 'Content has been modified via PUT request.',
      userId: 1,
    };

    try {
      const response = await jsonPlaceholderClient.put<Post>(`/posts/${id}`, updatedData);
      setPosts(posts.map(p => p.id === id ? { ...p, ...response.data } : p));
      Alert.alert("Success", `Post #${id} updated successfully!`);
    } catch (error) {
      console.error('[AxiosExample] PUT Error:', error);
    }
  };

  const handleDeletePost = (id: number) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await jsonPlaceholderClient.delete(`/posts/${id}`);
              setPosts(posts.filter(p => p.id !== id));
              Alert.alert("Deleted", `Post #${id} removed successfully!`);
            } catch (error) {
              console.error('[AxiosExample] DELETE Error:', error);
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleUpdatePost(item.id)}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>Update</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeletePost(item.id)}
        >
          <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Axios CRUD Example" showBack />
      
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPosts(true)}
              colors={[colors.primary]}
            />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AxiosExampleScreen;
