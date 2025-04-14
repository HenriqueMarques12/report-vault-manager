
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart4, FileText, Users, Clock } from 'lucide-react';
import { useReports } from '@/contexts/ReportContext';
import { useAuth } from '@/contexts/AuthContext';
import ReportCard from '@/components/ReportCard';

const Dashboard: React.FC = () => {
  const { reports } = useReports();
  const { currentUser } = useAuth();
  
  // Filter reports by user access
  const accessibleReports = reports.filter(report => 
    report.accessRoles.includes(currentUser?.role || 'user')
  );
  
  // Get recent reports (last 3)
  const recentReports = [...accessibleReports]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
        <p className="text-muted-foreground">Bem-vindo ao seu painel de gerenciamento de relatórios.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {accessibleReports.length} disponíveis para você
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(reports.map(r => r.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Tipos diferentes de relatórios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acesso de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.accessRoles.includes('user')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Relatórios disponíveis para usuários comuns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.length > 0 
                ? new Date(Math.max(...reports.map(r => new Date(r.updatedAt).getTime())))
                  .toLocaleDateString('pt-BR')
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Data da atualização mais recente
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Relatórios Atualizados Recentemente</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
        {recentReports.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum relatório disponível para exibição.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
