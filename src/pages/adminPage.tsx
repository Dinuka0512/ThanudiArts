import { useNavigate } from "react-router-dom";
import { ArrowUpRight, FolderKanban, Images, Package } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import Reveal from "@/components/reveal";
import VisitorAnalytics from "@/components/visitorAnalytics";
import { Card, CardContent } from "@/components/ui/card";

const QUICK_ACTIONS = [
    { key: "gallery", title: "Gallery", subtitle: "Manage artworks", to: "/admin/gallery", icon: Images },
    { key: "products", title: "Products", subtitle: "Manage shop items", to: "/admin/products", icon: Package },
    { key: "categories", title: "Categories", subtitle: "Manage categories", to: "/admin/categories", icon: FolderKanban },
] as const;

export default function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <AdminLayout badge="Admin" title="Dashboard" subtitle="Manage your site content." active="dashboard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {QUICK_ACTIONS.map((action, i) => (
                    <Reveal key={action.key} delay={i * 100}>
                        <Card
                            onClick={() => navigate(action.to)}
                            className="group cursor-pointer border-border/80 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
                        >
                            <CardContent className="flex items-start justify-between p-6">
                                <div>
                                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <action.icon className="size-5" />
                                    </div>
                                    <h3 className="font-semibold">{action.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{action.subtitle}</p>
                                </div>
                                <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                            </CardContent>
                        </Card>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={150} className="mt-12">
                <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">Analytics</h2>
                <VisitorAnalytics />
            </Reveal>
        </AdminLayout>
    )
}