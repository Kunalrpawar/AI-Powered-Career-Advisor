import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ExternalLink, 
  Search, 
  Filter, 
  Star,
  Calendar,
  User,
  Download,
  Bookmark,
  Share2
} from 'lucide-react';

// Types
interface VideoResource {
  id: string;
  title: string;
  channel: string;
  description: string;
  duration: string;
  views: string;
  likes: string;
  publishedAt: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
}

interface ArticleResource {
  id: string;
  title: string;
  description: string;
  author: string;
  readTime: string;
  publishedAt: string;
  url: string;
  category: string;
  tags: string[];
  featured: boolean;
}

// Mock data for career resources
const mockVideos: VideoResource[] = [
  {
    id: '1',
    title: 'Complete Career Guidance for Engineering Students in India',
    channel: 'Career Counseling India',
    description: 'Comprehensive guide covering all engineering branches, placement preparation, and career opportunities.',
    duration: '45:32',
    views: '1.2M',
    likes: '45K',
    publishedAt: '2024-01-15',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Engineering',
    tags: ['engineering', 'placement', 'career guidance'],
    featured: true
  },
  {
    id: '2',
    title: 'Government Job Preparation Strategy 2024',
    channel: 'StudyIQ IAS',
    description: 'Step-by-step preparation guide for government exams including SSC, Banking, and Railway jobs.',
    duration: '38:15',
    views: '856K',
    likes: '32K',
    publishedAt: '2024-02-01',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Government Jobs',
    tags: ['government jobs', 'ssc', 'banking', 'preparation'],
    featured: true
  },
  {
    id: '3',
    title: 'Medical Career Options After 12th - Complete Guide',
    channel: 'Medical Entrance Guide',
    description: 'Explore various medical career paths including MBBS, BDS, BAMS, and paramedical courses.',
    duration: '42:18',
    views: '674K',
    likes: '28K',
    publishedAt: '2024-01-20',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Medical',
    tags: ['medical', 'neet', 'mbbs', 'career options'],
    featured: false
  },
  {
    id: '4',
    title: 'Tech Industry Career Roadmap 2024',
    channel: 'TechCareer Hub',
    description: 'Complete roadmap for software development, data science, AI/ML, and tech entrepreneurship.',
    duration: '52:45',
    views: '943K',
    likes: '41K',
    publishedAt: '2024-02-10',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Technology',
    tags: ['programming', 'data science', 'ai ml', 'tech careers'],
    featured: true
  },
  {
    id: '5',
    title: 'Commerce Stream Career Options - CA, CS, CMA Guide',
    channel: 'Commerce Careers India',
    description: 'Detailed overview of commerce careers including Chartered Accountancy, Company Secretary, and more.',
    duration: '35:22',
    views: '512K',
    likes: '19K',
    publishedAt: '2024-01-28',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Commerce',
    tags: ['commerce', 'ca', 'cs', 'cma', 'finance'],
    featured: false
  },
  {
    id: '6',
    title: 'Arts Stream Career Opportunities Beyond Teaching',
    channel: 'Liberal Arts Careers',
    description: 'Exploring diverse career paths in arts including journalism, psychology, social work, and creative fields.',
    duration: '41:30',
    views: '387K',
    likes: '15K',
    publishedAt: '2024-02-05',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Arts & Humanities',
    tags: ['arts', 'humanities', 'journalism', 'psychology', 'creative careers'],
    featured: false
  },
  {
    id: '7',
    title: 'Startup vs Corporate Jobs: Making the Right Choice',
    channel: 'Career Decisions Hub',
    description: 'Comprehensive comparison between startup culture and corporate environment for fresh graduates.',
    duration: '29:45',
    views: '726K',
    likes: '34K',
    publishedAt: '2024-02-12',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Career Decision',
    tags: ['startup', 'corporate', 'career choice', 'work culture'],
    featured: true
  },
  {
    id: '8',
    title: 'Digital Marketing Career Guide 2024',
    channel: 'Digital Marketing Pro',
    description: 'Complete guide to building a career in digital marketing including SEO, social media, and analytics.',
    duration: '47:18',
    views: '623K',
    likes: '27K',
    publishedAt: '2024-01-25',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Digital Marketing',
    tags: ['digital marketing', 'seo', 'social media', 'analytics'],
    featured: false
  },
  {
    id: '9',
    title: 'Civil Services (IAS/IPS) Preparation Complete Strategy',
    channel: 'UPSC Pathshala',
    description: 'Detailed preparation strategy for UPSC Civil Services including optional subjects and interview tips.',
    duration: '56:30',
    views: '892K',
    likes: '43K',
    publishedAt: '2024-02-08',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Civil Services',
    tags: ['upsc', 'ias', 'ips', 'civil services', 'exam preparation'],
    featured: false
  },
  {
    id: '10',
    title: 'Finance Career Options: Banking, Investment, Insurance',
    channel: 'Finance Career Guide',
    description: 'Exploring various finance career paths including banking, investment banking, insurance, and fintech.',
    duration: '39:42',
    views: '445K',
    likes: '21K',
    publishedAt: '2024-01-30',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Finance',
    tags: ['finance', 'banking', 'investment', 'insurance', 'fintech'],
    featured: false
  },
  {
    id: '11',
    title: 'Design Career Guide: UI/UX, Graphic, Product Design',
    channel: 'Design Careers Academy',
    description: 'Complete guide to design careers including UI/UX, graphic design, product design, and portfolio building.',
    duration: '44:15',
    views: '567K',
    likes: '26K',
    publishedAt: '2024-02-03',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Design',
    tags: ['design', 'ui ux', 'graphic design', 'product design', 'portfolio'],
    featured: false
  },
  {
    id: '12',
    title: 'Agriculture & Food Technology Career Opportunities',
    channel: 'AgriCareer India',
    description: 'Exploring modern agriculture careers including agritech, food technology, and sustainable farming.',
    duration: '33:28',
    views: '289K',
    likes: '14K',
    publishedAt: '2024-01-22',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Agriculture',
    tags: ['agriculture', 'food technology', 'agritech', 'farming', 'sustainability'],
    featured: false
  }
];

const mockArticles: ArticleResource[] = [
  {
    id: '1',
    title: 'Top 10 Career Options for Commerce Students',
    description: 'Detailed analysis of lucrative career paths for commerce graduates including CA, CS, MBA, and more.',
    author: 'Dr. Priya Sharma',
    readTime: '8 min',
    publishedAt: '2024-02-15',
    url: 'https://example.com/article1',
    category: 'Commerce',
    tags: ['commerce', 'ca', 'cs', 'mba'],
    featured: true
  },
  {
    id: '2',
    title: 'Skills Every Student Should Learn in 2024',
    description: 'Essential skills for modern career success including digital literacy, communication, and critical thinking.',
    author: 'Rajesh Kumar',
    readTime: '6 min',
    publishedAt: '2024-02-12',
    url: 'https://example.com/article2',
    category: 'Skills Development',
    tags: ['skills', 'digital literacy', 'soft skills'],
    featured: false
  },
  {
    id: '3',
    title: 'Startup vs Corporate Job: Making the Right Choice',
    description: 'Comprehensive comparison to help students choose between startup culture and corporate stability.',
    author: 'Ananya Gupta',
    readTime: '10 min',
    publishedAt: '2024-02-08',
    url: 'https://example.com/article3',
    category: 'Career Decision',
    tags: ['startup', 'corporate', 'career choice'],
    featured: true
  }
];

const CareerResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'articles'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos] = useState<VideoResource[]>(mockVideos);
  const [articles] = useState<ArticleResource[]>(mockArticles);

  // Get unique categories
  const videoCategories = ['All', ...Array.from(new Set(videos.map(v => v.category)))];
  const articleCategories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];
  
  const categories = activeTab === 'videos' ? videoCategories : articleCategories;

  // Filter resources based on search and category
  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Reset category when switching tabs
  useEffect(() => {
    setSelectedCategory('All');
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Career Resources</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Curated videos and articles to guide your career journey
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Video Resources
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Articles & Guides
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos, articles, or topics..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'videos' ? (
          <div className="space-y-6">
            {/* Featured Videos */}
            {filteredVideos.some(v => v.featured) && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Videos
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {filteredVideos.filter(v => v.featured).map(video => (
                    <VideoCard key={video.id} video={video} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All Videos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                All Videos ({filteredVideos.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured Articles */}
            {filteredArticles.some(a => a.featured) && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {filteredArticles.filter(a => a.featured).map(article => (
                    <ArticleCard key={article.id} article={article} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                All Articles ({filteredArticles.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'videos' && filteredVideos.length === 0) || 
          (activeTab === 'articles' && filteredArticles.length === 0)) && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Video Card Component
const VideoCard: React.FC<{ video: VideoResource; featured?: boolean }> = ({ video, featured = false }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group ${
      featured ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
    }`}>
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white bg-opacity-90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-gray-800 ml-0.5" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        {featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Channel and Stats */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <User className="w-4 h-4" />
          <span>{video.channel}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {video.likes}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(video.publishedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {video.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.open(video.videoUrl, '_blank')}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Watch Video
          </button>
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Article Card Component
const ArticleCard: React.FC<{ article: ArticleResource; featured?: boolean }> = ({ article, featured = false }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group ${
      featured ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
    }`}>
      {featured && (
        <div className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded-full font-medium mb-3">
          <Star className="w-3 h-3" />
          Featured
        </div>
      )}

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {article.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {article.description}
      </p>

      {/* Author and Meta */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <User className="w-4 h-4" />
        <span>{article.author}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {article.readTime} read
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {article.tags.slice(0, 3).map(tag => (
          <span key={tag} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => window.open(article.url, '_blank')}
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Read Article
        </button>
        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default CareerResources;