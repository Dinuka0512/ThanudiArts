import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { db } from "@/firebase";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "thanudiarts@gmail.com" },
  { icon: Phone, label: "Phone", value: "+94 77 123 4567" },
  { icon: MapPin, label: "Location", value: "Sri Lanka" },
]

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) return;
        setSending(true);
        let firestoreOk = false;
        try {
            await addDoc(collection(db, "messages"), {
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                createdAt: new Date().toISOString(),
            });
            firestoreOk = true;
        } catch (err) {
            console.error("Firestore error:", err);
            toast.error("Message saved but couldn't reach the database.");
        }

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                { name: name.trim(), email: email.trim(), message: message.trim(), time: new Date().toLocaleString(), reply_to: email.trim() },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
        } catch (err) {
            console.error("EmailJS error:", err);
            if (firestoreOk) {
                toast.warning("Message saved! But the email notification failed.");
            }
        }

        if (firestoreOk) {
            toast.success("Message sent! I'll get back to you soon.");
            setName("");
            setEmail("");
            setMessage("");
        }
        setSending(false);
    };

    return (
        <div className="bg-background">
            <PageHeader
                eyebrow="Contact"
                title="Let's talk"
                subtitle="Have a question, custom request, or collaboration idea? I'd love to hear from you."
            />

            <section className="py-8 pb-24">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
                    {/* INFO */}
                    <Reveal className="space-y-6">
                        <h2 className="font-display text-2xl font-semibold tracking-tight">
                            Get in touch
                        </h2>
                        <div className="grid gap-4">
                            {CONTACT_INFO.map((item, i) => (
                                <Reveal key={item.label} delay={i * 100}>
                                    <Card className="border-border/80 shadow-sm">
                                        <CardContent className="flex items-center gap-4 p-5">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <item.icon className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                                    {item.label}
                                                </p>
                                                <p className="font-medium text-foreground">{item.value}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Reveal>
                            ))}
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                            I usually respond within 24 hours. Custom artwork and collaborations
                            are always welcome.
                        </p>
                    </Reveal>

                    {/* FORM */}
                    <Reveal delay={120}>
                        <Card className="border-border/80 shadow-sm">
                            <CardContent className="p-6 sm:p-8">
                                <h3 className="font-display text-2xl font-semibold tracking-tight">
                                    Send a message
                                </h3>
                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-name">Name</Label>
                                            <Input
                                                id="contact-name"
                                                placeholder="Your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-email">Email</Label>
                                            <Input
                                                id="contact-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-message">Message</Label>
                                        <Textarea
                                            id="contact-message"
                                            rows={6}
                                            placeholder="Tell me about your idea…"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={sending} className="w-full rounded-full sm:w-auto">
                                        {sending ? "Sending…" : "Send message"}
                                        <Send className="size-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}