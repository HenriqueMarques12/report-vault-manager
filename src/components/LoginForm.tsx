
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor insira um email válido.' }),
  password: z.string().min(1, { message: 'Senha é obrigatória.' }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const { login, loginWithMicrosoft } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Email ou senha inválidos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    
    try {
      await loginWithMicrosoft();
      toast.success('Login com Microsoft realizado com sucesso!');
    } catch (error) {
      toast.error('Falha ao entrar com Microsoft');
      console.error(error);
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-primary p-3 rounded-full">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl">Central de Relatórios</CardTitle>
        <CardDescription>Entre para acessar seus relatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleMicrosoftLogin}
              disabled={isMicrosoftLoading}
            >
              {isMicrosoftLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022"/>
                  <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00"/>
                  <path d="M11.4 12.6H2V22h9.4v-9.4Z" fill="#00A4EF"/>
                  <path d="M22 12.6h-9.4V22H22v-9.4Z" fill="#FFB900"/>
                </svg>
              )}
              Microsoft
            </Button>
            
            <div className="text-center text-sm text-muted-foreground pt-2">
              <p>Contas de demonstração:</p>
              <p>admin@exemplo.com.br / senha</p>
              <p>usuario@exemplo.com.br / senha</p>
              <p>Ou clique no botão Microsoft para entrar</p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
