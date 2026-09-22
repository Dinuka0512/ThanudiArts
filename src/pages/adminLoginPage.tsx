import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
                <Card className="w-full border-border/80 shadow-xl">
                    <CardContent className="p-8 sm:p-10">
                    <div className="mb-8 text-center">
                        <ThemeLogo className="mx-auto h-14 w-auto" />
                        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to manage Thanudi Arts
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Email</Label>
                            <Input
                                id="admin-email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Password</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full" size="lg">
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Authenticating…
                                </>
                            ) : (
                                <>
                                    <LogIn className="size-4" />
                                    Enter Dashboard
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="size-3.5" />
                        Authorized access only
                    </div>
                </CardContent>
                </Card>
            </Reveal>
        </div>
    )
}