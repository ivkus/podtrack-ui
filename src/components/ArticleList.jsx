import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileAudio, 
  FileText, 
  Wand2,
  Headphones,
  RefreshCcw,
  Upload,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { articlesApi } from '../services/api';
import { formatDate } from '../lib/utils';
import ArticleUpload from './ArticleUpload';

export default function ArticleList({ onSelectArticle }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articlesApi.getAll();
      setArticles(response.data.results);
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('无法加载文章列表');
    } finally {
      setLoading(false);
    }
  };

  const startTranscribe = async (articleId) => {
    try {
      await articlesApi.transcribe(articleId);
      // 使用 toast 提示
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
      loadArticles();
    } catch (error) {
      // 使用 toast 提示错误
      const toastElement = document.getElementById('toast-error');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
    }
  };

  const startAnalysis = async (articleId) => {
    try {
      await articlesApi.analyze(articleId);
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
      loadArticles();
    } catch (error) {
      const toastElement = document.getElementById('toast-error');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
    }
  };

  const startAudioProcess = async (articleId) => {
    try {
      await articlesApi.processAudio(articleId);
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
      loadArticles();
    } catch (error) {
      const toastElement = document.getElementById('toast-error');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'processing':
        return 'text-info';
      case 'failed':
        return 'text-error';
      default:
        return 'text-base-content/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'processing':
        return '⟳';
      case 'failed':
        return '✗';
      default:
        return '•';
    }
  };

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Articles</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Article
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <ArticleUpload 
              onSuccess={() => {
                setShowUploadModal(false);
                loadArticles();
              }}
              onCancel={() => setShowUploadModal(false)}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowUploadModal(false)}>close</button>
          </form>
        </dialog>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <button 
                  onClick={() => onSelectArticle(article.id)}
                  className="hover:text-primary"
                >
                  {article.title}
                </button>
              </h3>
              <div className="text-sm text-base-content/70">
                {formatDate(article.created_at)}
              </div>

              {/* 状态指示器 */}
              <div className="flex gap-2 text-sm">
                <span className={getStatusColor(article.transcription_status)}>
                  <FileText className="inline-block w-4 h-4 mr-1" />
                  {getStatusIcon(article.transcription_status)}
                </span>
                <span className={getStatusColor(article.analysis_status)}>
                  <Wand2 className="inline-block w-4 h-4 mr-1" />
                  {getStatusIcon(article.analysis_status)}
                </span>
                <span className={getStatusColor(article.audio_processing_status)}>
                  <Headphones className="inline-block w-4 h-4 mr-1" />
                  {getStatusIcon(article.audio_processing_status)}
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="card-actions justify-end mt-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => startTranscribe(article.id)}
                  disabled={
                    article.transcription_status === 'processing' ||
                    article.transcription_status === 'completed'
                  }
                >
                  <FileText className="w-4 h-4 mr-1" />
                  转写
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => startAnalysis(article.id)}
                  disabled={
                    article.transcription_status !== 'completed' ||
                    article.analysis_status === 'processing' ||
                    article.analysis_status === 'completed'
                  }
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  分析
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => startAudioProcess(article.id)}
                  disabled={
                    article.analysis_status !== 'completed' ||
                    article.audio_processing_status === 'processing' ||
                    article.audio_processing_status === 'completed'
                  }
                >
                  <Headphones className="w-4 h-4 mr-1" />
                  处理
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast 提示 */}
      <div id="toast-success" className="toast toast-top toast-end hidden">
        <div className="alert alert-success">
          <span>操作成功</span>
        </div>
      </div>
      <div id="toast-error" className="toast toast-top toast-end hidden">
        <div className="alert alert-error">
          <span>操作失败</span>
        </div>
      </div>
    </div>
  );
}