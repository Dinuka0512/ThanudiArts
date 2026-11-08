import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Loader2, Package, PackagePlus, Pencil, Star, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

    const addImageInputRef = useRef<HTMLInputElement>(null);
    const editImageInputRef = useRef<HTMLInputElement>(null);

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

    const handleAddImage = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setNewImages((prev) => [...prev, url]);
            toast.success("Image uploaded.");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed.");
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
            console.error(err);
            toast.error("Upload failed.");
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
        if (!newName || !newPrice || newImages.length === 0)
            return toast.error("Please fill all fields and upload at least one image");
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
            toast.success("Product added.");
            setNewName("");
            setNewPrice("");
            setNewDescription("");
            setNewImages([]);
            setNewFeatured(false);
            if (addImageInputRef.current) addImageInputRef.current.value = "";
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add. Check Firestore rules.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                toast.success("Product deleted.");
                fetchProducts();
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete. Check Firestore rules.");
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
            const update = {
                name: editName.trim(),
                price: editPrice.trim(),
                type: editType,
                description: editDescription.trim(),
                images: editImages,
            };
            await updateDoc(doc(db, "products", id), update);
            toast.success("Product updated.");
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save. Check Firestore rules.");
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
            toast.error("Failed to update. Check Firestore rules.");
        }
    };

    const getFirstImage = (product: Product): string => {
        if (product.images && product.images.length > 0) return product.images[0];
        if (product.imageUrl) return product.imageUrl;
        return "";
    };

    const pageLoader = () => (
        <div className="flex h-full min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-8 animate-spin text-foreground" />
                <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
        </div>
    );

    if (pageLoading) return pageLoader();

    return (
        <AdminLayout badge="Products" title="Manage Products" subtitle="Add, edit, or remove shop products." active="products">
            <Card className="mb-8 border-border/80">
                <CardContent className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold">
                        <PackagePlus className="size-4 text-foreground" />
                        Add New Product
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Product name</Label>
                                <Input
                                    placeholder="Product name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input
                                    placeholder="Price (LKR 2,500)"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Type / Category</Label>
                                <Select value={newType} onValueChange={setNewType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={categories.length === 0 ? "No categories" : "Select type"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.title}>
                                                {cat.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Product description"
                                rows={3}
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Images</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    ref={addImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleAddImage(f);
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
                                        <div key={i} className="group relative">
                                            <img src={url} className="h-16 w-16 rounded-lg border object-cover" alt="" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition group-hover:opacity-100"
                                                title="Remove"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                                    <Package className="size-4" />
                                    Add Product
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <h3 className="mb-4 font-semibold">Current Products</h3>
            {products.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">No products yet. Add one above.</p>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-border/80">
                        {editingId === product.id ? (
                            <form onSubmit={(e) => handleSave(product.id, e)} className="space-y-3 p-4">
                                <Input
                                    className="text-sm"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Name"
                                    autoFocus
                                />
                                <Input
                                    className="text-sm"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    placeholder="Price"
                                />
                                <Select value={editType} onValueChange={setEditType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.title}>
                                                {cat.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Textarea
                                    className="resize-none text-sm"
                                    rows={2}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                />
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Images</p>
                                    <Input
                                        ref={editImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="file:text-xs"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleEditImage(f);
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
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {editImages.map((url, i) => (
                                                <div key={i} className="group relative">
                                                    <img src={url} className="h-12 w-12 rounded border object-cover" alt="" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEditImage(i)}
                                                        className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition group-hover:opacity-100"
                                                        title="Remove"
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
                                    <img src={getFirstImage(product)} className="h-full w-full object-cover" alt={product.name} loading="lazy" decoding="async" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground">{product.type}</p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">{product.price}</p>
                                            {(product.images?.length || (product.imageUrl ? 1 : 0)) > 1 && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {product.images?.length || (product.imageUrl ? 1 : 0)} images
                                                </p>
                                            )}
                                        </div>
                                        <div className="ml-2 flex shrink-0 gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={product.featured ? "text-yellow-500 hover:text-yellow-500" : "text-muted-foreground"}
                                                onClick={() => handleToggleFeatured(product.id, product.featured)}
                                                title={product.featured ? "Unmark featured" : "Mark featured"}
                                            >
                                                <Star className={product.featured ? "size-4 fill-current" : "size-4"} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} title="Edit">
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(product.id)}
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