import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from './ui/button';
import { articlesApi } from '../services/api';
import { formatDate } from '../lib/utils';

export default function ArticleList({ onSelectArticle }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: info => <div className="font-medium">{info.getValue()}</div>,
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: info => formatDate(info.getValue()),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectArticle(row.original.id)}
          >
            Read
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const fetchArticles = async ({ pageIndex }) => {
    try {
      setLoading(true);
      const response = await articlesApi.getAll(pageIndex + 1);
      setArticles(response.data.results);
      setPageCount(Math.ceil(response.data.count / pagination.pageSize));
    } catch (error) {
      setError('Failed to load articles');
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articlesApi.delete(id);
      // 重新获取当前页数据
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

  useEffect(() => {
    fetchArticles({ pageIndex: pagination.pageIndex });
  }, [pagination.pageIndex]);

  if (loading && articles.length === 0) {
    return (
      <div className="text-center py-8">
        Loading articles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  console.log('articles', articles);
  console.log('pagination', pagination);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <span className="text-sm text-gray-700">
          Page {pagination.pageIndex + 1} of {pageCount}
        </span>
      </div>
    </div>
  );
}