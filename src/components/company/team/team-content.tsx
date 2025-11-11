import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCompanyStore } from "@/stores";
import Competences from "./competences";
import Feedbacks from "./feedbacks";

export function TeamContent({ data }: { data: any }) {
  const company = useCompanyStore();

  return (
    <Tabs defaultValue="infos" className="space-y-5 pb-5">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="infos">Informações</TabsTrigger>
        <TabsTrigger value="competences">Competências</TabsTrigger>
        <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
      </TabsList>

      <TabsContent value="infos" className="max-h-[23.4rem] space-y-5 overflow-y-scroll scrollbar-hidden">
        <Card className="min-h-[28.4rem] mb-2">
          <CardHeader className="flex-col gap-1">
            <CardTitle>Informações</CardTitle>
            <CardDescription>Visualize as principais informações do usuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input disabled value={data?.name} className="disabled:opacity-100" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input disabled value={data?.email} className="disabled:opacity-100" />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input disabled value={data?.cpf} className="disabled:opacity-100" />
              </div>
              <div className="space-y-2">
                <Label>Salário</Label>
                <Input disabled value={data?.salary.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} className="disabled:opacity-100" />
              </div>
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Input 
                  disabled 
                  value={company.current ? company.current?.departments.find(department => department.id === data?.department)?.name : ""}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Cargo</Label>
                <Input
                  disabled
                  value={company.current ? company.current?.roles.find(role => role.id === data?.role)?.name : ""}
                  className="disabled:opacity-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Bio</Label>
              <Textarea
                id="description"
                placeholder="Nada por aqui..."
                value={data?.description}
                disabled
                className="disabled:opacity-100"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Competences 
        data={data} 
      />

      <Feedbacks 
        data={data}
      />

      {/* <TabsContent value="feedbacks" className="space-y-6">
        <Card>
          <CardHeader className="flex-col gap-1">
            <CardTitle>Feedbacks</CardTitle>
            <CardDescription>Visualize e adicione feedbacks para um membro da equipe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Password</Label>
                  <p className="text-muted-foreground text-sm">Last changed 3 months ago</p>
                </div>
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    Enabled
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Login Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Active Sessions</Label>
                  <p className="text-muted-foreground text-sm">
                    Manage devices that are logged into your account
                  </p>
                </div>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  View Sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent> */}
    </Tabs>
  );
}