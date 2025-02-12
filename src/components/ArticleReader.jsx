import React, { useState, useEffect } from 'react';
import { articlesApi } from '../services/api';
import { AlertCircle, ChevronDown, Book } from 'lucide-react';

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
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="alert alert-info">
        <Book className="h-5 w-5" />
        <span>Article not found</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl mb-8 text-base-content">{article.title}</h1>
          <div className="space-y-6">
            {article.sentences.map((sentence, index) => (
              <div key={index} className="group">
                <p className="text-lg leading-relaxed text-base-content">
                  {sentence.content}
                </p>
                {sentence.words && sentence.words.length > 0 && (
                  <div className="bg-base-200 mt-2 p-2">
                    <div className="flex flex-wrap gap-2">
                      {sentence.words.map((word, idx) => (
                        <span key={idx} className="badge badge-primary">
                          {word.lemma}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}