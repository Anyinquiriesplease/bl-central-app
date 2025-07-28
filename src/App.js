import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, query, orderBy, where, getDoc, setDoc } from 'firebase/firestore';

// --- ICONS ---
const PlayCircle = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>);
const ArrowLeft = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const Tv = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>);
const Mail = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const Lock = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const Shield = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const PlusCircle = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>);
const XCircle = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Download = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const Bell = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
const Send = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);
const Star = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const Plus = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const Check = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>);
const Search = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);

// --- MOCK DATA ---
const mockDramas = [
    { id: '1', title: 'Semantic Error', synopsis: 'A story about the inflexible and rule-abiding Chu Sangwoo...', thumbnailUrl: 'https://placehold.co/400x600/1a1a2e/e0e0e0?text=Semantic+Error', country: 'South Korea', category: 'Trending', episodes: [{ title: 'Episode 1', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }], createdAt: new Date() },
    { id: '2', title: 'Bad Buddy', synopsis: 'Pran and Pat are neighbors whose families have a deep-seated rivalry...', thumbnailUrl: 'https://placehold.co/400x600/1a1a2e/e0e0e0?text=Bad+Buddy', country: 'Thailand', category: 'New Episodes', episodes: [{ title: 'Episode 1', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }], createdAt: new Date() },
];

// --- FIREBASE CONFIG & ADMIN EMAIL ---
const firebaseConfig = {
  apiKey: "AIzaSyCutiKHTzKfo1_G15cjZ6I6SbMgOYXkDGk",
  authDomain: "bl-central-app.firebaseapp.com",
  projectId: "bl-central-app",
  storageBucket: "bl-central-app.appspot.com",
  messagingSenderId: "696701593167",
  appId: "1:696701593167:web:e72d2257ed350901986c3a"
};
const ADMIN_EMAIL = "anyinquiriesplease@gmail.com";

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- AUTHENTICATION CONTEXT ---
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const value = { user, isAdmin: user?.email === ADMIN_EMAIL, signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password), logIn: (email, password) => signInWithEmailAndPassword(auth, email, password), logOut: () => signOut(auth), resetPassword: (email) => sendPasswordResetEmail(auth, email) };
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

// --- UI COMPONENTS ---
const DramaCard = ({ drama, onClick }) => (
    <div onClick={onClick} className="flex-shrink-0 w-36 md:w-48 group cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-2">
        <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-gray-800 shadow-lg"><img src={drama.thumbnailUrl} alt={drama.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /><div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300"></div></div>
        <h4 className="mt-2 font-semibold truncate text-white">{drama.title}</h4><p className="text-sm text-gray-400">{drama.country}</p>
    </div>
);

const DramaCarousel = ({ title, dramas, onDramaClick }) => (
    <section>
        <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {dramas.length > 0 ? dramas.map(drama => (<DramaCard key={drama.id} drama={drama} onClick={() => onDramaClick(drama)} />)) : <p className="text-gray-500">Nothing here yet!</p>}
        </div>
    </section>
);

const SkeletonCard = () => (
    <div className="flex-shrink-0 w-36 md:w-48">
        <div className="relative rounded-lg aspect-[2/3] bg-gray-700 animate-pulse"></div>
        <div className="mt-2 h-5 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="mt-1 h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
    </div>
);

const SkeletonCarousel = () => (
    <section>
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    </section>
);

const StarRating = ({ rating, onRating }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button key={starValue} onClick={() => onRating && onRating(starValue)}>
                        <Star className={`h-6 w-6 transition-colors ${starValue <= rating ? 'text-yellow-400' : 'text-gray-600'} ${onRating ? 'hover:text-yellow-300' : ''}`} />
                    </button>
                );
            })}
        </div>
    );
};

// --- PAGE COMPONENTS ---
const AuthPage = ({ setPage }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { signUp, logIn, resetPassword } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            if (isLogin) {
                await logIn(email, password);
            } else {
                await signUp(email, password);
                setMessage('Account created! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };
    const handlePasswordReset = async () => {
        if (!email) { setError('Please enter your email address to reset your password.'); return; }
        try { await resetPassword(email); setMessage(`Password reset link sent to ${email}. Please check your inbox.`); setError(''); } catch (err) { setError(err.message.replace('Firebase: ', '')); }
    };
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 text-white">
            <div className="w-full max-w-md">
                <div className="text-center mb-8"><Tv className="mx-auto h-12 w-12 text-blue-400"/><h1 className="text-4xl font-bold mt-2">BL Central</h1><p className="text-gray-400">Your home for Boys' Love series.</p></div>
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Log In' : 'Sign Up'}</h2>
                    {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    {message && <p className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4 text-sm">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative"><Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"/><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pr-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                        <div className="mb-6 relative"><Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"/><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pr-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">{isLogin ? 'Log In' : 'Sign Up'}</button>
                    </form>
                    <div className="mt-6 text-center text-sm"><p className="text-gray-400">{isLogin ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="font-semibold text-blue-400 hover:text-blue-300 ml-1">{isLogin ? 'Sign Up' : 'Log In'}</button></p>{isLogin && (<p className="mt-2"><button onClick={handlePasswordReset} className="font-semibold text-gray-400 hover:text-gray-300">Forgot Password?</button></p>)}</div>
                </div>
            </div>
        </div>
    );
};

const HomePage = ({ setPage, setSelectedDrama }) => {
    const [allDramas, setAllDramas] = useState([]);
    const [viewHistory, setViewHistory] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Dramas
                const dramaQuery = query(collection(db, "dramas"), orderBy("createdAt", "desc"));
                const dramaSnapshot = await getDocs(dramaQuery);
                const dramasData = dramaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllDramas(dramasData.length > 0 ? dramasData : mockDramas);

                // Fetch Notifications
                const notifQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
                const notifSnapshot = await getDocs(notifQuery);
                setNotifications(notifSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Viewing History
                if (user) {
                    const historyQuery = query(collection(db, "users", user.uid, "viewingHistory"), orderBy("watchedAt", "desc"));
                    const historySnapshot = await getDocs(historyQuery);
                    setViewHistory(historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setAllDramas(mockDramas);
            }
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const filteredDramas = allDramas.filter(drama =>
        drama.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleDramaClick = (drama) => {
        setSelectedDrama(drama);
        setPage('details');
    };

    const categories = ['Trending', 'New Episodes', 'Popular in Uganda', 'Classic'];

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header setPage={setPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main>
                {notifications.length > 0 && (
                    <div className="bg-blue-900/50 p-4 md:p-6">
                        <div className="container mx-auto">
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-blue-300"><Bell />Announcements</h2>
                            <div className="space-y-2">{notifications.map(notif => (<div key={notif.id} className="bg-gray-800/50 p-3 rounded-lg text-sm text-gray-300">{notif.message}</div>))}</div>
                        </div>
                    </div>
                )}
                
                <div className="py-8 px-4 md:px-8 space-y-10">
                    {loading ? (
                        <>
                            <SkeletonCarousel />
                            <SkeletonCarousel />
                        </>
                    ) : (
                        searchTerm ? (
                            <DramaCarousel title={`Search Results for "${searchTerm}"`} dramas={filteredDramas} onDramaClick={handleDramaClick} />
                        ) : (
                            <>
                                {viewHistory.length > 0 && <DramaCarousel title="Continue Watching" dramas={viewHistory} onDramaClick={handleDramaClick} />}
                                {categories.map(category => (<DramaCarousel key={category} title={category} dramas={allDramas.filter(d => d.category === category)} onDramaClick={handleDramaClick}/>))}
                            </>
                        )
                    )}
                </div>
            </main>
            <Footer setPage={setPage} />
        </div>
    );
};

const DramaDetailsPage = ({ setPage, drama }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDetails = useCallback(async () => {
        if (!drama) return;
        setLoading(true);
        // Fetch comments
        const q = query(collection(db, "dramas", drama.id, "comments"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        // Check watchlist
        if (user) {
            const docRef = doc(db, "users", user.uid, "watchlist", drama.id);
            const docSnap = await getDoc(docRef);
            setIsInWatchlist(docSnap.exists());
        }
        setLoading(false);
    }, [drama, user]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        await addDoc(collection(db, "dramas", drama.id, "comments"), {
            text: newComment,
            author: user.email,
            createdAt: serverTimestamp(),
        });
        setNewComment("");
        fetchDetails();
    };
    
    const handleWatchlistToggle = async () => {
        if (!user) return;
        const docRef = doc(db, "users", user.uid, "watchlist", drama.id);
        if (isInWatchlist) {
            await deleteDoc(docRef);
        } else {
            await setDoc(docRef, { title: drama.title, thumbnailUrl: drama.thumbnailUrl, country: drama.country, addedAt: serverTimestamp() });
        }
        setIsInWatchlist(!isInWatchlist);
    };

    if (!drama) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><button onClick={() => setPage('home')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><ArrowLeft className="h-6 w-6"/>Go Back</button></div>;
    
    return (
        <div className="bg-gray-900 text-white min-h-screen">
             <div className="p-4"><button onClick={() => setPage('home')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><ArrowLeft className="h-6 w-6"/>Back to Home</button></div>
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0"><img src={drama.thumbnailUrl} alt={drama.title} className="w-full h-auto object-cover rounded-lg shadow-lg"/></div>
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold">{drama.title}</h1>
                        <p className="text-lg text-gray-400 mt-2">{drama.country}</p>
                        <div className="my-4 flex items-center gap-4">
                            <StarRating rating={rating} onRating={setRating} />
                            <span className="text-gray-400">Your Rating</span>
                        </div>
                        <p className="mt-4 max-w-2xl text-gray-300">{drama.synopsis}</p>
                        {user && <button onClick={handleWatchlistToggle} className={`mt-6 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors ${isInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {isInWatchlist ? <Check /> : <Plus />} {isInWatchlist ? 'On My List' : 'Add to My List'}
                        </button>}
                    </div>
                </div>
                <div className="mt-12">
                    <h2 className="text-3xl font-semibold mb-4">Episodes</h2>
                    <div className="space-y-3 max-w-3xl">
                        {drama.episodes.map((episode, index) => (
                            <div key={index} onClick={() => setPage('player', { drama, episode })} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors">
                                <div className="flex items-center gap-4"><span className="text-xl font-bold text-gray-400">{index + 1}</span><p className="font-semibold">{episode.title}</p></div><PlayCircle className="h-8 w-8 text-blue-400"/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 max-w-3xl">
                    <h2 className="text-3xl font-semibold mb-4">Comments</h2>
                    {user && <form onSubmit={handleAddComment} className="mb-6">
                        <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a public comment..." className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        <button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Comment</button>
                    </form>}
                    <div className="space-y-4">
                        {loading ? <p>Loading comments...</p> : comments.map(comment => (
                            <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
                                <p className="font-semibold text-blue-300">{comment.author}</p>
                                <p className="text-gray-300 mt-1">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <Footer setPage={setPage} />
        </div>
    );
};

const PlayerPage = ({ setPage, context }) => {
    const { drama, episode } = context;
    const { user } = useAuth();

    useEffect(() => {
        const setHistory = async () => {
            if (user && drama && episode) {
                const historyRef = doc(db, "users", user.uid, "viewingHistory", drama.id);
                const dramaDataForHistory = {
                    title: drama.title,
                    thumbnailUrl: drama.thumbnailUrl,
                    country: drama.country,
                    episodes: drama.episodes,
                    synopsis: drama.synopsis,
                    lastWatched: episode.title,
                    watchedAt: serverTimestamp()
                };
                await setDoc(historyRef, dramaDataForHistory, { merge: true });
            }
        };
        setHistory();
    }, [user, drama, episode]);

    const handleDownload = () => {
        const youtubeUrl = episode.videoUrl.replace('embed/', 'watch?v=');
        window.open(`https://ssyoutube.com/en/download-from-youtube?url=${youtubeUrl}`, '_blank');
    };

    if (!drama || !episode) return <div className="bg-black text-white min-h-screen flex items-center justify-center"><p>Playback error. No video data.</p><button onClick={() => setPage('home')} className="ml-4 bg-blue-600 p-2 rounded">Home</button></div>;
    return (
        <div className="bg-black text-white min-h-screen flex flex-col">
            <header className="p-4 flex items-center justify-between bg-gray-900/50">
                <div><h1 className="text-xl font-bold">{drama.title}</h1><p className="text-gray-400">{episode.title}</p></div>
                <div className="flex items-center gap-4">
                    <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"><Download className="h-5 w-5"/> Download</button>
                    <button onClick={() => setPage('details', drama)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"><ArrowLeft className="h-5 w-5"/>Back</button>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center"><div className="w-full max-w-6xl aspect-video bg-black"><iframe src={episode.videoUrl} title={episode.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe></div></main>
        </div>
    );
};

const MyListPage = ({ setPage, setSelectedDrama }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!user) return;
            setLoading(true);
            const q = query(collection(db, "users", user.uid, "watchlist"), orderBy("addedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const list = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
                const dramaDoc = await getDoc(doc(db, "dramas", docSnapshot.id));
                return dramaDoc.exists() ? { id: dramaDoc.id, ...dramaDoc.data() } : null;
            }));
            setWatchlist(list.filter(item => item !== null));
            setLoading(false);
        };
        fetchWatchlist();
    }, [user]);

    if(loading) return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header setPage={setPage} />
            <main className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-6">My List</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </main>
            <Footer setPage={setPage} />
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header setPage={setPage} />
            <main className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-6">My List</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {watchlist.length > 0 ? watchlist.map(drama => (
                        <DramaCard key={drama.id} drama={drama} onClick={() => { setSelectedDrama(drama); setPage('details'); }} />
                    )) : <p className="col-span-full text-gray-500">You haven't added any series to your list yet.</p>}
                </div>
            </main>
            <Footer setPage={setPage} />
        </div>
    );
};

// --- ADMIN COMPONENTS ---
const AdminPage = ({ setPage }) => {
    const [activeTab, setActiveTab] = useState('viewSeries');
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header setPage={setPage} />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-4xl font-bold mb-6 flex items-center gap-3"><Shield />Admin Panel</h1>
                <div className="flex border-b border-gray-700 mb-6">
                    <button onClick={() => setActiveTab('viewSeries')} className={`py-2 px-4 ${activeTab === 'viewSeries' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}>View Series</button>
                    <button onClick={() => setActiveTab('addSeries')} className={`py-2 px-4 ${activeTab === 'addSeries' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}>Add Series</button>
                    <button onClick={() => setActiveTab('viewRequests')} className={`py-2 px-4 ${activeTab === 'viewRequests' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}>View Requests</button>
                    <button onClick={() => setActiveTab('sendNotification')} className={`py-2 px-4 ${activeTab === 'sendNotification' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}>Send Notification</button>
                </div>
                <div>
                    {activeTab === 'viewSeries' && <AdminSeriesList />}
                    {activeTab === 'addSeries' && <AdminAddSeriesForm />}
                    {activeTab === 'viewRequests' && <AdminViewRequests />}
                    {activeTab === 'sendNotification' && <AdminSendNotification />}
                </div>
            </div>
            <Footer setPage={setPage} />
        </div>
    );
};

const AdminSeriesList = () => {
    const [dramas, setDramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchDramas = useCallback(async () => {
        setLoading(true);
        const q = query(collection(db, "dramas"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setDramas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    }, []);
    useEffect(() => { fetchDramas(); }, [fetchDramas]);
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this series?")) {
            await deleteDoc(doc(db, "dramas", id));
            fetchDramas();
        }
    };
    if (loading) return <p>Loading series...</p>;
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Manage Series</h2>
            <div className="space-y-3">
                {dramas.map(drama => (
                    <div key={drama.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                        <p>{drama.title}</p>
                        <div className="flex gap-2">
                            <button className="text-sm bg-yellow-500 text-white py-1 px-2 rounded">Edit</button>
                            <button onClick={() => handleDelete(drama.id)} className="text-sm bg-red-600 text-white py-1 px-2 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminAddSeriesForm = () => {
    const [title, setTitle] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('Trending');
    const [episodes, setEpisodes] = useState([{ title: '', videoUrl: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const handleEpisodeChange = (index, field, value) => { const newEpisodes = [...episodes]; newEpisodes[index][field] = value; setEpisodes(newEpisodes); };
    const addEpisodeField = () => setEpisodes([...episodes, { title: '', videoUrl: '' }]);
    const removeEpisodeField = (index) => setEpisodes(episodes.filter((_, i) => i !== index));
    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setMessage('');
        try {
            await addDoc(collection(db, 'dramas'), { title, synopsis, thumbnailUrl, country, category, episodes, createdAt: serverTimestamp() });
            setMessage('Series added successfully!'); setTitle(''); setSynopsis(''); setThumbnailUrl(''); setCountry(''); setCategory('Trending'); setEpisodes([{ title: '', videoUrl: '' }]);
        } catch (error) { setMessage(`Error: ${error.message}`); } finally { setIsSubmitting(false); }
    };
    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-6">
            <h2 className="text-2xl font-bold mb-4">Add New Series</h2>
            {message && <p className={`p-3 rounded-md text-sm ${message.startsWith('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{message}</p>}
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Synopsis</label><textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 h-24" required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail URL</label><input type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Country</label><input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g., Thailand" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"><option>Trending</option><option>New Episodes</option><option>Popular in Uganda</option><option>Classic</option><option>Fan Favorite</option><option>Coming Soon</option></select></div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Episodes</h3>
                <div className="space-y-4">
                    {episodes.map((ep, index) => (<div key={index} className="flex items-center gap-2 bg-gray-700/50 p-3 rounded-lg"><span className="text-gray-400 font-bold">{index + 1}</span><input type="text" value={ep.title} onChange={e => handleEpisodeChange(index, 'title', e.target.value)} placeholder="Episode Title" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required /><input type="url" value={ep.videoUrl} onChange={e => handleEpisodeChange(index, 'videoUrl', e.target.value)} placeholder="https://youtube.com/embed/..." className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required /><button type="button" onClick={() => removeEpisodeField(index)} className="p-2 text-red-400 hover:text-red-300"><XCircle /></button></div>))}
                </div>
                <button type="button" onClick={addEpisodeField} className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"><PlusCircle /> Add Another Episode</button>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg">{isSubmitting ? 'Submitting...' : 'Add Series to Database'}</button>
        </form>
    );
};

const AdminViewRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setRequests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchRequests();
    }, []);
    if (loading) return <p>Loading requests...</p>;
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">User Series Requests</h2>
            <div className="space-y-3">
                {requests.length === 0 && <p>No requests yet.</p>}
                {requests.map(req => (
                    <div key={req.id} className="bg-gray-700 p-3 rounded">
                        <p className="font-bold">{req.title}</p>
                        {req.reason && <p className="text-sm text-gray-400 mt-1">"{req.reason}"</p>}
                        <p className="text-xs text-gray-500 mt-2">Requested by: {req.requestedBy}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminSendNotification = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setStatus('');
        try {
            await addDoc(collection(db, 'notifications'), { message, createdAt: serverTimestamp() });
            setStatus('Notification sent successfully!'); setMessage('');
        } catch (error) { setStatus(`Error: ${error.message}`); } finally { setIsSubmitting(false); }
    };
    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold mb-4">Send a Notification</h2>
            {status && <p className={`p-3 rounded-md text-sm ${status.startsWith('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{status}</p>}
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="e.g., New episodes of 'Bad Buddy' are now available!" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 h-24" required /></div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">{isSubmitting ? 'Sending...' : <><Send className="h-5 w-5"/> Send to All Users</>}</button>
        </form>
    );
};

const RequestPage = ({ setPage }) => {
    const [title, setTitle] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setMessage('');
        try {
            await addDoc(collection(db, 'requests'), { title, reason, requestedBy: user.email, createdAt: serverTimestamp() });
            setMessage('Your request has been submitted! Thank you.'); setTitle(''); setReason('');
        } catch (error) { setMessage(`Error: ${error.message}`); } finally { setIsSubmitting(false); }
    };
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header setPage={setPage} />
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-4xl font-bold mb-6">Request a Series</h1>
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-6">
                    {message && <p className={`p-3 rounded-md text-sm ${message.startsWith('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{message}</p>}
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Series Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Why do you want to see this series? (Optional)</label><textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
                </form>
            </div>
            <Footer setPage={setPage} />
        </div>
    );
};

// --- LAYOUT & MAIN APP ---
const Header = ({ setPage, searchTerm, setSearchTerm }) => {
    const { user, logOut, isAdmin } = useAuth();
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4">
                <div onClick={() => setPage('home')} className="flex items-center gap-2 cursor-pointer flex-shrink-0"><Tv className="h-8 w-8 text-blue-400"/><span className="text-2xl font-bold text-white">BL Central</span></div>
                {setSearchTerm && <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input type="text" placeholder="Search for a series..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-full py-2 pr-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>}
                <div className="flex items-center gap-4 flex-shrink-0">
                    {user && <button onClick={() => setPage('my-list')} className="text-gray-300 hover:text-white transition-colors">My List</button>}
                    {user && <button onClick={() => setPage('request')} className="text-gray-300 hover:text-white transition-colors">Request</button>}
                    {isAdmin && <button onClick={() => setPage('admin')} className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500/30 transition-colors"><Shield className="h-5 w-5"/> Admin</button>}
                    {user && <button onClick={() => { logOut(); setPage('auth'); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Log Out</button>}
                </div>
            </nav>
        </header>
    );
};
const Footer = ({ setPage }) => (
    <footer className="bg-gray-800/50 mt-12 py-8 px-4 md:px-8 text-center text-gray-400">
        <div className="flex justify-center gap-6 mb-4"><button onClick={() => setPage('contact')} className="hover:text-white transition-colors">Contact</button><button onClick={() => setPage('policy')} className="hover:text-white transition-colors">Privacy Policy</button></div>
        <p>&copy; {new Date().getFullYear()} BL Central. All Rights Reserved (as per policy).</p>
    </footer>
);
const ContactPage = ({ setPage }) => (
    <div className="bg-gray-900 text-white min-h-screen">
        <Header setPage={setPage} /><div className="max-w-4xl mx-auto p-8"><h1 className="text-4xl font-bold mb-6">Contact Us</h1><div className="bg-gray-800 p-8 rounded-lg"><p className="text-lg text-gray-300">For any inquiries, partnership proposals, or content removal requests, please feel free to reach out to us. We value your feedback and will do our best to respond in a timely manner.</p><div className="mt-6"><h3 className="text-xl font-semibold text-blue-400">Email Address:</h3><a href="mailto:anyinquiriesplease@gmail.com" className="text-2xl font-mono text-white hover:underline">anyinquiriesplease@gmail.com</a></div></div></div><Footer setPage={setPage} />
    </div>
);
const PrivacyPolicyPage = ({ setPage }) => (
    <div className="bg-gray-900 text-white min-h-screen">
        <Header setPage={setPage} />
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-4">
                <h2 className="text-2xl font-semibold text-white">4. Copyright and Content Disclaimer</h2>
                <p className="font-bold text-yellow-300 bg-gray-800 p-4 rounded-lg">
                    This is the most important part of our policy. We, the operators of BL Central, do not own the copyrights to the video materials, productions, or any other creative works made available through our service. Our platform acts as a third-party indexer or catalogue, providing links to content that is hosted by external, third-party services. We do not host any video files on our servers.
                </p>
                <p className="font-bold text-yellow-300 bg-gray-800 p-4 rounded-lg">
                    We take copyright matters very seriously. If you are a copyright holder and believe that any content available via our application infringes upon your copyright, please contact us. Upon receiving a valid request, we will promptly investigate and ensure the infringing content is removed from our platform in a timely manner. We appreciate your cooperation in helping us maintain a respectful and lawful environment. You can email us at <a href="mailto:anyinquiriesplease@gmail.com" className="underline">anyinquiriesplease@gmail.com</a> with a formal removal request.
                </p>
            </div>
        </div>
        <Footer setPage={setPage} />
    </div>
);

function App() {
    const [page, setPage] = useState('auth');
    const [pageContext, setPageContext] = useState(null);
    const { user } = useAuth();
    useEffect(() => { if (user) { setPage('home'); } else { setPage('auth'); } }, [user]);
    const navigate = (pageName, context = null) => { setPage(pageName); setPageContext(context); };
    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage setPage={navigate} setSelectedDrama={(drama) => navigate('details', drama)} />;
            case 'details': return <DramaDetailsPage setPage={navigate} drama={pageContext} />;
            case 'player': return <PlayerPage setPage={navigate} context={pageContext} />;
            case 'contact': return <ContactPage setPage={navigate} />;
            case 'policy': return <PrivacyPolicyPage setPage={navigate} />;
            case 'admin': return <AdminPage setPage={navigate} />;
            case 'request': return <RequestPage setPage={navigate} />;
            case 'my-list': return <MyListPage setPage={navigate} setSelectedDrama={(drama) => navigate('details', drama)} />;
            case 'auth': default: return <AuthPage setPage={navigate} />;
        }
    };
    return <div className="antialiased">{renderPage()}</div>;
}

// This is the main component that should be exported.
// It wraps the entire App in the AuthProvider.
const AppWrapper = () => (<AuthProvider><App /></AuthProvider>);
export default AppWrapper;

