import React, { useState, useEffect, useRef } from 'react';
import { articlesApi } from '../services/api';
import { AlertCircle, FileQuestion, Play, Pause, FileText, Wand2, Headphones, RefreshCcw } from 'lucide-react';
import { formatTime } from '../lib/utils';

export default function ArticleReader({ articleId }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(null);
  const audioRef = useRef(null);

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

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const startTranscribe = async () => {
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
      fetchArticle();
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

  const startAnalysis = async () => {
    try {
      await articlesApi.analyze(articleId);
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
      fetchArticle();
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

  const startAudioProcess = async () => {
    try {
      await articlesApi.processAudio(articleId);
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
          toastElement.classList.add('hidden');
        }, 3000);
      }
      fetchArticle();
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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      
      // 更新当前句子
      const sentence = article?.sentences?.find(
        s => time >= s.start_time && time <= s.end_time
      );
      setCurrentSentence(sentence);
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
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
        
        {/* 状态和操作栏 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-2">
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

          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={startTranscribe}
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
              onClick={startAnalysis}
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
              onClick={startAudioProcess}
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

        {/* 音频播放器 */}
        {article.audio_file && (
          <div className="flex items-center gap-2 mb-4">
            <button
              className="btn btn-circle btn-sm btn-outline"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <span className="text-sm">
              {formatTime(currentTime)}
            </span>
            <audio
              ref={audioRef}
              src={article.processed_audio_file || article.audio_file}
              onTimeUpdate={onTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>

      {/* 文章内容 */}
      <div className="space-y-4">
        {article.sentences?.map((sentence) => (
          <div
            key={sentence.id}
            className={`card bg-base-100 shadow-sm p-4 ${
              currentSentence?.id === sentence.id
                ? 'bg-base-200'
                : ''
            }`}
          >
            <p>{sentence.content}</p>
            {sentence.words?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {sentence.words.map((word) => (
                  <span
                    key={word.id}
                    className="badge badge-primary"
                  >
                    {word.lemma}
                  </span>
                ))}
              </div>
            )}
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