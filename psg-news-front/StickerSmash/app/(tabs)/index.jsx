import  { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';


const PSGNews = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://10.192.14.244:3000/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

 

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderArticleCard = (article, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        selectedArticle?.link === article.link && styles.selectedCard
      ]}
      onPress={() => handleArticleClick(article)}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.image || 'https://via.placeholder.com/400x300' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.sourceTag}>
            <Text style={styles.sourceText}>{article.source}</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderArticleView = () => {
    if (!selectedArticle) {
      return (
        <View style={styles.noSelectionContainer}>
          <Text style={styles.noSelectionText}>
            Select an article to view its content
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.articleContainer}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleTitle} numberOfLines={1}>
            {selectedArticle.title}
          </Text>
          <TouchableOpacity
            onPress={handleCloseArticle}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: selectedArticle.link }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              style={styles.webviewLoader}
              size="large"
              color="#2563eb"
            />
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Feather name="file-text" size={28} color="#2563eb" />
        <Text style={styles.headerTitle}>PSG News</Text>
      </View>
      <View style={styles.mobileContainer}>
        {!selectedArticle ? (
          <ScrollView style={styles.newsList}>
            {news.map((article, index) => renderArticleCard(article, index))}
            {news.length === 0 && (
              <Text style={styles.noNewsText}>No news articles available</Text>
            )}
          </ScrollView>
        ) : (
          renderArticleView()
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#111827',
  },
  mobileContainer: {
    flex: 1,
  },
  newsList: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  cardContent: {
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sourceTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sourceText: {
    color: '#fff',
    fontSize: 12,
  },
  textContainer: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
  },
  articleContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  articleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  webview: {
    flex: 1,
  },
  webviewLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    margin: 16,
    borderRadius: 8,
  },
  noSelectionText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
  errorText: {
    color: '#dc2626',
  },
  noNewsText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
  },
});

export default PSGNews;