import React, { useState } from 'react';
import { articlesApi } from '../services/api';
import { Upload, AlertCircle, X } from 'lucide-react';

export default function ArticleUpload({ onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [textFile, setTextFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('textFile', textFile);
      formData.append('audioFile', audioFile);

      await articlesApi.uploadArticle(formData);
      
      setTitle('');
      setTextFile(null);
      setAudioFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      setError('Failed to upload article. Please try again.');
      console.error('Error uploading article:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Upload Article</h3>
        {onCancel && (
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Article Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className="input input-bordered w-full focus:input-primary transition-colors duration-200"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Text File (TXT)</span>
          </label>
          <input
            type="file"
            onChange={(e) => setTextFile(e.target.files[0])}
            accept=".txt"
            className="file-input file-input-bordered w-full hover:file-input-primary transition-colors duration-200"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Audio File</span>
          </label>
          <input
            type="file"
            onChange={(e) => setAudioFile(e.target.files[0])}
            accept="audio/*"
            className="file-input file-input-bordered w-full hover:file-input-primary transition-colors duration-200"
            required
          />
        </div>

        {error && (
          <div className="alert alert-error shadow-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Article
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}