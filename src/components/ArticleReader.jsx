import React, { useState, useEffect } from 'react';
import { articlesApi } from '../services/api';
import { AlertCircle, ChevronDown, Book, FileQuestion } from 'lucide-react';

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
        if (error.response && error.response.status === 404) {
          setArticle(null);
        } else {
          setError('Failed to load article');
          console.error('Error fetching article:', error);
        }
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

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FileQuestion className="h-16 w-16 text-base-content/50" />
        <h2 className="text-xl font-semibold text-base-content">Article Not Found</h2>
        <p className="text-base-content/70">
          The article you're looking for doesn't exist or has been removed.
        </p>
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

  return (
    <div className="card bg-base-100 shadow-xl max-w-6xl mx-auto p-8">
      <h1 className="card-title text-3xl mb-8 text-base-content">{article.title}</h1>
      {article.sentences.map((sentence, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-lg leading-relaxed text-base-content flex-grow">
              {sentence.content}
            </p>
            {sentence.start_time != null && sentence.end_time != null && (
              <span className="text-sm text-base-content/60 whitespace-nowrap">
                {sentence.start_time.toFixed(1)}s - {sentence.end_time.toFixed(1)}s
              </span>
            )}
          </div>
          {sentence.words && sentence.words.length > 0 && (
            <div className="bg-base-200 p-2 flex flex-wrap gap-2 mb-6">
              {sentence.words.map((word, idx) => (
                <span key={idx} className="badge badge-primary">
                  {word.lemma}
                </span>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}