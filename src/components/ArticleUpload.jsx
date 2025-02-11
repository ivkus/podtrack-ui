import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { articlesApi } from '../services/api';

export default function ArticleUpload({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await articlesApi.create({ title, content });
      await articlesApi.analyze(response.data.id);
      setTitle('');
      setContent('');
      if (onSuccess) onSuccess();
    } catch (error) {
      setError('Failed to upload article. Please try again.');
      console.error('Error uploading article:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Article Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Article Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste article content here..."
            className="h-64"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Uploading and Analyzing...' : 'Upload Article'}
        </Button>
      </form>
    </Card>
  );
}