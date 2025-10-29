import { useState } from "react";
import { Shield, Key, MoreHorizontal } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCompanyStore } from "@/stores";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import Competences from "./competences";

export function TeamContent({ data }: { data: any }) {
  const company = useCompanyStore();

  return (
    <Tabs defaultValue="infos" className="space-y-5 pb-5">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="infos">Informações</TabsTrigger>
        <TabsTrigger value="competences">Competências</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="infos" className="max-h-[28.4rem] space-y-5 overflow-y-scroll">
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

      <Competences data={data} />

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and authentication.</CardDescription>
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
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-muted-foreground text-sm">
                    Get a weekly summary of your activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-muted-foreground text-sm">
                    Important security notifications (always enabled)
                  </p>
                </div>
                <Switch checked disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}