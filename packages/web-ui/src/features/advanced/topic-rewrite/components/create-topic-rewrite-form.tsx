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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { createTopicRewrite, getTenantList } from '@/services/mqtt';
import { FileEdit, FileText } from 'lucide-react';

const ACTION_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Publish', label: 'Publish' },
  { value: 'Subscribe', label: 'Subscribe' },
];

const formSchema = z.object({
  tenant: z.string().min(1, 'Tenant is required'),
  name: z.string().min(1, 'Name is required'),
  desc: z.string().optional(),
  action: z.string().min(1, 'Action is required'),
  source_topic: z.string().min(1, 'Source topic is required'),
  dest_topic: z.string().min(1, 'Destination topic is required'),
  regex: z.string().min(1, 'Regex pattern is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTopicRewriteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTopicRewriteForm({ open, onOpenChange }: CreateTopicRewriteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForTopicRewriteCreate'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: '',
      name: '',
      desc: '',
      action: '',
      source_topic: '',
      dest_topic: '',
      regex: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createTopicRewrite,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Topic rewrite rule created successfully' });
      queryClient.refetchQueries({ queryKey: ['QueryTopicRewriteListData_all'], exact: false });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Failed to create topic rewrite rule:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    createMutation.mutate({
      tenant: data.tenant,
      name: data.name,
      desc: data.desc || '',
      action: data.action,
      source_topic: data.source_topic,
      dest_topic: data.dest_topic,
      regex: data.regex,
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
              <FileEdit className="h-4 w-4 text-white" />
            </div>
            Create Topic Rewrite Rule
          </DialogTitle>
          <DialogDescription>Create a new topic rewrite rule to transform topic names.</DialogDescription>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. sensor-rewrite-rule" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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

              {/* Section 2: Rewrite Rule */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileEdit className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rewrite Rule</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ACTION_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="regex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regex Pattern</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. ^x/y/z/(.+)$" className="font-mono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source_topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. x/y/z/+" className="font-mono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dest_topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. a/b/c/$1" className="font-mono" {...field} />
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
                {isSubmitting ? 'Creating...' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
