import React, { createContext, useContext, useState } from 'react';

// Types
export type ReportCategory = 'financial' | 'sales' | 'operations' | 'hr' | 'marketing';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  sqlQuery: string;
  createdAt: string;
  updatedAt: string;
  accessRoles: ('admin' | 'user')[];
  fileUrl?: string;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportsByCategory: (category: ReportCategory | 'all') => Report[];
}

// Sample reports data
const sampleReports: Report[] = [
  {
    id: '1',
    title: 'Relatório de Receita Mensal',
    description: 'Mostra dados de receita detalhados por categoria de produto e região.',
    category: 'financial',
    sqlQuery: 'SELECT * FROM revenue WHERE month = :month AND year = :year',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    accessRoles: ['admin', 'user'],
    fileUrl: '/reports/monthly_revenue.xlsx',
  },
  {
    id: '2',
    title: 'Métricas de Aquisição de Clientes',
    description: 'Análise de canais de aquisição de clientes e custos.',
    category: 'marketing',
    sqlQuery: 'SELECT channel, COUNT(customer_id) AS new_customers FROM acquisitions GROUP BY channel',
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-20T09:15:00Z',
    accessRoles: ['admin', 'user'],
    fileUrl: '/reports/acquisition_metrics.pdf',
  },
  {
    id: '3',
    title: 'Avaliação de Desempenho de Funcionários',
    description: 'Métricas confidenciais de desempenho para todos os funcionários.',
    category: 'hr',
    sqlQuery: 'SELECT e.*, p.score FROM employees e JOIN performance p ON e.id = p.employee_id',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    accessRoles: ['admin'],
    fileUrl: '/reports/employee_performance.xlsx',
  },
  {
    id: '4',
    title: 'Relatório de Status de Inventário',
    description: 'Níveis atuais de inventário em todos os depósitos.',
    category: 'operations',
    sqlQuery: 'SELECT product_id, SUM(quantity) FROM inventory GROUP BY product_id',
    createdAt: '2024-03-05T11:45:00Z',
    updatedAt: '2024-04-01T16:20:00Z',
    accessRoles: ['admin', 'user'],
    fileUrl: '/reports/inventory_status.xlsx',
  },
  {
    id: '5',
    title: 'Análise do Funil de Vendas',
    description: 'Análise das oportunidades de vendas atuais por estágio e receita esperada.',
    category: 'sales',
    sqlQuery: 'SELECT stage, COUNT(*) as count, SUM(expected_revenue) FROM opportunities GROUP BY stage',
    createdAt: '2024-03-10T09:30:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
    accessRoles: ['admin', 'user'],
    fileUrl: '/reports/sales_pipeline.pdf',
  },
  {
    id: '6',
    title: 'Sumário Executivo Financeiro',
    description: 'Resumo confidencial de todas as métricas financeiras para revisão executiva.',
    category: 'financial',
    sqlQuery: 'SELECT * FROM financial_summary WHERE quarter = :quarter AND year = :year',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
    accessRoles: ['admin'],
    fileUrl: '/reports/executive_summary.pdf',
  },
];

// Create context
const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(sampleReports);

  const addReport = (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setReports([...reports, newReport]);
  };

  const updateReport = (id: string, updatedFields: Partial<Report>) => {
    setReports(
      reports.map(report => 
        report.id === id
          ? { ...report, ...updatedFields, updatedAt: new Date().toISOString() }
          : report
      )
    );
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
  };

  const getReportsByCategory = (category: ReportCategory | 'all') => {
    if (category === 'all') {
      return reports;
    }
    return reports.filter(report => report.category === category);
  };

  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportsByCategory,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReports = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
