import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Search, Scale, FileText, Clock, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { mockSections, type Section } from './lib/mockData';

// --- Components ---

function Header() {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between absolute top-0 z-10">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">
          S
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">Sectionify</span>
      </Link>
    </header>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Section[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockSections.filter(section =>
        section.number.toLowerCase().includes(query.toLowerCase()) ||
        section.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className={cn(
        "flex items-center w-full bg-white border rounded-2xl shadow-sm transition-all duration-300 ease-in-out",
        isFocused ? "shadow-lg border-primary/20 ring-4 ring-primary/5" : "border-border"
      )}>
        <Search className="w-6 h-6 ml-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search Section 10(13A), GST Section 9..."
          className="w-full p-4 bg-transparent outline-none text-lg placeholder:text-muted-foreground/60"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>

      <AnimatePresence>
        {results.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-20"
          >
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => navigate(`/section/${result.id}`)}
                className="p-4 hover:bg-muted/50 cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-semibold text-primary group-hover:text-primary/80 transition-colors">
                    {result.number}
                  </div>
                  <div className="text-sm text-muted-foreground truncate max-w-md">
                    {result.name}
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  result.type === 'Income Tax'
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                )}>
                  {result.type}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-50/50 rounded-full blur-3xl -z-10" />

      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center w-full px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 tracking-tight text-slate-900">
          Navigate Indian Laws <br />
          <span className="text-muted-foreground font-serif italic">Effortlessly.</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-lg">
          A premium, intelligent interface for the Income Tax Act and GST Laws.
        </p>

        <SearchBar />
      </motion.div>
    </div>
  );
}

// --- Section Detail Page Components ---

const DetailCard = ({ title, icon: Icon, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-start p-6 rounded-2xl transition-all duration-300 border text-left h-full min-h-[160px] min-w-[240px]",
      isActive
        ? "bg-primary text-primary-foreground shadow-lg scale-105 border-primary"
        : "bg-white text-muted-foreground hover:border-primary/50 hover:shadow-md border-border"
    )}
  >
    <div className={cn("p-2 rounded-lg mb-4", isActive ? "bg-white/10" : "bg-gray-100")}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-xs opacity-80 line-clamp-2">Click to view details</p>
  </button>
);

function SectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('synopsis');
  const section = mockSections.find(s => s.id === id);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Section not found</h2>
        <button onClick={() => navigate('/')} className="text-primary underline">Go Home</button>
      </div>
    );
  }

  const tabContent: any = {
    synopsis: section.synopsis,
    benchmarks: section.benchmarks,
    amendments: section.amendments.join('\n') || 'No recent amendments.',
    circulars: section.circulars.join('\n') || 'No related circulars found.',
    caseLaws: section.caseLaws.join('\n') || 'No major case laws found.',
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-12 max-w-5xl">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-4">
             {section.type === 'Income Tax' ? <Scale className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
             {section.type}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{section.number}</h1>
          <h2 className="text-2xl text-slate-600 mb-2 font-medium">{section.name}</h2>
          <p className="text-muted-foreground font-serif italic">{section.family}</p>
        </motion.div>

        {/* Carousel / Navigation */}
        <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x px-4 -mx-4">
          <DetailCard
            title="AI Synopsis"
            icon={BookOpen}
            isActive={activeTab === 'synopsis'}
            onClick={() => setActiveTab('synopsis')}
          />
          <DetailCard
            title="Benchmarks"
            icon={AlertCircle}
            isActive={activeTab === 'benchmarks'}
            onClick={() => setActiveTab('benchmarks')}
          />
          <DetailCard
            title="Amendments"
            icon={Clock}
            isActive={activeTab === 'amendments'}
            onClick={() => setActiveTab('amendments')}
          />
          <DetailCard
            title="Circulars"
            icon={FileText}
            isActive={activeTab === 'circulars'}
            onClick={() => setActiveTab('circulars')}
          />
          <DetailCard
            title="Case Laws"
            icon={Scale}
            isActive={activeTab === 'caseLaws'}
            onClick={() => setActiveTab('caseLaws')}
          />
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 min-h-[300px]"
        >
          <h3 className="text-xl font-bold mb-6 capitalize text-slate-800">{activeTab}</h3>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
            {tabContent[activeTab]}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/section/:id" element={<SectionDetailPage />} />
    </Routes>
  );
}

export default App;
