// src/components/VocabularyList.jsx
import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { vocabularyApi } from '../services/api';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

export default function VocabularyList() {
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    {
      accessorKey: 'word.lemma',
      header: 'Word',
      cell: info => (
        <div className="font-medium text-primary">
          {info.getValue()}
        </div>
      ),
    },
    {
      accessorKey: 'word.article_count',
      header: 'Articles',
      cell: info => (
        <div className="text-muted-foreground">
          {info.getValue()}
        </div>
      ),
    },
    {
      accessorFn: row => row.mastered ? 'Mastered' : 'Learning',
      header: 'Status',
      cell: info => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === 'Mastered' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {info.getValue() === 'Mastered' ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-current mr-1" />
          )}
          {info.getValue()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            className={`btn btn-sm w-40 ${
              row.original.mastered 
                ? 'btn-primary' 
                : 'btn-outline btn-primary'
            }`}
            onClick={() => handleToggleMastered(row.original.id)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {row.original.mastered ? 'Mastered' : 'Mark as Mastered'}
          </button>
          <button
            className={`btn btn-sm w-40 ${
              row.original.ignored 
                ? 'btn-error' 
                : 'btn-outline btn-error'
            }`}
            onClick={() => handleToggleIgnored(row.original.id)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            {row.original.ignored ? 'Ignored' : 'Ignore'}
          </button>
        </div>
      ),
    },
  ];

  const handleToggleMastered = async (id) => {
    try {
      await vocabularyApi.toggleMastered(id);
      const updatedVocabulary = vocabulary.map(item => 
        item.id === id ? { ...item, mastered: !item.mastered } : item
      );
      setVocabulary(updatedVocabulary);
    } catch (error) {
      console.error('Error toggling mastered status:', error);
    }
  };

  const handleToggleIgnored = async (id) => {
    try {
      await vocabularyApi.toggleIgnored(id);
      const updatedVocabulary = vocabulary.map(item => 
        item.id === id ? { ...item, ignored: !item.ignored } : item
      );
      setVocabulary(updatedVocabulary);
    } catch (error) {
      console.error('Error toggling ignored status:', error);
    }
  };

  const fetchVocabulary = async ({ pageIndex }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ 
        page: pageIndex + 1,
        ...(table.getHeaderGroups()[0].headers[2].column.getFilterValue() === 'Mastered' && { mastered: true }),
        ...(table.getHeaderGroups()[0].headers[2].column.getFilterValue() === 'Learning' && { mastered: false })
      });
      const response = await vocabularyApi.getAll(params);
      const { results, count } = response.data;
      setVocabulary(results || []);
      setPageCount(Math.ceil(count / 10));
    } catch (error) {
      setError('Failed to load vocabulary');
      console.error('Error fetching vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    data: vocabulary,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
    debugTable: true,
  });

  useEffect(() => {
    fetchVocabulary({ 
      pageIndex: pagination.pageIndex 
    });
  }, [pagination.pageIndex, table.getState().columnFilters[2]?.value]);

  if (loading && vocabulary.length === 0) {
    return (
      <div className="text-center py-8">
        Loading vocabulary...
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="input input-bordered w-full pl-9"
            placeholder="Search words..."
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="text-left">
                    {flexRender(
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
              <tr key={row.id}>
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

      <div className="flex items-center justify-between">
        <span className="text-sm opacity-70">
          Page {pagination.pageIndex + 1} of {pageCount}
        </span>
        <div className="join">
          <button
            className="btn btn-outline join-item"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <button
            className="btn btn-outline join-item"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}