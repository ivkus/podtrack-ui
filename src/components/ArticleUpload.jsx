import React, { useState } from 'react';
import { articlesApi } from '../services/api';
import { Upload, AlertCircle, X } from 'lucide-react';

export default function ArticleUpload({ onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Use filename (without extension) as default title
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        // Limit content to first 200 words
        const fullContent = e.target.result;
        const words = fullContent.split(/\s+/);
        const truncatedContent = words.slice(0, 200).join(' ');
        setContent(truncatedContent + (words.length > 200 ? '...' : ''));
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await articlesApi.create({ title, content });
      await articlesApi.analyze(response.data.id);
      setTitle('');
      setContent('');
      setFile(null);
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
        <button 
          className="btn btn-ghost btn-sm"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Select File</span>
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".txt"
              className="file-input file-input-bordered w-full hover:file-input-primary transition-colors duration-200"
            />
          </div>
        </div>

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
            <span className="label-text font-medium">Content Preview (First 200 words)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="File content will appear here..."
            className="textarea textarea-bordered h-[200px] resize-none focus:textarea-primary transition-colors duration-200"
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
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
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