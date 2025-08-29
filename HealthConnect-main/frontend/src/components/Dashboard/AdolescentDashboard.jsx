import React from 'react';
// import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, Award, Volume2 } from 'lucide-react';

const AdolescentDashboard = () => {
  // const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
        <p className="mt-2 text-gray-600">
          Learn about sexual health in a safe, age-appropriate environment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/learn"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Content</h3>
          <p className="text-gray-600">Access age-appropriate articles and resources</p>
        </Link>

        <Link
          to="/chat"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <MessageCircle className="h-8 w-8 text-teal-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Questions</h3>
          <p className="text-gray-600">Get answers to your questions privately</p>
        </Link>

        <Link
          to="/learn?type=quiz"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <Award className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Quizzes</h3>
          <p className="text-gray-600">Test your knowledge with fun quizzes</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Learning</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Understanding Puberty</h4>
              <p className="text-sm text-gray-600">Completed 2 days ago</p>
            </div>
            <button className="p-2 text-gray-600 hover:text-blue-600 rounded-md">
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Award className="h-6 w-6 text-green-600" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Body Changes Quiz</h4>
              <p className="text-sm text-gray-600">Score: 8/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdolescentDashboard;