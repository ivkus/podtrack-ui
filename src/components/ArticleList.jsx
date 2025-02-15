import React, { useState, useEffect, useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { articlesApi } from '../services/api';
import { formatDate } from '../lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Trash2, 
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import ArticleUpload from './ArticleUpload';

// 定义轮询间隔（毫秒）
const POLL_INTERVAL = 5000;

// 处理状态显示组件
const ProcessingStatus = ({ status }) => {
  const statusConfig = {
    pending: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      text: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    processing: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      text: "Processing",
      className: "bg-blue-100 text-blue-800",
    },
    completed: {
      icon: <CheckCircle className="h-4 w-4" />,
      text: "Completed",
      className: "bg-green-100 text-green-800",
    },
    failed: {
      icon: <AlertCircle className="h-4 w-4" />,
      text: "Failed",
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.icon}
      <span className="ml-1.5">{config.text}</span>
    </div>
  );
};

export default function ArticleList({ onSelectArticle }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: info => (
        <div className="font-medium hover:text-primary cursor-pointer"
             onClick={() => onSelectArticle(info.row.original.id)}>
          {info.getValue()}
        </div>
      ),
    },
    {
      accessorKey: 'processing_status',
      header: 'Status',
      cell: info => <ProcessingStatus status={info.getValue()} />,
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: info => (
        <div className="text-muted-foreground">
          {formatDate(info.getValue())}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isProcessing = ['pending', 'processing'].includes(row.original.processing_status);
        
        return (
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-ghost btn-sm hover:text-primary"
              onClick={() => onSelectArticle(row.original.id)}
              disabled={isProcessing}
            >
              <BookOpen className="h-4 w-4" />
              <span className="ml-2">Read</span>
            </button>
            <button
              className="btn btn-ghost btn-sm hover:text-destructive"
              onClick={() => handleDelete(row.original.id)}
              disabled={isProcessing}
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-2">Delete</span>
            </button>
          </div>
        );
      },
    },
  ];

  const fetchArticles = useCallback(async ({ pageIndex }) => {
    try {
      setLoading(true);
      const response = await articlesApi.getAll(pageIndex + 1);
      setArticles(response.data.results);
      setPageCount(Math.ceil(response.data.count / pagination.pageSize));
      
      // 返回是否需要继续轮询
      return response.data.results.some(article => 
        ['pending', 'processing'].includes(article.processing_status)
      );
    } catch (error) {
      setError('Failed to load articles');
      console.error('Error fetching articles:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    let pollInterval;
    
    const startPolling = async () => {
      const shouldContinuePolling = await fetchArticles({ pageIndex: pagination.pageIndex });
      
      if (shouldContinuePolling) {
        pollInterval = setInterval(async () => {
          const shouldContinue = await fetchArticles({ pageIndex: pagination.pageIndex });
          if (!shouldContinue && pollInterval) {
            clearInterval(pollInterval);
          }
        }, POLL_INTERVAL);
      }
    };

    startPolling();

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pagination.pageIndex, fetchArticles]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articlesApi.delete(id);
      fetchArticles({ pageIndex: pagination.pageIndex });
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const table = useReactTable({
    data: articles,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 text-destructive p-4 my-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  console.log('articles', articles);
  console.log('pagination', pagination);

  return (
    <div className="space-y-4">
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
                fetchArticles({ pageIndex: pagination.pageIndex });
              }}
              onCancel={() => setShowUploadModal(false)}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowUploadModal(false)}>close</button>
          </form>
        </dialog>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className={
                ['pending', 'processing'].includes(row.original.processing_status)
                  ? 'opacity-70'
                  : ''
              }>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-base-content/70">
          Page {pagination.pageIndex + 1} of {pageCount}
        </div>
        <div className="join">
          <button
            className="btn btn-outline join-item"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="btn btn-outline join-item"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}