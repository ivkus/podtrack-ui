import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import ArticleUpload from './components/ArticleUpload';
import ArticleList from './components/ArticleList';
import ArticleReader from './components/ArticleReader';
import VocabularyList from './components/VocabularyList';

export default function App() {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');

  const handleArticleSelect = (id) => {
    setSelectedArticleId(id);
    setActiveTab('reader');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          English Learning Tool
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center mb-8">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="reader">Reader</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <ArticleList onSelectArticle={handleArticleSelect} />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <ArticleUpload onSuccess={() => setActiveTab('articles')} />
            </div>
          </TabsContent>

          <TabsContent value="reader" className="mt-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {selectedArticleId ? (
                <>
                  <button 
                    className="btn btn-outline mb-4"
                    onClick={() => setActiveTab('articles')}
                  >
                    ← Back to Articles
                  </button>
                  <ArticleReader articleId={selectedArticleId} />
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Please select an article to read</p>
                  <button
                    className="btn btn-primary mt-4"
                    onClick={() => setActiveTab('articles')}
                  >
                    Browse Articles
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <VocabularyList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}