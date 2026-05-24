import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../lib/cloudinary";
import Bgvideo from "../assets/bg.mp4";

interface Product {
    id: string;
    name: string;
    price: string;
    type: string;
    description?: string;
    images?: string[];
    imageUrl?: string;
    featured: boolean;
}

interface Category {
    id: string;
    title: string;
}

export default function ManageProducts() {
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newType, setNewType] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newImages, setNewImages] = useState<string[]>([]);
    const [newFeatured, setNewFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editType, setEditType] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImages, setEditImages] = useState<string[]>([]);
    const [editUploading, setEditUploading] = useState(false);

    const productsCollection = collection(db, "products");
    const categoriesCollection = collection(db, "categories");

    useEffect(() => {
        const fetchAll = async () => {
            const [prodSnap, catSnap] = await Promise.all([
                getDocs(productsCollection),
                getDocs(categoriesCollection),
            ]);
            setProducts(prodSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Product)));
            const cats = catSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Category));
            setCategories(cats);
            if (cats.length > 0 && !newType) setNewType(cats[0].title);
            setPageLoading(false);
        };
        fetchAll();
    }, []);

    const fetchProducts = async () => {
        const data = await getDocs(productsCollection);
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Product)));
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

    const handleAddImage = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setNewImages((prev) => [...prev, url]);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleEditImage = async (file: File) => {
        setEditUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setEditImages((prev) => [...prev, url]);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setEditUploading(false);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeEditImage = (index: number) => {
        setEditImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newPrice || newImages.length === 0) return alert("Please fill all fields and upload at least one image");
        setLoading(true);
        try {
            await addDoc(productsCollection, {
                name: newName.trim(),
                price: newPrice.trim(),
                type: newType,
                description: newDescription.trim(),
                images: newImages,
                featured: newFeatured,
            });
            setNewName("");
            setNewPrice("");
            setNewDescription("");
            setNewImages([]);
            setNewFeatured(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Failed to add. Check Firestore rules.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert("Failed to delete. Check Firestore rules.");
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setEditName(product.name);
        setEditPrice(product.price);
        setEditType(product.type);
        setEditDescription(product.description || "");
        setEditImages(product.images || (product.imageUrl ? [product.imageUrl] : []));
    };

    const handleSave = async (id: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim() || !editPrice.trim()) return;
        try {
            const update: any = {
                name: editName.trim(),
                price: editPrice.trim(),
                type: editType,
                description: editDescription.trim(),
                images: editImages,
            };
            await updateDoc(doc(db, "products", id), update);
            setEditingId(null);
            fetchProducts();
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
            await updateDoc(doc(db, "products", id), { featured: !current });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Failed to update. Check Firestore rules.");
        }
    };

    const getFirstImage = (product: Product): string => {
        if (product.images && product.images.length > 0) return product.images[0];
        if (product.imageUrl) return product.imageUrl;
        return "";
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
                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Products</button>
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
                        <h1 className="text-4xl font-bold">Manage Products</h1>
                        <p className="text-gray-400">Add, edit, or remove shop products.</p>
                    </header>

                    {/* ADD FORM */}
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 mb-12">
                        <h3 className="text-lg font-semibold mb-6">Add New Product</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white"
                                    placeholder="Product name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <input
                                    className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white"
                                    placeholder="Price (LKR 2,500)"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                />
                                <select
                                    className="bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none"
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                >
                                    {categories.length === 0 && <option>No categories</option>}
                                    {categories.map((cat) => (
                                        <option key={cat.id} className="bg-zinc-900" value={cat.title}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white resize-none"
                                placeholder="Product description"
                                rows={3}
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Images</label>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white/10 file:text-white"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleAddImage(f);
                                            e.target.value = "";
                                        }}
                                    />
                                    {uploading && <span className="text-sm text-gray-400">Uploading...</span>}
                                </div>
                                {newImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newImages.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <img src={url} className="h-16 w-16 rounded-lg object-cover" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                disabled={loading || newImages.length === 0}
                                className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Add Product"}
                            </button>
                        </form>
                    </div>

                    {/* PRODUCTS LIST */}
                    <h3 className="text-xl font-semibold mb-6">Current Products</h3>
                    {products.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No products yet. Add one above.</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                                {editingId === product.id ? (
                                    <form onSubmit={(e) => handleSave(product.id, e)} className="p-4 space-y-3">
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white text-sm"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            autoFocus
                                        />
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white text-sm"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                        />
                                        <select
                                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl outline-none text-sm"
                                            value={editType}
                                            onChange={(e) => setEditType(e.target.value)}
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.id} className="bg-zinc-900" value={cat.title}>{cat.title}</option>
                                            ))}
                                        </select>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white text-sm resize-none"
                                            rows={2}
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400">Images</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white"
                                                onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleEditImage(f);
                                                    e.target.value = "";
                                                }}
                                            />
                                            {editUploading && <p className="text-xs text-gray-400">Uploading...</p>}
                                            {editImages.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {editImages.map((url, i) => (
                                                        <div key={i} className="relative group">
                                                            <img src={url} className="h-12 w-12 rounded object-cover" alt="" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeEditImage(i)}
                                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                x
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
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
                                            <img src={getFirstImage(product)} className="w-full h-full object-cover" alt={product.name} />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold">{product.name}</h4>
                                                    <p className="text-xs text-gray-400">{product.type}</p>
                                                    <p className="text-sm font-semibold mt-1">{product.price}</p>
                                                    {(product.images?.length || (product.imageUrl ? 1 : 0)) > 1 && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {(product.images?.length || (product.imageUrl ? 1 : 0))} images
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                                                        className={`p-1 ${product.featured ? "text-yellow-400" : "text-gray-500"} hover:scale-110 transition`}
                                                        title={product.featured ? "Unmark featured" : "Mark featured"}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={product.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300 p-1" title="Edit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 p-1" title="Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
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
