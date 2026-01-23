import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Users, Mail, Loader2, RefreshCw } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  active: boolean;
  subscriptionDate: string;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribers");
      
      if (error) throw error;
      
      setSubscribers(data.subscribers || []);
      setStats({ total: data.total || 0, active: data.active || 0 });
    } catch (error: any) {
      console.error("Error fetching subscribers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los suscriptores.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El asunto y contenido son requeridos.",
      });
      return;
    }

    setSending(true);
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
            .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌍 Resonancia Schumann</h1>
          </div>
          <div class="content">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>Has recibido este email porque estás suscrito a Resonancia Schumann LATAM.</p>
          </div>
        </body>
        </html>
      `;

      const { data, error } = await supabase.functions.invoke("newsletter-send", {
        body: { subject, htmlContent, textContent: content },
      });

      if (error) throw error;

      toast({
        title: "¡Newsletter enviado!",
        description: `Enviado a ${data.sent} suscriptores.${data.failed > 0 ? ` (${data.failed} fallidos)` : ""}`,
      });

      setSubject("");
      setContent("");
    } catch (error: any) {
      console.error("Error sending newsletter:", error);
      toast({
        variant: "destructive",
        title: "Error al enviar",
        description: error.message || "No se pudo enviar el newsletter.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Admin Newsletter</h1>
              <p className="text-sm text-muted-foreground">Gestiona suscriptores y envía newsletters</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total suscriptores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Suscriptores activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Send className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">—</p>
                  <p className="text-sm text-muted-foreground">Emails enviados hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList>
            <TabsTrigger value="compose">Redactar Newsletter</TabsTrigger>
            <TabsTrigger value="subscribers">Suscriptores</TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <Card>
              <CardHeader>
                <CardTitle>Nuevo Newsletter</CardTitle>
                <CardDescription>
                  Redacta y envía un newsletter a todos los suscriptores activos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Asunto</label>
                  <Input
                    placeholder="Ej: 🌍 Interpretación Schumann - 23 de Enero"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Contenido</label>
                  <Textarea
                    placeholder="Escribe el contenido del newsletter aquí..."
                    className="min-h-[300px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setSubject(""); setContent(""); }}>
                    Limpiar
                  </Button>
                  <Button onClick={handleSendNewsletter} disabled={sending || stats.active === 0}>
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar a {stats.active} suscriptores
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Suscriptores</CardTitle>
                    <CardDescription>
                      Todos los suscriptores registrados en el newsletter.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchSubscribers} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : subscribers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay suscriptores registrados aún.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.email}</TableCell>
                          <TableCell>{sub.name || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={sub.active ? "default" : "secondary"}>
                              {sub.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sub.subscriptionDate || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminNewsletter;
