import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { articlesApi } from '../services/api';

export default function ArticleReader({ articleId }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articlesApi.get(articleId);
        setArticle(response.data);
      } catch (error) {
        setError('Failed to load article');
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return <div className="text-center py-8">Loading article...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!article) {
    return <div className="text-center py-8">Article not found</div>;
  }

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{article.title}</h1>
      <div className="space-y-4">
        {article.sentences.map((sentence, index) => (
          <div key={index} className="group">
            <p className="leading-relaxed">
              {sentence.content}
            </p>
            {sentence.words && sentence.words.length > 0 && (
              <div className="text-sm text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                New words: {sentence.words.map(word => word.lemma).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}