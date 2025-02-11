// src/components/VocabularyList.jsx
import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { vocabularyApi } from '../services/api';

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
      cell: info => <div className="font-medium">{info.getValue()}</div>,
    },
    {
      accessorKey: 'word.article_count',
      header: 'Articles',
      cell: info => info.getValue(),
    },
    {
      accessorFn: row => row.mastered ? 'Mastered' : 'Learning',
      header: 'Status',
      cell: info => (
        <div className={`text-sm ${info.getValue() === 'Mastered' ? 'text-green-600' : 'text-blue-600'}`}>
          {info.getValue()}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant={row.original.mastered ? "default" : "outline"}
            size="sm"
            onClick={() => handleToggleMastered(row.original.id)}
          >
            {row.original.mastered ? 'Mastered' : 'Mark as Mastered'}
          </Button>
          <Button
            variant={row.original.ignored ? "destructive" : "outline"}
            size="sm"
            onClick={() => handleToggleIgnored(row.original.id)}
          >
            {row.original.ignored ? 'Ignored' : 'Ignore'}
          </Button>
        </div>
      ),
    },
  ];

  const fetchVocabulary = async ({ pageIndex }) => {
    try {
      setLoading(true);
      const response = await vocabularyApi.getAll(pageIndex + 1);
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
    debugTable: true,
  });

  useEffect(() => {
    fetchVocabulary({ pageIndex: pagination.pageIndex });
  }, [pagination.pageIndex]);

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search words..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant={table.getHeaderGroups()[0].headers[2].column.getFilterValue() === 'Mastered' ? 'default' : 'outline'}
            onClick={() => table.getHeaderGroups()[0].headers[2].column.setFilterValue('Mastered')}
          >
            Mastered
          </Button>
          <Button
            variant={table.getHeaderGroups()[0].headers[2].column.getFilterValue() === 'Learning' ? 'default' : 'outline'}
            onClick={() => table.getHeaderGroups()[0].headers[2].column.setFilterValue('Learning')}
          >
            Learning
          </Button>
        </div>
      </div>

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