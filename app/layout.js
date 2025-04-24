import './globals.css';
import { FaStar, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export const metadata = {
  title: 'Google Places Review Widget',
  description: 'Create beautiful, customizable Google review widgets for your website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-['Inter',sans-serif]">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="mr-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
                    <FaStar className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Google Reviews Widget
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showcase authentic reviews on your website
                    </p>
                  </div>
                </div>
                <nav className="flex items-center space-x-6">
                  <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors hover:scale-105 transform duration-200">
                    Home
                  </Link>
                  <Link href="/widget-example.html" target="_blank" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors hover:scale-105 transform duration-200">
                    Examples
                  </Link>
                  <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors hover:scale-105 transform duration-200 flex items-center gap-1">
                    <FaGithub className="inline-block" />
                    Documentation
                  </Link>
                  <Link href="/widget" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    Create Widget
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    © {new Date().getFullYear()} Google Reviews Widget. All rights reserved.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    Not affiliated with Google LLC. Google and the Google logo are registered trademarks of Google LLC.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}