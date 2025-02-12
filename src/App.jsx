import React, { useState } from 'react';
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
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-base-content">
          English Learning Tool
        </h1>
        
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed bg-base-100 shadow-lg rounded-lg">
            {[
              { id: 'articles', label: 'Articles', icon: '📚' },
              { id: 'reader', label: 'Reader', icon: '📖' },
              { id: 'vocabulary', label: 'Vocabulary', icon: '📝' }
            ].map(tab => (
              <a
                key={tab.id}
                className={`tab tab-lg px-6 py-3
                  ${activeTab === tab.id 
                    ? 'tab-active bg-primary text-primary-content' 
                    : 'text-base-content hover:bg-base-300'
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </a>
            ))}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {activeTab === 'articles' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <ArticleList onSelectArticle={handleArticleSelect} />
              </div>
            )}

            {activeTab === 'reader' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {selectedArticleId ? (
                  <>
                    {/* <button 
                      className="btn btn-outline mb-4"
                      onClick={() => setActiveTab('articles')}
                    >
                      ← Back to Articles
                    </button> */}
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
            )}

            {activeTab === 'vocabulary' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <VocabularyList />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}