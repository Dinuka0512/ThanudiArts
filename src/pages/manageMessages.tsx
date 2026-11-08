import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { CalendarDays, Loader2, Mail, MailOpen, MessageSquare, Reply, Trash2 } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

export default function ManageMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [selected, setSelected] = useState<Message | null>(null);

    const messagesCollection = collection(db, "messages");

    useEffect(() => {
        getDocs(messagesCollection).then((snap) => {
            const msgs = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Message));
            msgs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
            setMessages(msgs);
            setPageLoading(false);
        });
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this message?")) {
            try {
                await deleteDoc(doc(db, "messages", id));
                setMessages((prev) => prev.filter((m) => m.id !== id));
                if (selected?.id === id) setSelected(null);
            } catch (err) {
                console.error(err);
                alert("Failed to delete.");
            }
        }
    };

    const formatDate = (value?: string) =>
        value ? new Date(value).toLocaleDateString() : "";

    const formatDateTime = (value?: string) =>
        value ? new Date(value).toLocaleString() : "";

    if (pageLoading) {
        return (
            <AdminLayout badge="Messages" title="Messages" subtitle="Contact form submissions." active="messages">
                <div className="flex h-full min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="size-8 animate-spin text-foreground" />
                        <p className="text-sm text-muted-foreground">Loading…</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout badge="Messages" title="Messages" subtitle="Contact form submissions from visitors." active="messages">
            {messages.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No messages yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <Card
                                key={msg.id}
                                onClick={() => setSelected(msg)}
                                className={`cursor-pointer border-border/80 transition ${
                                    selected?.id === msg.id ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="flex items-center gap-2 font-semibold">
                                                <MessageSquare className="size-4 text-foreground" />
                                                <span className="truncate">{msg.name}</span>
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">{msg.email}</p>
                                        </div>
                                        <span className="ml-2 flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                            <CalendarDays className="size-3" />
                                            {formatDate(msg.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{msg.message}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div>
                        {selected ? (
                            <Card className="border-border/80">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                                                <MailOpen className="size-5 text-foreground" />
                                                {selected.name}
                                            </h3>
                                            <a href={`mailto:${selected.email}`} className="mt-1 inline-block text-sm text-foreground hover:underline">
                                                {selected.email}
                                            </a>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {formatDateTime(selected.createdAt)}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="rounded-full">Inbox</Badge>
                                    </div>
                                    <div className="rounded-xl bg-muted/60 p-4">
                                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">{selected.message}</p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button asChild>
                                            <a href={`mailto:${selected.email}?subject=Re: Thanudi Arts inquiry`}>
                                                <Reply className="size-4" />
                                                Reply via Email
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(selected.id)}
                                        >
                                            <Trash2 className="size-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                                <p className="flex items-center gap-2 text-sm">
                                    <Mail className="size-4" />
                                    Select a message to view
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}