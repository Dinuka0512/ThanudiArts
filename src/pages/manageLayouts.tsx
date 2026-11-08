import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { LayoutTemplate, Loader2, Pencil, Plus, Power, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

type SetUrlState = (url: string) => void;
type SetButtonsState = (b: Button[]) => void;

export default function ManageLayouts() {
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

    const addImageInputRef = useRef<HTMLInputElement>(null);
    const editImageInputRef = useRef<HTMLInputElement>(null);

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

    const handleUploadImage = async (file: File, setUrl: SetUrlState) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setUrl(url);
        } catch (err) {
            console.error(err);
            toast.error("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const addButton = (list: Button[], setList: SetButtonsState) => {
        setList([...list, { text: "", link: "" }]);
    };

    const removeButton = (idx: number, list: Button[], setList: SetButtonsState) => {
        setList(list.filter((_, i) => i !== idx));
    };

    const updateButton = (idx: number, field: keyof Button, val: string, list: Button[], setList: SetButtonsState) => {
        const updated = list.map((b, i) => (i === idx ? { ...b, [field]: val } : b));
        setList(updated);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() && !newSubtitle.trim() && !newDesc.trim() && !newImageUrl)
            return toast.error("Fill at least one field");
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
            toast.success("Section added.");
            setNewTitle(""); setNewSubtitle(""); setNewDesc(""); setNewImageUrl(""); setNewButtons([]);
            setNewOrder(sections.length);
            if (addImageInputRef.current) addImageInputRef.current.value = "";
            refreshSections();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add. Check Firestore rules.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this section?")) {
            try {
                await deleteDoc(doc(db, "layouts", id));
                toast.success("Section deleted.");
                refreshSections();
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete. Check Firestore rules.");
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
            const update: Record<string, unknown> = {
                subtitle: editSubtitle.trim(),
                description: editDesc.trim(),
                buttons: editButtons.filter(b => b.text.trim()),
                active: editActive,
                order: editOrder,
            };
            if (editTitle.trim()) update.title = editTitle.trim();
            if (editImageUrl.trim()) update.imageUrl = editImageUrl.trim();
            await updateDoc(doc(db, "layouts", id), update);
            toast.success("Section updated.");
            setEditingId(null);
            refreshSections();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save. Check Firestore rules.");
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
            toast.error("Failed to update. Check Firestore rules.");
        }
    };

    const ButtonEditor = ({ buttons, setButtons }: { buttons: Button[]; setButtons: SetButtonsState }) => (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Buttons (optional)</span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addButton(buttons, setButtons)}
                >
                    <Plus className="size-3.5" />
                    Add Button
                </Button>
            </div>
            {buttons.map((btn, i) => (
                <div key={i} className="mb-2 flex gap-2">
                    <Input
                        placeholder="Button text"
                        value={btn.text}
                        onChange={(e) => updateButton(i, "text", e.target.value, buttons, setButtons)}
                    />
                    <Input
                        placeholder="Link (e.g. /shop)"
                        value={btn.link}
                        onChange={(e) => updateButton(i, "link", e.target.value, buttons, setButtons)}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeButton(i, buttons, setButtons)}
                        className="text-destructive hover:text-destructive"
                        title="Remove"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ))}
        </div>
    );

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
        <AdminLayout badge="Sections" title="Page Sections" subtitle="Content blocks for the Explore page. All fields are optional." active="sections">
            <Card className="mb-8 border-border/80">
                <CardContent className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold">
                        <LayoutTemplate className="size-4 text-foreground" />
                        New Section
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <Input placeholder="Title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                        <Input placeholder="Subtitle (optional)" value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} />
                        <Textarea placeholder="Description (optional)" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                        <div className="flex items-center gap-3">
                            <Input
                                ref={addImageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadImage(f, setNewImageUrl);
                                }}
                            />
                            {uploading && (
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    <Loader2 className="mr-1 inline size-3.5 animate-spin" />
                                    Uploading…
                                </span>
                            )}
                            {newImageUrl && !uploading && (
                                <img src={newImageUrl} className="h-12 w-12 shrink-0 rounded-lg border object-cover" alt="" />
                            )}
                        </div>

                        <ButtonEditor buttons={newButtons} setButtons={setNewButtons} />

                        <div className="flex items-end gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-order">Order</Label>
                                <Input
                                    id="new-order"
                                    type="number"
                                    className="w-24"
                                    placeholder="Order"
                                    value={newOrder}
                                    onChange={(e) => setNewOrder(Number(e.target.value))}
                                />
                            </div>
                            <Button type="submit">Add Section</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <h3 className="mb-4 font-semibold">Current Sections</h3>
            {sections.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">No sections yet. Add one above.</p>
            )}
            <div className="space-y-4">
                {sections.map((s) => (
                    <Card key={s.id} className="overflow-hidden border-border/80">
                        {editingId === s.id ? (
                            <form onSubmit={(e) => handleSave(s.id, e)} className="space-y-3 p-4">
                                <Input placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus />
                                <Input placeholder="Subtitle" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} />
                                <Textarea rows={2} placeholder="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                                <div className="flex items-center gap-2">
                                    <Input
                                        ref={editImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="file:text-xs"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleUploadImage(f, setEditImageUrl);
                                        }}
                                    />
                                    {uploading && (
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            <Loader2 className="mr-1 inline size-3 animate-spin" />
                                            Uploading…
                                        </span>
                                    )}
                                    {editImageUrl && !uploading && (
                                        <img src={editImageUrl} className="h-10 w-10 shrink-0 rounded-lg border object-cover" alt="" />
                                    )}
                                </div>
                                <ButtonEditor buttons={editButtons} setButtons={setEditButtons} />
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={editOrder}
                                            onChange={(e) => setEditOrder(Number(e.target.value))}
                                        />
                                        <Label htmlFor="edit-active" className="cursor-pointer">Active</Label>
                                        <Switch id="edit-active" checked={editActive} onCheckedChange={setEditActive} />
                                    </div>
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
                            <div className="p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${s.active ? "bg-green-400" : "bg-muted-foreground"}`} />
                                        <h4 className="font-semibold">{s.title || "(no title)"}</h4>
                                        <Badge variant="secondary" className="rounded-full text-xs">
                                            Order: {s.order}
                                        </Badge>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={s.active ? "text-green-500 hover:text-green-500" : "text-muted-foreground"}
                                            onClick={() => handleToggleActive(s.id, s.active)}
                                            title={s.active ? "Deactivate" : "Activate"}
                                        >
                                            <Power className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(s)} title="Edit">
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(s.id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                {s.subtitle && <p className="text-sm text-muted-foreground">{s.subtitle}</p>}
                                {s.description && <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>}
                                {s.imageUrl && (
                                    <img src={s.imageUrl} className="mt-2 h-16 w-16 rounded-lg border object-cover" alt="" loading="lazy" decoding="async" />
                                )}
                                {s.buttons?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {s.buttons.map((b, i) => (
                                            <Badge key={i} variant="secondary" className="rounded-full">
                                                {b.text} → {b.link}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </AdminLayout>
    )
}