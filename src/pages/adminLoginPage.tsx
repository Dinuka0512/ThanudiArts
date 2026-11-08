import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, Lock, LogIn } from "lucide-react";
import { auth } from "@/firebase";
import ThemeLogo from "@/components/themeLogo";
import { AmbientBackground } from "@/components/ambientBackground";
import Reveal from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u && !sessionStorage.getItem("thanudi_admin_login_at")) {
                sessionStorage.setItem("thanudi_admin_login_at", String(Date.now()));
            }
            if (u) navigate("/admin/dashboard", { replace: true });
        });
        return unsub;
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            sessionStorage.setItem("thanudi_admin_login_at", String(Date.now()));
            navigate("/admin/dashboard");
        } catch {
            setError("Access denied: invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
            <AmbientBackground />
            <Reveal className="relative z-10 w-full max-w-md">
                <p className="eyebrow mb-4 text-center">Studio access</p>
                <Card className="w-full">
                    <CardContent className="p-7 sm:p-10">
                        <div className="mb-8 border-b border-border pb-7 text-center">
                            <ThemeLogo className="mx-auto h-10 w-auto" />
                            <h2 className="mt-6 text-3xl font-medium tracking-[-0.04em]">
                                Admin login
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sign in to manage Thanudi Arts
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-xs text-destructive">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <Label htmlFor="admin-email" className="eyebrow mb-2">
                                    Email
                                </Label>
                                <Input
                                    id="admin-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 text-sm shadow-none focus-visible:border-foreground focus-visible:ring-0"
                                />
                            </div>
                            <div>
                                <Label htmlFor="admin-password" className="eyebrow mb-2">
                                    Password
                                </Label>
                                <Input
                                    id="admin-password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 text-sm shadow-none focus-visible:border-foreground focus-visible:ring-0"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 w-full rounded-none text-[10px] uppercase tracking-[0.18em]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Authenticating…
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="size-4" />
                                        Enter dashboard
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 flex items-center gap-2 border-t border-border pt-5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            <Lock className="size-3.5" />
                            Authorized access only
                        </div>
                    </CardContent>
                </Card>
            </Reveal>
        </div>
    )
}
