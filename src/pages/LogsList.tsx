
import React, { useState, useMemo } from 'react';
import { useAuth, LogEntry } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LogsList: React.FC = () => {
  const { logs, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Ordenar logs do mais recente para o mais antigo
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [logs]);

  // Aplicar filtros
  const filteredLogs = useMemo(() => {
    return sortedLogs.filter(log => {
      // Filtro por texto
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          log.userName.toLowerCase().includes(query) || 
          log.action.toLowerCase().includes(query) ||
          (log.resourceName && log.resourceName.toLowerCase().includes(query));
        
        if (!matchesQuery) return false;
      }
      
      // Filtro por tipo
      if (filterType !== 'all') {
        if (filterType === 'login' && !log.action.toLowerCase().includes('login')) return false;
        if (filterType === 'logout' && !log.action.toLowerCase().includes('logout')) return false;
        if (filterType === 'view' && !log.action.toLowerCase().includes('visualiz')) return false;
        if (filterType === 'download' && !log.action.toLowerCase().includes('download')) return false;
      }
      
      return true;
    });
  }, [sortedLogs, searchQuery, filterType]);

  // Formatar data para exibição
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Você não tem permissão para acessar os registros de acesso.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registros de Acesso</h1>
        <p className="text-muted-foreground">Monitore as atividades dos usuários no sistema.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar registros..."
            className="pl-10 w-full"
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value)}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="view">Visualizações</SelectItem>
              <SelectItem value="download">Downloads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Histórico de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Recurso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.resourceName || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Nenhum registro de atividade encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsList;
