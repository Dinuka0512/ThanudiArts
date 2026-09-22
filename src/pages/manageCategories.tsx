import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Category {
    id: string;
    title: string;
    description: string;
}

export default function ManageCategories() {
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
        });
    }, []);

    const fetchData = async () => {
        const data = await getDocs(categoriesCollection);
        setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Category)));
    };

    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newTitle.trim()) {
            toast.error("Please enter a category title.");
            return;
        }
        try {
            await addDoc(categoriesCollection, { title: newTitle.trim(), description: newDesc.trim() });
            toast.success("Category added.");
            setNewTitle("");
            setNewDesc("");
            fetchData();
        } catch (err) {
            console.error("Add failed:", err);
            toast.error("Failed to add category. Check Firestore rules.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            await deleteDoc(doc(db, "categories", id));
            toast.success("Category deleted.");
            fetchData();
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete. Check Firestore rules.");
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditTitle(cat.title);
        setEditDesc(cat.description);
    };

    const handleSave = async (id: string, e?: React.FormEvent) => {
        e?.preventDefault();
        if (!editTitle.trim()) {
            toast.error("Title can't be empty.");
            return;
        }
        try {
            await updateDoc(doc(db, "categories", id), { title: editTitle.trim(), description: editDesc.trim() });
            toast.success("Category updated.");
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save. Check Firestore rules.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDesc("");
    };

    return (
        <AdminLayout title="Manage Categories" subtitle="Add, edit, or remove art categories." active="categories">
            <Card className="mb-8 border-border/80">
                <CardContent className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold">
                        <Plus className="size-4 text-primary" />
                        Add New Category
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <Input
                            ref={addTitleRef}
                            placeholder="Category title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), addDescRef.current?.focus())
                            }
                        />
                        <Textarea
                            ref={addDescRef}
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
                        <Button type="submit">Add Category</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {categories.length === 0 && (
                    <p className="py-10 text-center text-muted-foreground">No categories yet. Add one above.</p>
                )}
                {categories.map((cat) => (
                    <Card key={cat.id} className="border-border/80">
                        <CardContent className="p-5">
                            {editingId === cat.id ? (
                                <form onSubmit={(e) => handleSave(cat.id, e)} className="space-y-3">
                                    <Input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        autoFocus
                                    />
                                    <Textarea
                                        rows={2}
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" size="sm">Save</Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                                            <X className="size-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold">{cat.title}</h4>
                                        {cat.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                                        )}
                                    </div>
                                    <div className="ml-4 flex shrink-0 gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} title="Edit">
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id)} title="Delete">
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    )
}