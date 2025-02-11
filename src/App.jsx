import React, { useState } from 'react';
import ArticleUpload from './components/ArticleUpload';
import ArticleList from './components/ArticleList';
import ArticleReader from './components/ArticleReader';
import VocabularyList from './components/VocabularyList';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

export default function App() {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');

  const handleArticleSelect = (id) => {
    setSelectedArticleId(id);
    setActiveTab('reader');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">English Learning Tool</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="reader">Reader</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <ArticleList onSelectArticle={handleArticleSelect} />
        </TabsContent>

        <TabsContent value="upload">
          <ArticleUpload onSuccess={() => setActiveTab('articles')} />
        </TabsContent>

        <TabsContent value="reader">
          {selectedArticleId ? (
            <>
              <Button
                variant="outline"
                onClick={() => setActiveTab('articles')}
                className="mb-4"
              >
                ← Back to Articles
              </Button>
              <ArticleReader articleId={selectedArticleId} />
            </>
          ) : (
            <div className="text-center py-8">
              <p>Please select an article to read</p>
              <Button
                onClick={() => setActiveTab('articles')}
                className="mt-4"
              >
                Browse Articles
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="vocabulary">
          <VocabularyList />
        </TabsContent>
      </Tabs>
    </div>
  );
}