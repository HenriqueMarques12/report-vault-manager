
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useReports, ReportCategory } from '@/contexts/ReportContext';
import { useAuth } from '@/contexts/AuthContext';
import ReportCard from '@/components/ReportCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

const ReportList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const { reports } = useReports();
  const { currentUser, addLogEntry } = useAuth();

  // Registrar visualização da página
  useEffect(() => {
    addLogEntry('Visualizou página de relatórios');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar relatórios por categoria, termo de pesquisa e acesso do usuário
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Verificar acesso do usuário
      if (!report.accessRoles.includes(currentUser?.role || 'user')) {
        return false;
      }
      
      // Verificar filtro por categoria
      if (selectedCategory !== 'all' && report.category !== selectedCategory) {
        return false;
      }
      
      // Verificar termo de pesquisa
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [reports, searchQuery, selectedCategory, currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Navegue e baixe os relatórios disponíveis.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar relatórios..."
          />
        </div>
        <div className="flex-1 overflow-auto">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {searchQuery || selectedCategory !== 'all' 
              ? "Nenhum relatório corresponde aos seus filtros. Tente ajustar seus critérios de busca."
              : "Nenhum relatório disponível. Entre em contato com um administrador para mais informações."}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportList;
