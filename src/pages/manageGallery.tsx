import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ImagePlus, Loader2, Pencil, Star, Trash2, UploadCloud, X } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ArtPost {
    id: string;
    title: string;
    imageUrl?: string;
    images?: string[];
    description?: string;
    category: string;
    featured: boolean;
}

interface Category {
    id: string;
    title: string;
    description: string;
}

export default function ManageGallery() {
    const [posts, setPosts] = useState<ArtPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newImages, setNewImages] = useState<string[]>([]);
    const [newFeatured, setNewFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editImages, setEditImages] = useState<string[]>([]);
    const [editUploading, setEditUploading] = useState(false);
    const editImageInputRef = useRef<HTMLInputElement>(null);
    const addImageInputRef = useRef<HTMLInputElement>(null);

    const firestoreSchema = {
        title: '',
        editedByAdmin: 'ThanudiArts',
    };

    const postsCollection = collection(db, "posts");

    useEffect(() => {
        getDocs(collection(db, "categories")).then((data) => {
            setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Category)));
        });
        getDocs(postsCollection).then((data) => {
            setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ArtPost)));
        });
    }, []);

    const fetchData = async () => {
        const data = await getDocs(postsCollection);
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ArtPost)));
    };

    const getFirstImage = (post: ArtPost): string =>
        post.images?.[0] || post.imageUrl || "";

    const handleAddImage = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setNewImages((prev) => [...prev, url]);
            toast.success("Image uploaded.");
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleEditImage = async (file: File) => {
        setEditUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setEditImages((prev) => [...prev, url]);
            toast.success("Image uploaded.");
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Image upload failed.");
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
        if (!newTitle.trim() || newImages.length === 0) {
            toast.error("Please upload at least one image and enter a title.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(postsCollection, {
                ...firestoreSchema,
                title: newTitle.trim(),
                description: newDescription.trim(),
                images: newImages,
                imageUrl: newImages[0],
                category: newCategory || "All",
                featured: newFeatured,
            });
            toast.success("Artwork published.");
            setNewTitle("");
            setNewDescription("");
            setNewCategory("");
            setNewImages([]);
            setNewFeatured(false);
            if (addImageInputRef.current) addImageInputRef.current.value = "";
            fetchData();
        } catch (err) {
            console.error("Add failed:", err);
            toast.error("Failed to publish. Check Firestore rules.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (post: ArtPost) => {
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditDescription(post.description || "");
        setEditCategory(post.category);
        setEditImages(post.images || (post.imageUrl ? [post.imageUrl] : []));
    };

    const handleSave = async (id: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) {
            toast.error("Title can't be empty.");
            return;
        }
        try {
            await updateDoc(doc(db, "posts", id), {
                title: editTitle.trim(),
                category: editCategory || "All",
                description: editDescription.trim(),
                images: editImages,
                imageUrl: editImages[0] || "",
            });
            toast.success("Artwork updated.");
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save. Check Firestore rules.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this artwork permanently?")) return;
        try {
            await deleteDoc(doc(db, "posts", id));
            toast.success("Artwork deleted.");
            fetchData();
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete. Check Firestore rules.");
        }
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(db, "posts", id), { featured: !current });
            fetchData();
        } catch (err) {
            console.error("Toggle failed:", err);
            toast.error("Failed to update featured status.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditCategory("");
        setEditImages([]);
    };

    return (
        <AdminLayout badge="Gallery" title="Manage Gallery" subtitle="Publish and organize artworks." active="gallery">
            <Card className="mb-8 border-border/80">
                <CardContent className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold">
                        <ImagePlus className="size-4 text-foreground" />
                        Add New Artwork
                    </h3>
                    <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="art-title">Title</Label>
                            <Input
                                id="art-title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Artwork title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="art-description">Description</Label>
                            <Textarea
                                id="art-description"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Short description of the artwork"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="art-category">Category</Label>
                            <Select value={newCategory} onValueChange={setNewCategory}>
                                <SelectTrigger id="art-category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.title}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Images</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    ref={addImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        files.forEach((f) => handleAddImage(f));
                                        e.target.value = "";
                                    }}
                                />
                                {uploading && (
                                    <span className="shrink-0 text-sm text-muted-foreground">
                                        <Loader2 className="mr-1 inline size-3.5 animate-spin" />
                                        Uploading…
                                    </span>
                                )}
                            </div>
                            {newImages.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {newImages.map((url, i) => (
                                        <div key={url} className="group relative">
                                            <img src={url} className="h-16 w-16 rounded-lg border object-cover" alt="" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition group-hover:opacity-100"
                                                title="Remove image"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between gap-4 md:col-span-2">
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <Switch checked={newFeatured} onCheckedChange={setNewFeatured} />
                                <Star className={newFeatured ? "size-4 fill-current text-yellow-400" : "size-4 text-muted-foreground"} />
                                Mark as Featured
                            </label>
                            <Button type="submit" disabled={loading || newImages.length === 0}>
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="size-4" />
                                        Publish Artwork
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <h3 className="mb-4 font-semibold">Current Gallery</h3>
            {posts.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">No artworks yet. Add one above.</p>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden border-border/80">
                        {editingId === post.id ? (
                            <form onSubmit={(e) => handleSave(post.id, e)} className="space-y-3 p-4">
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Title"
                                    autoFocus
                                />
                                <Textarea
                                    className="resize-none"
                                    rows={2}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                />
                                <Select value={editCategory} onValueChange={setEditCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.title}>
                                                {cat.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Images</p>
                                    <Input
                                        ref={editImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="file:text-xs"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            files.forEach((f) => handleEditImage(f));
                                            e.target.value = "";
                                        }}
                                    />
                                    {editUploading && (
                                        <p className="text-xs text-muted-foreground">
                                            <Loader2 className="mr-1 inline size-3 animate-spin" />
                                            Uploading…
                                        </p>
                                    )}
                                    {editImages.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {editImages.map((url, i) => (
                                                <div key={url} className="group relative">
                                                    <img src={url} className="h-12 w-12 rounded border object-cover" alt="" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEditImage(i)}
                                                        className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition group-hover:opacity-100"
                                                        title="Remove image"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" size="sm">Save</Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                                        <X className="size-4" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="h-48 overflow-hidden">
                                    <img src={getFirstImage(post)} className="h-full w-full object-cover" alt={post.title} loading="lazy" decoding="async" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold">{post.title}</h4>
                                            {post.description && (
                                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.description}</p>
                                            )}
                                            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="secondary" className="rounded-full">{post.category}</Badge>
                                                {(post.images?.length || (post.imageUrl ? 1 : 0)) > 1 && (
                                                    <span>{post.images?.length || (post.imageUrl ? 1 : 0)} images</span>
                                                )}
                                                {post.featured && (
                                                    <span className="flex items-center gap-1 text-yellow-500">
                                                        <Star className="size-3 fill-current" />
                                                        Featured
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex shrink-0 gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={post.featured ? "text-yellow-500 hover:text-yellow-500" : "text-muted-foreground"}
                                                onClick={() => handleToggleFeatured(post.id, post.featured)}
                                                title={post.featured ? "Unmark featured" : "Mark featured"}
                                            >
                                                <Star className={post.featured ? "size-4 fill-current" : "size-4"} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} title="Edit">
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(post.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </AdminLayout>
    )
}