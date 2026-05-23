import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Bgvideo from "../assets/bg.mp4";

interface Category {
    id: string;
    title: string;
    description: string;
}

export default function ManageCategories() {
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const addTitleRef = useRef<HTMLInputElement>(null);
    const addDescRef = useRef<HTMLTextAreaElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");


    const categoriesCollection = collection(db, "categories");

    useEffect(() => {
        getDocs(categoriesCollection).then((data) => {
            setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Category)));
            setPageLoading(false);
        });
    }, []);

    const fetchData = async () => {
        const data = await getDocs(categoriesCollection);
        setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Category)));
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

    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newTitle.trim()) return;
        try {
            await addDoc(categoriesCollection, { title: newTitle.trim(), description: newDesc.trim() });
            setNewTitle("");
            setNewDesc("");
            fetchData();
        } catch (err) {
            console.error("Add failed:", err);
            alert("Failed to add category. Check Firestore rules.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this category?")) {
            try {
                await deleteDoc(doc(db, "categories", id));
                fetchData();
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete. Check Firestore rules.");
            }
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditTitle(cat.title);
        setEditDesc(cat.description);
    };

    const handleSave = async (id: string, e?: React.FormEvent) => {
        e?.preventDefault();
        if (!editTitle.trim()) return;
        try {
            await updateDoc(doc(db, "categories", id), { title: editTitle.trim(), description: editDesc.trim() });
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save. Check Firestore rules.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDesc("");
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
                    <button onClick={() => navigate("/admin/gallery")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Gallery</button>
                    <button onClick={() => navigate("/admin/products")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Products</button>
                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Categories</button>
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
                <div className="max-w-3xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold">Manage Categories</h1>
                        <p className="text-gray-400">Add, edit, or remove art categories.</p>
                    </header>

                    {/* ADD FORM */}
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 mb-12">
                        <h3 className="text-lg font-semibold mb-6">Add New Category</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input
                                ref={addTitleRef}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white"
                                placeholder="Category title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), addDescRef.current?.focus())}
                            />
                            <textarea
                                ref={addDescRef}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white resize-none"
                                placeholder="Category description"
                                rows={2}
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
                            >
                                Add Category
                            </button>
                        </form>
                    </div>

                    {/* CATEGORY LIST */}
                    <div className="space-y-3">
                        {categories.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No categories yet. Add one above.</p>
                        )}
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
                                {editingId === cat.id ? (
                                    <form onSubmit={(e) => handleSave(cat.id, e)} className="space-y-3">
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    (e.currentTarget.form?.elements[1] as HTMLElement)?.focus();
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white resize-none"
                                            rows={2}
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
                                                }
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="text-green-400 hover:text-green-300 font-semibold text-sm">Save</button>
                                            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-300 font-semibold text-sm">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-lg font-medium">{cat.title}</h4>
                                            {cat.description && (
                                                <p className="text-sm text-gray-400 mt-1">{cat.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4 shrink-0">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="text-blue-400 hover:text-blue-300 p-1"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18"/>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
