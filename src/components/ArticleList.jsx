import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { articlesApi } from '../services/api';
import { formatDate } from '../lib/utils';

export default function ArticleList({ onSelectArticle }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articlesApi.getAll();
        setArticles(response.data);
      } catch (error) {
        setError('Failed to load articles');
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading articles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No articles found. Try uploading one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="p-6">
          <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
          <p className="text-gray-500 text-sm mb-4">
            Added {formatDate(article.created_at)}
          </p>
          <Button
            onClick={() => onSelectArticle(article.id)}
            variant="outline"
          >
            Read Article
          </Button>
        </Card>
      ))}
    </div>
  );
}