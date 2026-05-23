import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../lib/cloudinary";
import Bgvideo from "../assets/bg.mp4";

interface ArtPost {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    featured: boolean;
}

interface Category {
    id: string;
    title: string;
}

export default function ManageGallery() {
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [posts, setPosts] = useState<ArtPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newFeatured, setNewFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");

    const postsCollection = collection(db, "posts");
    const categoriesCollection = collection(db, "categories");

    useEffect(() => {
        const fetchAll = async () => {
            const [postSnap, catSnap] = await Promise.all([
                getDocs(postsCollection),
                getDocs(categoriesCollection),
            ]);
            setPosts(postSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ArtPost)));
            const cats = catSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Category));
            setCategories(cats);
            if (cats.length > 0 && !newCategory) setNewCategory(cats[0].title);
            setPageLoading(false);
        };
        fetchAll();
    }, []);

    const fetchPosts = async () => {
        const data = await getDocs(postsCollection);
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ArtPost)));
    };

    if (pageLoading) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    const handleUploadImage = async (file: File, setUrl: (url: string) => void) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setUrl(url);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newImageUrl) return alert("Please fill all fields");
        setLoading(true);
        try {
            await addDoc(postsCollection, { title: newTitle.trim(), category: newCategory, imageUrl: newImageUrl.trim(), featured: newFeatured });
            setNewTitle("");
            setNewImageUrl("");
            setNewFeatured(false);
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert("Failed to add. Check Firestore rules.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this artwork?")) {
            try {
                await deleteDoc(doc(db, "posts", id));
                fetchPosts();
            } catch (err) {
                console.error(err);
                alert("Failed to delete. Check Firestore rules.");
            }
        }
    };

    const handleEdit = (post: ArtPost) => {
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditCategory(post.category);
        setEditImageUrl(post.imageUrl);
    };

    const handleSave = async (id: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        try {
            const update: any = { title: editTitle.trim(), category: editCategory };
            if (editImageUrl.trim()) update.imageUrl = editImageUrl.trim();
            await updateDoc(doc(db, "posts", id), update);
            setEditingId(null);
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert("Failed to save. Check Firestore rules.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(db, "posts", id), { featured: !current });
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert("Failed to update. Check Firestore rules.");
        }
    };

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover -z-20"
                src={Bgvideo} autoPlay muted loop playsInline
            />
            <div className="absolute inset-0 bg-black/70 -z-10"></div>

            <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 text-white flex flex-col p-6 hidden md:flex">
                <h2 className="text-2xl font-bold mb-10 tracking-tight">Thanudi Arts <br/><span className="text-sm font-light text-gray-400">Admin Panel</span></h2>
                <nav className="space-y-4 flex-1">
                    <button onClick={() => navigate("/admin/dashboard")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Dashboard</button>
                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Gallery</button>
                    <button onClick={() => navigate("/admin/products")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Products</button>
                    <button onClick={() => navigate("/admin/categories")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Categories</button>
                    <button onClick={() => navigate("/admin/layouts")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Sections</button>
                    <button onClick={() => navigate("/admin/messages")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Messages</button>
                </nav>
                <button
                    onClick={async () => { await signOut(auth); navigate("/admin"); }}
                    className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition font-semibold"
                >
                    Logout
                </button>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 text-white">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold">Manage Gallery</h1>
                        <p className="text-gray-400">Add, edit, or remove gallery artworks.</p>
                    </header>

                    {/* ADD FORM */}
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 mb-12">
                        <h3 className="text-lg font-semibold mb-6">Add New Artwork</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white"
                                placeholder="Artwork title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <select
                                    className="flex-1 bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                >
                                    {categories.length === 0 && <option>No categories</option>}
                                    {categories.map((cat) => (
                                        <option key={cat.id} className="bg-zinc-900" value={cat.title}>{cat.title}</option>
                                    ))}
                                </select>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white/10 file:text-white"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleUploadImage(f, setNewImageUrl)
                                        }}
                                    />
                                    {uploading && <span className="text-sm text-gray-400">Uploading...</span>}
                                    {newImageUrl && !uploading && (
                                        <img src={newImageUrl} className="h-12 w-12 rounded-lg object-cover shrink-0" alt="" />
                                    )}
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newFeatured}
                                    onChange={(e) => setNewFeatured(e.target.checked)}
                                    className="accent-yellow-400 w-4 h-4"
                                />
                                Mark as Featured
                            </label>
                            <button
                                type="submit"
                                disabled={loading || !newImageUrl}
                                className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Publish Artwork"}
                            </button>
                        </form>
                    </div>

                    {/* POSTS LIST */}
                    <h3 className="text-xl font-semibold mb-6">Current Gallery</h3>
                    {posts.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No artworks yet. Add one above.</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                                {editingId === post.id ? (
                                    <form onSubmit={(e) => handleSave(post.id, e)} className="p-4 space-y-3">
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            autoFocus
                                        />
                                        <select
                                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl outline-none"
                                            value={editCategory}
                                            onChange={(e) => setEditCategory(e.target.value)}
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.id} className="bg-zinc-900" value={cat.title}>{cat.title}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="flex-1 text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white"
                                                onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleUploadImage(f, setEditImageUrl)
                                                }}
                                            />
                                            {uploading && <span className="text-xs text-gray-400">Uploading...</span>}
                                            {editImageUrl && !uploading && (
                                                <img src={editImageUrl} className="h-10 w-10 rounded-lg object-cover shrink-0" alt="" />
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="text-green-400 hover:text-green-300 font-semibold text-sm">Save</button>
                                            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-300 font-semibold text-sm">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="h-48 overflow-hidden">
                                            <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold">{post.title}</h4>
                                                    <p className="text-xs text-gray-400">{post.category}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleToggleFeatured(post.id, post.featured)}
                                                        className={`p-1 ${post.featured ? "text-yellow-400" : "text-gray-500"} hover:scale-110 transition`}
                                                        title={post.featured ? "Unmark featured" : "Mark featured"}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={post.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(post)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18"/>
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
