import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Search, Scale, FileText, Clock, BookOpen, ChevronRight, Info, ShieldAlert, Gavel, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { collection, query as firestoreQuery, where, getDocs, limit, orderBy, startAt, endAt, doc, getDoc, type DocumentData } from "firebase/firestore";
// @ts-ignore
import { db } from "./firebase"; 

// --- Shared Components ---

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-24 px-6 md:px-12 flex items-center justify-center bg-white/90 backdrop-blur-xl border-b border-gray-100 transition-all">
      <Link to="/" className="flex items-center gap-4 group">
        <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Scale className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
           <span className="text-2xl font-serif font-bold text-slate-900 leading-none">Sectionify</span>
           <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Legal Intelligence</span>
        </div>
      </Link>
    </header>
  );
}

// --- Home Page ---

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  badge?: string; 
}

interface Section {
  id: string;
  number: string;
  name: string;
  type: "Income Tax" | "GST";
  family: string;
  synopsis: string;
  benchmarks: string; 
  amendments: TimelineEvent[];
  circulars: TimelineEvent[];
  caseLaws: TimelineEvent[];
}

// Interface for Firestore document results
interface FirestoreSectionResult {
    id: string;
    lawType: "INCOME_TAX" | "GST";
    sectionNumber: string;
    sectionTitle: string;
    searchTerms: string[];
    sectionNumberSearch?: string[]; 
    status: string;
    family?: string;
    synopsis?: string;
    benchmarks?: string;
    amendments?: TimelineEvent[];
    circulars?: TimelineEvent[];
    caseLaws?: TimelineEvent[];
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FirestoreSectionResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  // const navigate = useNavigate(); // Navigation disabled per requirements

  useEffect(() => {
    const fetchResults = async () => {
      // Input handling: Do not run search if input length is 0.
      if (query.length > 0) {
        // Input handling: Convert user input to lowercase.
        const lowercaseQuery = query.toLowerCase();
        const sectionIndexRef = collection(db, "section_index");

        try {
          // Query 1 (Section Number Prefix Search)
          // Query where sectionNumberSearch array-contains userInput
          // Limit 5
          const queryA = firestoreQuery(
              sectionIndexRef,
              where("sectionNumberSearch", "array-contains", lowercaseQuery),
              limit(5)
          );

          // Query 2 (Keyword Search)
          // Query where searchTerms array-contains userInput
          // Limit 5
          const queryB = firestoreQuery(
              sectionIndexRef,
              where("searchTerms", "array-contains", lowercaseQuery),
              limit(5)
          );

          // Query 3 (Title Prefix Search)
          // Query where sectionTitle >= userInput
          // Query where sectionTitle <= userInput + '\uf8ff'
          // Limit 5
          const queryC = firestoreQuery(
            sectionIndexRef,
            orderBy("sectionTitle"),
            startAt(lowercaseQuery),
            endAt(lowercaseQuery + '\uf8ff'),
            limit(5)
          );

          // Run in parallel
          const [snapshotA, snapshotB, snapshotC] = await Promise.all([
            getDocs(queryA),
            getDocs(queryB),
            getDocs(queryC)
          ]);
          
          const combinedResults: FirestoreSectionResult[] = [];
          const addedIds = new Set<string>();

          // Helper to process snapshots
          const processSnapshot = (snapshot: any) => {
              snapshot.forEach((doc: DocumentData) => {
                  if (!addedIds.has(doc.id)) {
                      const data = doc.data() as FirestoreSectionResult;
                      combinedResults.push({ ...data, id: doc.id });
                      addedIds.add(doc.id);
                  }
              });
          };

          // Merge results from all three queries.
          processSnapshot(snapshotA);
          processSnapshot(snapshotB);
          processSnapshot(snapshotC);

          // Limit final results to 10.
          setResults(combinedResults.slice(0, 10)); 

        } catch (error) {
          console.error("Firestore search error:", error);
          setResults([]); // Clear results on error
        }

      } else {
        setResults([]);
      }
    };

    // Add debounce of 400ms before querying Firestore.
    const handler = setTimeout(() => {
        fetchResults();
    }, 400); 

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-10">
      <div 
        className={cn(
            "relative flex items-center w-full bg-white rounded-full shadow-2xl transition-all duration-300 border h-16 px-6",
            isFocused ? "border-slate-400 ring-4 ring-slate-100 scale-[1.02]" : "border-slate-200"
        )}
      >
        <Search className="w-6 h-6 mr-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search Section 10(13A), HRA, Levy..."
          className="w-full h-full bg-transparent outline-none text-xl text-slate-900 placeholder:text-slate-300 font-sans"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="ml-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
             <span className="sr-only">Clear</span>
             ✕
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Results</span>
            </div>
            {results.map((result) => (
              <div
                key={result.id}
                // onClick={() => navigate(`/section/${result.id}`)} // Disabled as per requirements
                className="p-6 cursor-default border-b border-slate-50 hover:bg-slate-50 flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {result.sectionNumber}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{result.sectionTitle}</div>
                </div>
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border",
                    result.lawType === 'INCOME_TAX'
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-blue-50 text-blue-700 border-blue-100"
                  )}>
                    {result.lawType === 'INCOME_TAX' ? 'Income Tax' : 'GST'}
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col relative overflow-hidden font-sans">
      <Header />
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-50/60 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-32 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight mt-12">
            Simplify Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Legal Search.</span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            An intelligent, minimalist interface for navigating the complexities of Indian Income Tax and GST Laws.
          </p>

          <SearchBar />
        </motion.div>
      </main>
    </div>
  );
}

// --- Detail Page Components ---

function InfoCard({ label, value, delay }: { label: string, value: string, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.5 }}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-slate-300"></div>
                {label}
            </div>
            <p className="text-2xl font-medium text-slate-900 leading-snug font-serif">
                {value}
            </p>
        </motion.div>
    );
}

function TimelineView({ events }: { events: TimelineEvent[] }) {
    if (!events || events.length === 0) {
        return <div className="p-8 text-slate-400 italic bg-white rounded-2xl border border-slate-100">No records found for this section.</div>;
    }

    return (
        <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 py-4 bg-white p-8 rounded-2xl border border-slate-100">
            {events.map((event, index) => (
                <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-slate-200 shadow-sm" />
                    
                    <div className="flex flex-col gap-2 mb-2">
                         <div className="flex items-center gap-3">
                             <span className="text-sm font-bold text-slate-400 font-mono flex items-center gap-1">
                                 <Calendar className="w-3 h-3" />
                                 {event.date}
                             </span>
                             {event.badge && (
                                 <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                     {event.badge}
                                 </span>
                             )}
                         </div>
                         <h4 className="text-xl font-serif font-bold text-slate-900">{event.title}</h4>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed font-light text-lg">
                        {event.description}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}

function SectionDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('synopsis');
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectionData = async () => {
      setLoading(true);
      setError(null);
      if (!id) return;

      try {
        const docRef = doc(db, "section_index", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data() as FirestoreSectionResult;
          setSectionData({
              id: firestoreData.id,
              number: firestoreData.sectionNumber,
              name: firestoreData.sectionTitle,
              type: firestoreData.lawType === 'INCOME_TAX' ? 'Income Tax' : 'GST',
              family: firestoreData.family || "Law Family Info Loading...",
              synopsis: firestoreData.synopsis || "Detailed synopsis not yet available in database.",
              benchmarks: firestoreData.benchmarks || "",
              amendments: firestoreData.amendments || [],
              circulars: firestoreData.circulars || [],
              caseLaws: firestoreData.caseLaws || []
          });
        } else {
          setError("Section not found in database.");
        }
      } catch (err) {
        console.error("Error fetching section:", err);
        setError("Failed to load section data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#FDFCFC]">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
      );
  }

  if (error || !sectionData) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFC] gap-4">
              <ShieldAlert className="w-12 h-12 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900">{error || "Section Not Found"}</h2>
              <Link to="/" className="text-slate-500 hover:text-slate-900 underline">Return Home</Link>
          </div>
      );
  }

  const tabs = [
    { id: 'synopsis', label: 'Synopsis', icon: BookOpen },
    { id: 'limits', label: 'Key Limits', icon: ShieldAlert },
    { id: 'amendments', label: 'Amendments', icon: Clock },
    { id: 'circulars', label: 'Circulars', icon: FileText },
    { id: 'caseLaws', label: 'Case Laws', icon: Gavel },
  ];

  // Parse limits safely
  const limitItems = sectionData.benchmarks 
    ? sectionData.benchmarks.split(/(?:\. |; )/).filter(Boolean).map(s => {
        const parts = s.trim().replace(/^\d+\.\s*/, '').split(':');
        return {
            label: parts.length > 1 ? parts[0].trim() : 'Key Metric',
            value: parts.length > 1 ? parts.slice(1).join(':').trim() : s.trim().replace(/^\d+\.\s*/, '')
        };
      }) 
    : [];

  return (
    <div className="min-h-screen bg-[#FDFCFC] font-sans text-slate-900 selection:bg-slate-200">
      <Header />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        
        {/* 1. Header Section */}
        <div className="mb-12">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 font-medium mb-8">
                <span className="hover:text-slate-900 transition-colors cursor-pointer">{sectionData.type}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-slate-900 transition-colors cursor-pointer line-clamp-1">{sectionData.family.split(':')[0]}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 font-semibold px-2 py-0.5 bg-slate-100 rounded-md">Current Section</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                        {sectionData.number}
                    </h1>
                    <p className="text-2xl text-slate-500 font-light leading-relaxed">
                        {sectionData.name}
                    </p>
                </div>
                
                {/* Visual Type Indicator */}
                <div className="shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-2xl">
                        <span className="text-3xl font-serif font-bold">{sectionData.type === 'Income Tax' ? 'IT' : 'GST'}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Horizontal Sticky Tabs */}
        <div className="sticky top-24 z-30 bg-[#FDFCFC]/95 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 mb-8 border-b border-slate-100 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 md:gap-2 min-w-max">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border",
                            activeTab === tab.id
                                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-amber-400" : "text-slate-400")} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* 3. Main Content Area */}
        <div className="min-h-[50vh]">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Content Logic */}
                {activeTab === 'limits' ? (
                    limitItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {limitItems.map((item, i) => (
                                <InfoCard key={i} label={item.label} value={item.value} delay={i * 0.1} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-slate-400 italic bg-white rounded-2xl border border-slate-100">No key limits data available.</div>
                    )
                ) : activeTab === 'amendments' ? (
                    <TimelineView events={sectionData.amendments} />
                ) : activeTab === 'circulars' ? (
                    <TimelineView events={sectionData.circulars} />
                ) : activeTab === 'caseLaws' ? (
                    <TimelineView events={sectionData.caseLaws} />
                ) : (
                    // Default / Synopsis View
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                         <div className="prose prose-xl prose-slate max-w-none text-slate-600 font-light leading-loose">
                            <p className="whitespace-pre-line">
                                {sectionData.synopsis}
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Footer */}
            <div className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Info className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 uppercase">Source Verified</span>
                        <span className="text-xs text-slate-500">Official Gazette of India</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm">
                    View Original Document
                    <ExternalLink className="w-3 h-3" />
                </button>
            </div>
        </div>

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
