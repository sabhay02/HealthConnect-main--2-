import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { BookOpen, Award, Volume2, Eye, RotateCcw } from 'lucide-react';
import QuizComponent from './QuizComponent';
import MythFactCards from './MythFactCards';

const LearnPage = () => {
  // const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('articles');
  const [speakingText, setSpeakingText] = useState(null);

  const articles = [
    {
      id: '1',
      title: 'Understanding Puberty: A Complete Guide',
      excerpt: 'Learn about the physical and emotional changes during puberty...',
      content: `Puberty is a natural process that every person goes through as they transition from childhood to adulthood. During this time, your body undergoes significant physical and emotional changes due to hormonal fluctuations.

Physical changes include growth spurts, development of secondary sexual characteristics, and changes in body composition. It's important to understand that everyone develops at their own pace, and there's a wide range of what's considered normal.

Emotional changes are also common during puberty. You might experience mood swings, increased interest in relationships, and questions about your identity. These feelings are completely normal and part of growing up.`,
      category: 'Adolescent Health',
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'Safe Sex Practices and STI Prevention',
      excerpt: 'Essential information about protecting yourself and your partner...',
      content: `Practicing safe sex is crucial for maintaining sexual health and preventing sexually transmitted infections (STIs). The most effective way to prevent STIs is through the correct and consistent use of barrier methods like condoms.

Condoms not only prevent most STIs but also prevent unintended pregnancy. It's important to use a new condom every time you have sex and to put it on before any genital contact occurs.

Regular testing is also an important part of sexual health. Many STIs can be asymptomatic, meaning you might not know you have one without testing. Getting tested regularly and discussing your sexual health with healthcare providers helps ensure early detection and treatment if needed.`,
      category: 'Sexual Health',
      readTime: '7 min read'
    },
    {
      id: '3',
      title: 'Understanding Consent and Healthy Relationships',
      excerpt: 'Building respectful and consensual relationships...',
      content: `Consent is the foundation of all healthy sexual relationships. It means that all parties involved freely agree to engage in sexual activity without coercion, manipulation, or pressure.

Consent must be:
- Freely given: Without pressure or coercion
- Informed: Understanding what you're agreeing to
- Enthusiastic: Genuinely wanting to participate
- Ongoing: Can be withdrawn at any time
- Specific: Agreeing to one thing doesn't mean agreeing to everything

Communication is key in any relationship. Partners should feel comfortable discussing their boundaries, desires, and concerns openly and honestly. Remember that consent can be withdrawn at any time, and respecting that decision is crucial.`,
      category: 'Relationships',
      readTime: '6 min read'
    }
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      if (speakingText === text) {
        setSpeakingText(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.onstart = () => setSpeakingText(text);
      utterance.onend = () => setSpeakingText(null);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Center</h1>
        <p className="mt-2 text-gray-600">
          Access comprehensive sexual health education resources
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'articles'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Articles
          </button>
          <button
            onClick={() => setActiveTab('myths')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'myths'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Myths vs Facts
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'quiz'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award className="h-4 w-4 mr-2" />
            Quizzes
          </button>
        </nav>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-gray-700">{article.content}</div>
                  </div>
                  
                  <div className="mt-6 flex items-center space-x-4">
                    <button
                      onClick={() => speakText(article.content)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        speakingText === article.content
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {speakingText === article.content ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Stop Reading
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 mr-2" />
                          Read Aloud
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Award className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-800 font-medium">Take a Quiz</span>
                </button>
                <button
                  onClick={() => setActiveTab('myths')}
                  className="w-full flex items-center px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Eye className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-purple-800 font-medium">Myth or Fact?</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Articles Read</span>
                    <span>12/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Quizzes Completed</span>
                    <span>8/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'myths' && <MythFactCards />}
      {activeTab === 'quiz' && <QuizComponent />}
    </div>
  );
};

export default LearnPage;
