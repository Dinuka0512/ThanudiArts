import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { db } from "@/firebase";
import PageHeader from "@/components/pageHeader";
import Reveal from "@/components/reveal";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "thanudiarts@gmail.com", href: "mailto:thanudiarts@gmail.com" },
  { icon: Phone, label: "Phone", value: "+94 77 123 4567", href: "tel:+94771234567" },
  { icon: MapPin, label: "Location", value: "Sri Lanka", href: undefined },
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
            <SEO
                title="Contact"
                description="Contact Thanudi Arts for artwork enquiries, custom commissions, collaborations, or questions about original pieces from the Sri Lankan studio."
                path="/contact"
            />
            <PageHeader
                title={<>Let&apos;s make <span className="editorial">something.</span></>}
                subtitle="Have a question, a custom request, or a collaboration in mind? I'd love to hear from you."
            />

            <section className="py-16 md:py-24">
                <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 md:grid-cols-12 md:gap-8">
                    {/* INFO */}
                    <Reveal className="md:col-span-5">
                        <h2 className="text-3xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-4xl">
                            Tell me about
                            <br />
                            <span className="editorial">your idea.</span>
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Whether it&apos;s a portrait, a gift, an illustration or a full commission,
                            every project starts with a conversation.
                        </p>

                        <div className="mt-10 border-t border-border">
                            {CONTACT_INFO.map((item) => {
                                const content = (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <span className="flex size-10 shrink-0 items-center justify-center border border-border bg-card text-foreground">
                                                <item.icon className="size-4" />
                                            </span>
                                            <div>
                                                <p className="eyebrow">{item.label}</p>
                                                <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
                                            </div>
                                        </div>
                                        {item.href && (
                                            <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                                        )}
                                    </>
                                );

                                return item.href ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="group flex items-center justify-between gap-4 border-b border-border py-5 transition-colors"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={item.label} className="flex items-center justify-between gap-4 border-b border-border py-5">
                                        {content}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex items-start gap-3">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                                Custom artwork and collaborations are always welcome. The studio
                                usually responds within 24 hours.
                            </p>
                        </div>
                    </Reveal>

                    {/* FORM */}
                    <Reveal delay={120} className="md:col-span-7">
                        <div className="border border-border bg-card p-6 sm:p-10">
                            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                                <p className="eyebrow">All fields required</p>
                            </div>

                            <h3 className="mt-7 text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                                Send a message
                            </h3>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-7">
                                <div className="grid gap-7 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="contact-name" className="eyebrow mb-2">
                                            Name
                                        </Label>
                                        <Input
                                            id="contact-name"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 text-sm shadow-none focus-visible:border-foreground focus-visible:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contact-email" className="eyebrow mb-2">
                                            Email
                                        </Label>
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 text-sm shadow-none focus-visible:border-foreground focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="contact-message" className="eyebrow mb-2">
                                        Message
                                    </Label>
                                    <Textarea
                                        id="contact-message"
                                        rows={5}
                                        placeholder="Tell me about your idea…"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="min-h-32 rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm shadow-none focus-visible:border-foreground focus-visible:ring-0"
                                    />
                                </div>

                                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
                                        Your details are only used to reply to this enquiry.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={sending}
                                        className="h-12 w-full rounded-none px-7 text-[10px] uppercase tracking-[0.18em] sm:w-auto"
                                    >
                                        {sending ? "Sending…" : "Send message"}
                                        <Send className="size-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}
