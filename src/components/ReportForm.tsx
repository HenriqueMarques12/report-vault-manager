
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Report, ReportCategory } from '@/contexts/ReportContext';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.enum(['financial', 'sales', 'operations', 'hr', 'marketing'] as const),
  sqlQuery: z.string().min(5, { message: 'SQL query is required.' }),
  accessUsers: z.boolean().default(true),
  accessAdmin: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ReportFormProps {
  onSubmit: (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialValues?: Partial<Report>;
  buttonText?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({
  onSubmit,
  initialValues,
  buttonText = 'Save Report'
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      category: (initialValues?.category as ReportCategory) || 'financial',
      sqlQuery: initialValues?.sqlQuery || '',
      accessUsers: initialValues?.accessRoles?.includes('user') ?? true,
      accessAdmin: initialValues?.accessRoles?.includes('admin') ?? true,
    }
  });

  const handleSubmit = (values: FormValues) => {
    const accessRoles: ('admin' | 'user')[] = [];
    if (values.accessAdmin) accessRoles.push('admin');
    if (values.accessUsers) accessRoles.push('user');

    onSubmit({
      title: values.title,
      description: values.description,
      category: values.category,
      sqlQuery: values.sqlQuery,
      accessRoles,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter report title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what this report shows" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sqlQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SQL Query</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter SQL query" 
                  className="font-mono min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border rounded-md p-4 bg-muted/30">
          <h3 className="font-medium">Access Control</h3>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="accessAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Admin users</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessUsers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Regular users</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default ReportForm;
