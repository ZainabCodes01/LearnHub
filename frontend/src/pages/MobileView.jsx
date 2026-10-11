import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  BookOpen, 
  Star, 
  ChevronRight, 
  User, 
  Compass, 
  Home, 
  ShieldCheck,
  Smartphone,
  PlayCircle,
  Award
} from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const courses = [
    {
      id: 1,
      title: "Complete Full Stack Web Development",
      category: "Web Development",
      instructor: "Dr. Angela Smith",
      price: "$89.99",
      rating: 4.9,
      students: "12,450",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Advanced React & Next.js Masterclass",
      category: "Frontend",
      instructor: "Michael Chen",
      price: "$74.99",
      rating: 4.8,
      students: "8,920",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "UI/UX Design Essentials & Figma System",
      category: "Design",
      instructor: "Sarah Jenkins",
      price: "$64.99",
      rating: 4.9,
      students: "6,410",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex items-center justify-center p-4 sm:p-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 z-50 bg-cyan-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Smartphone Frame Container (9:16 aesthetic mockup) */}
      <div className="w-full max-w-[390px] h-[844px] bg-white text-slate-900 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[8px] border-slate-800 overflow-hidden flex flex-col relative">
        
        {/* Phone Notch / Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 mr-2"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-900"></div>
        </div>

        {/* Mobile Header */}
        <header className="h-16 pt-4 px-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              L
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Learn<span className="text-cyan-600">Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => showToast('Opening search...')}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-cyan-600 transition"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-50 text-slate-900 hover:bg-cyan-50 hover:text-cyan-600 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-16 bg-white border-b border-slate-200 shadow-xl z-40 p-6 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3 font-bold text-slate-700 text-sm">
              <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 text-cyan-600">
                <Home className="w-4 h-4" /> Home
              </button>
              <button onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); setMobileMenuOpen(false); showToast('Navigating to Courses'); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <Compass className="w-4 h-4" /> Courses
              </button>
              <button onClick={() => { setActiveTab('learning'); setMobileMenuOpen(false); showToast('Navigating to My Learning'); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <BookOpen className="w-4 h-4" /> My Learning
              </button>
              <button onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); showToast('Navigating to Profile'); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <User className="w-4 h-4" /> Profile
              </button>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => { setMobileMenuOpen(false); showToast('Login modal opened'); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">Login</button>
              <button onClick={() => { setMobileMenuOpen(false); showToast('Register modal opened'); }} className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white shadow-md">Register</button>
            </div>
          </div>
        )}

        {/* Scrollable Mobile Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-20 scrollbar-none">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest border border-cyan-500/30 mb-3">
              <Award className="w-3 h-3" /> Next-Gen Learning
            </span>

            <h1 className="text-2xl font-black tracking-tight leading-tight mb-2">
              Learn Skills. <br />
              <span className="text-cyan-400">Build Your Future.</span>
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Master full-stack development, cloud architecture, and UI/UX design with industry experts.
            </p>

            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => showToast('Exploring course catalog...')}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                <span>Explore Courses</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => showToast('Starting enrollment onboarding')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition border border-white/10"
              >
                Start Learning Free
              </button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="block text-lg font-black text-slate-900">120+</span>
              <span className="text-[11px] font-semibold text-slate-500">Expert Courses</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="block text-lg font-black text-cyan-600">45,000+</span>
              <span className="text-[11px] font-semibold text-slate-500">Active Students</span>
            </div>
          </div>

          {/* Popular Courses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 tracking-tight">Popular Courses</h2>
              <button onClick={() => showToast('Viewing all courses')} className="text-xs font-bold text-cyan-600 hover:underline">See All</button>
            </div>

            {/* Vertical Stacked Cards */}
            <div className="space-y-3.5">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 hover:shadow-md transition flex flex-col gap-3 group"
                >
                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {course.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{course.instructor}</span>
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">{course.title}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-black text-slate-900">{course.price}</span>
                    <button 
                      onClick={() => showToast(`Enrolling in ${course.title}`)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Promo Banner */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-5 text-center space-y-2">
            <h3 className="text-sm font-black text-cyan-900">Ready to transform your career?</h3>
            <p className="text-xs text-cyan-700">Join thousands of students building real-world MERN projects today.</p>
            <button 
              onClick={() => showToast('Opening registration')}
              className="mt-2 bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md"
            >
              Get Started Now
            </button>
          </div>

        </div>

        {/* Bottom Mobile Navigation Bar */}
        <nav className="absolute bottom-0 inset-x-0 h-16 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 flex items-center justify-between z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button 
            onClick={() => { setActiveTab('courses'); showToast('Courses tab selected'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'courses' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
          <button 
            onClick={() => { setActiveTab('learning'); showToast('My Learning tab selected'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'learning' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold">Learning</span>
          </button>
          <button 
            onClick={() => { setActiveTab('profile'); showToast('Profile tab selected'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </nav>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-50"></div>

      </div>
    </div>
  );
}