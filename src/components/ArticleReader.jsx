import React, { useState, useEffect } from 'react';
import { articlesApi } from '../services/api';
import { AlertCircle, ChevronDown, Book } from 'lucide-react';
import { Button } from './ui/button';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/15 text-destructive p-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rounded-lg bg-muted p-4 flex items-center gap-2">
        <Book className="h-5 w-5" />
        <span>Article not found</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">{article.title}</h1>
          <div className="space-y-6">
            {article.sentences.map((sentence, index) => (
              <div key={index} className="group">
                <p className="text-lg leading-relaxed">
                  {sentence.content}
                </p>
                {sentence.words && sentence.words.length > 0 && (
                  <div className="mt-2 rounded-lg border bg-muted/50">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-between p-4"
                      onClick={() => document.getElementById(`words-${index}`).click()}
                    >
                      <span className="font-medium">New Words</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <input type="checkbox" id={`words-${index}`} className="hidden peer" />
                    <div className="hidden peer-checked:block p-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {sentence.words.map((word, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            {word.lemma}
                          </span>
                        ))}
                      </div>
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