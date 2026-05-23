import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../lib/cloudinary";
import Bgvideo from "../assets/bg.mp4";

interface Button {
    text: string;
    link: string;
}

interface Section {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    buttons: Button[];
    active: boolean;
    order: number;
}

export default function ManageLayouts() {
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newSubtitle, setNewSubtitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newButtons, setNewButtons] = useState<Button[]>([]);
    const [newOrder, setNewOrder] = useState(0);
    const [uploading, setUploading] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editSubtitle, setEditSubtitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editButtons, setEditButtons] = useState<Button[]>([]);
    const [editActive, setEditActive] = useState(false);
    const [editOrder, setEditOrder] = useState(0);

    const sectionsCollection = collection(db, "layouts");

    useEffect(() => {
        getDocs(sectionsCollection).then((data) => {
            const items = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Section));
            items.sort((a, b) => a.order - b.order);
            setSections(items);
            setPageLoading(false);
        });
    }, []);

    const refreshSections = async () => {
        const data = await getDocs(sectionsCollection);
        const items = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Section));
        items.sort((a, b) => a.order - b.order);
        setSections(items);
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

    const addButton = (list: Button[], setList: (b: Button[]) => void) => {
        setList([...list, { text: "", link: "" }]);
    };

    const removeButton = (idx: number, list: Button[], setList: (b: Button[]) => void) => {
        setList(list.filter((_, i) => i !== idx));
    };

    const updateButton = (idx: number, field: keyof Button, val: string, list: Button[], setList: (b: Button[]) => void) => {
        const updated = list.map((b, i) => (i === idx ? { ...b, [field]: val } : b));
        setList(updated);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() && !newSubtitle.trim() && !newDesc.trim() && !newImageUrl) return alert("Fill at least one field");
        try {
            await addDoc(sectionsCollection, {
                title: newTitle.trim(),
                subtitle: newSubtitle.trim(),
                description: newDesc.trim(),
                imageUrl: newImageUrl.trim(),
                buttons: newButtons.filter(b => b.text.trim()),
                active: true,
                order: newOrder,
            });
            setNewTitle(""); setNewSubtitle(""); setNewDesc(""); setNewImageUrl(""); setNewButtons([]);
            setNewOrder(sections.length);
            refreshSections();
        } catch (err) {
            console.error(err);
            alert("Failed to add. Check Firestore rules.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this section?")) {
            try {
                await deleteDoc(doc(db, "layouts", id));
                refreshSections();
            } catch (err) {
                console.error(err);
                alert("Failed to delete. Check Firestore rules.");
            }
        }
    };

    const handleEdit = (s: Section) => {
        setEditingId(s.id);
        setEditTitle(s.title);
        setEditSubtitle(s.subtitle);
        setEditDesc(s.description);
        setEditImageUrl(s.imageUrl);
        setEditButtons(s.buttons || []);
        setEditActive(s.active);
        setEditOrder(s.order);
    };

    const handleSave = async (id: string, e: React.FormEvent) => {
        e.preventDefault();
        try {
            const update: any = {
                subtitle: editSubtitle.trim(),
                description: editDesc.trim(),
                buttons: editButtons.filter(b => b.text.trim()),
                active: editActive,
                order: editOrder,
            };
            if (editTitle.trim()) update.title = editTitle.trim();
            if (editImageUrl.trim()) update.imageUrl = editImageUrl.trim();
            await updateDoc(doc(db, "layouts", id), update);
            setEditingId(null);
            refreshSections();
        } catch (err) {
            console.error(err);
            alert("Failed to save. Check Firestore rules.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleToggleActive = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(db, "layouts", id), { active: !current });
            refreshSections();
        } catch (err) {
            console.error(err);
            alert("Failed to update. Check Firestore rules.");
        }
    };

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden">
            <video className="absolute top-0 left-0 w-full h-full object-cover -z-20" src={Bgvideo} autoPlay muted loop playsInline />
            <div className="absolute inset-0 bg-black/70 -z-10"></div>

            <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 text-white flex flex-col p-6 hidden md:flex">
                <h2 className="text-2xl font-bold mb-10 tracking-tight">Thanudi Arts <br/><span className="text-sm font-light text-gray-400">Admin Panel</span></h2>
                <nav className="space-y-4 flex-1">
                    <button onClick={() => navigate("/admin/dashboard")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Dashboard</button>
                    <button onClick={() => navigate("/admin/gallery")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Gallery</button>
                    <button onClick={() => navigate("/admin/products")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Products</button>
                    <button onClick={() => navigate("/admin/categories")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Categories</button>
                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Sections</button>
                    <button onClick={() => navigate("/admin/messages")} className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition text-gray-400">Messages</button>
                </nav>
                <button onClick={async () => { await signOut(auth); navigate("/admin"); }} className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition font-semibold">Logout</button>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 text-white">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold">Page Sections</h1>
                        <p className="text-gray-400">Content blocks for the Explore page. All fields are optional.</p>
                    </header>

                    {/* ADD FORM */}
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 mb-12">
                        <h3 className="text-lg font-semibold mb-6">New Section</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white" placeholder="Title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                            <input className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white" placeholder="Subtitle (optional)" value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} />
                            <textarea className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white resize-none" placeholder="Description (optional)" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                            <div className="flex gap-3 items-center">
                                <input type="file" accept="image/*" className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white/10 file:text-white" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImage(f, setNewImageUrl) }} />
                                {uploading && <span className="text-sm text-gray-400">Uploading...</span>}
                                {newImageUrl && !uploading && <img src={newImageUrl} className="h-12 w-12 rounded-lg object-cover shrink-0" alt="" />}
                            </div>

                            {/* Buttons */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Buttons (optional)</span>
                                    <button type="button" onClick={() => addButton(newButtons, setNewButtons)} className="text-xs text-blue-400 hover:text-blue-300">+ Add Button</button>
                                </div>
                                {newButtons.map((btn, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="flex-1 bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white text-sm" placeholder="Button text" value={btn.text} onChange={(e) => updateButton(i, "text", e.target.value, newButtons, setNewButtons)} />
                                        <input className="flex-1 bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white text-sm" placeholder="Link (e.g. /shop)" value={btn.link} onChange={(e) => updateButton(i, "link", e.target.value, newButtons, setNewButtons)} />
                                        <button type="button" onClick={() => removeButton(i, newButtons, setNewButtons)} className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
                                    </div>
                                ))}
                            </div>

                            <input type="number" className="w-24 bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-white" placeholder="Order" value={newOrder} onChange={(e) => setNewOrder(Number(e.target.value))} />
                            <button type="submit" className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition">Add Section</button>
                        </form>
                    </div>

                    {/* SECTIONS LIST */}
                    <h3 className="text-xl font-semibold mb-6">Current Sections</h3>
                    {sections.length === 0 && <p className="text-gray-500 text-center py-8">No sections yet. Add one above.</p>}
                    <div className="space-y-4">
                        {sections.map((s) => (
                            <div key={s.id} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                                {editingId === s.id ? (
                                    <form onSubmit={(e) => handleSave(s.id, e)} className="p-4 space-y-3">
                                        <input className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus />
                                        <input className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white" placeholder="Subtitle" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} />
                                        <textarea className="w-full bg-white/5 border border-white/10 p-2 rounded-xl outline-none focus:ring-1 focus:ring-white resize-none" rows={2} placeholder="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                                        <div className="flex gap-2 items-center">
                                            <input type="file" accept="image/*" className="flex-1 text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImage(f, setEditImageUrl) }} />
                                            {uploading && <span className="text-xs text-gray-400">Uploading...</span>}
                                            {editImageUrl && !uploading && <img src={editImageUrl} className="h-10 w-10 rounded-lg object-cover shrink-0" alt="" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-400">Buttons</span>
                                                <button type="button" onClick={() => addButton(editButtons, setEditButtons)} className="text-xs text-blue-400">+ Add</button>
                                            </div>
                                            {editButtons.map((btn, i) => (
                                                <div key={i} className="flex gap-2 mb-1">
                                                    <input className="flex-1 bg-white/5 border border-white/10 p-1 rounded-xl outline-none text-sm" value={btn.text} onChange={(e) => updateButton(i, "text", e.target.value, editButtons, setEditButtons)} />
                                                    <input className="flex-1 bg-white/5 border border-white/10 p-1 rounded-xl outline-none text-sm" value={btn.link} onChange={(e) => updateButton(i, "link", e.target.value, editButtons, setEditButtons)} />
                                                    <button type="button" onClick={() => removeButton(i, editButtons, setEditButtons)} className="text-red-400 text-sm">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input type="number" className="w-20 bg-white/5 border border-white/10 p-2 rounded-xl outline-none" value={editOrder} onChange={(e) => setEditOrder(Number(e.target.value))} />
                                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                                <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="accent-green-400 w-4 h-4" /> Active
                                            </label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="text-green-400 hover:text-green-300 font-semibold text-sm">Save</button>
                                            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-300 font-semibold text-sm">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${s.active ? "bg-green-400" : "bg-gray-500"}`}></span>
                                                <h4 className="font-bold">{s.title || "(no title)"}</h4>
                                                <span className="text-xs text-gray-500">Order: {s.order}</span>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button onClick={() => handleToggleActive(s.id, s.active)} className={`p-1 ${s.active ? "text-green-400" : "text-gray-500"} hover:scale-110 transition`} title={s.active ? "Deactivate" : "Activate"}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10h-10Z"/><path d="M12 12 2.93 17.65"/><path d="M22 12A10 10 0 0 0 12 2v10Z"/></svg>
                                                </button>
                                                <button onClick={() => handleEdit(s)} className="text-blue-400 hover:text-blue-300 p-1" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                                                </button>
                                                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 p-1" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                        {s.subtitle && <p className="text-sm text-gray-400">{s.subtitle}</p>}
                                        {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
                                        {s.imageUrl && <img src={s.imageUrl} className="h-16 w-16 rounded-lg object-cover mt-2" alt="" />}
                                        {s.buttons?.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                {s.buttons.map((b, i) => (
                                                    <span key={i} className="text-xs bg-white/10 px-3 py-1 rounded-full">{b.text} → {b.link}</span>
                                                ))}
                                            </div>
                                        )}
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
