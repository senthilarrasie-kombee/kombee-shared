import axios from 'axios';
import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '@/core/theme';

const ProductsListing = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    useEffect(() => {
        // to do with axios
        // https://jsonplaceholder.typicode.com/posts
        const getPosts = async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

getPosts();
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hellow World</Text>
        </View>
    );
};

export default ProductsListing;
