import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { createSchema, getTenantList } from '@/services/mqtt';
import { FileCode, FileText } from 'lucide-react';

const SCHEMA_TYPE_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'avro', label: 'Avro' },
  { value: 'protobuf', label: 'Protobuf' },
];

const formSchema = z.object({
  tenant: z.string().min(1, 'Tenant is required'),
  schema_name: z.string().min(1, 'Schema name is required'),
  schema_type: z.string().min(1, 'Schema type is required'),
  desc: z.string().optional(),
  schema: z.string().min(1, 'Schema definition is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSchemaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSchemaForm({ open, onOpenChange }: CreateSchemaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForSchemaCreate'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: '',
      schema_name: '',
      schema_type: '',
      desc: '',
      schema: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createSchema,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Schema created successfully' });
      queryClient.refetchQueries({ queryKey: ['QuerySchemaListData_all'], exact: false });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Failed to create schema:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    createMutation.mutate({
      tenant: data.tenant,
      schema_name: data.schema_name,
      schema_type: data.schema_type,
      schema: data.schema,
      desc: data.desc || '',
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[660px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <FileCode className="h-4 w-4 text-white" />
            </div>
            Create Schema
          </DialogTitle>
          <DialogDescription>Create a new schema definition for data validation.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">

              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="tenant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tenant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tenants.map(t => (
                              <SelectItem key={t.tenant_name} value={t.tenant_name}>
                                {t.tenant_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schema_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schema Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. sensor_data_schema" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schema_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schema Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SCHEMA_TYPE_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* Section 2: Schema Definition */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Schema Definition</span>
                </div>
                <div className="pl-6">
                  <FormField
                    control={form.control}
                    name="schema"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder={'Enter schema definition (JSON, Avro, Protobuf)\n\nExample for JSON Schema:\n{\n  "type": "object",\n  "properties": {\n    "temperature": { "type": "number" }\n  }\n}'}
                            rows={10}
                            className="font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900/50">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                {isSubmitting ? 'Creating...' : 'Create Schema'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
