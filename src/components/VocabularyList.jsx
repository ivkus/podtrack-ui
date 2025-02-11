import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { vocabularyApi } from '../services/api';

export default function VocabularyList() {
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, mastered, learning
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const response = await vocabularyApi.getAll();
        setVocabulary(response.data);
      } catch (error) {
        setError('Failed to load vocabulary');
        console.error('Error fetching vocabulary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const handleToggleMastered = async (id) => {
    try {
      await vocabularyApi.toggleMastered(id);
      setVocabulary(vocabulary.map(item => 
        item.id === id 
          ? { ...item, mastered: !item.mastered }
          : item
      ));
    } catch (error) {
      console.error('Error toggling mastered status:', error);
    }
  };

  const handleToggleIgnored = async (id) => {
    try {
      await vocabularyApi.toggleIgnored(id);
      setVocabulary(vocabulary.map(item => 
        item.id === id 
          ? { ...item, ignored: !item.ignored }
          : item
      ));
    } catch (error) {
      console.error('Error toggling ignored status:', error);
    }
  };

  const filteredVocabulary = vocabulary
    .filter(item => {
      if (filter === 'mastered') return item.mastered;
      if (filter === 'learning') return !item.mastered;
      return true;
    })
    .filter(item => 
      item.word.lemma.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="text-center py-8">Loading vocabulary...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'mastered' ? 'default' : 'outline'}
            onClick={() => setFilter('mastered')}
          >
            Mastered
          </Button>
          <Button
            variant={filter === 'learning' ? 'default' : 'outline'}
            onClick={() => setFilter('learning')}
          >
            Learning
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredVocabulary.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{item.word.lemma}</h3>
                <p className="text-sm text-gray-500">
                  Found in {item.word.articles.length} article(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={item.mastered ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleMastered(item.id)}
                >
                  {item.mastered ? 'Mastered' : 'Mark as Mastered'}
                </Button>
                <Button
                  variant={item.ignored ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleIgnored(item.id)}
                >
                  {item.ignored ? 'Ignored' : 'Ignore'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}