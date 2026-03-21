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
import { createAutoSubscribe, getTenantList } from '@/services/mqtt';
import { Zap, FileText } from 'lucide-react';

const QOS_OPTIONS = [
  { value: '0', label: 'QoS 0' },
  { value: '1', label: 'QoS 1' },
  { value: '2', label: 'QoS 2' },
];

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];

const RETAINED_HANDLING_OPTIONS = [
  { value: '0', label: 'OnEverySubscribe' },
  { value: '1', label: 'OnNewSubscribe' },
  { value: '2', label: 'Never' },
];

const formSchema = z.object({
  tenant: z.string().min(1, 'Tenant is required'),
  name: z.string().min(1, 'Name is required'),
  desc: z.string().optional(),
  topic: z.string().min(1, 'Topic is required'),
  qos: z.string().min(1, 'QoS is required'),
  no_local: z.string().min(1, 'No Local is required'),
  retain_as_published: z.string().min(1, 'Retain As Published is required'),
  retained_handling: z.string().min(1, 'Retained Handling is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateAutoSubscribeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAutoSubscribeForm({ open, onOpenChange }: CreateAutoSubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForAutoSubscribeCreate'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: '',
      name: '',
      desc: '',
      topic: '',
      qos: '',
      no_local: 'false',
      retain_as_published: 'false',
      retained_handling: '0',
    },
  });

  const createMutation = useMutation({
    mutationFn: createAutoSubscribe,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Auto subscription rule created successfully' });
      queryClient.refetchQueries({ queryKey: ['QueryAutoSubscriptionListData_all'], exact: false });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Failed to create auto subscription rule:', error);
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
      topic: data.topic,
      qos: parseInt(data.qos),
      no_local: data.no_local === 'true',
      retain_as_published: data.retain_as_published === 'true',
      retained_handling: parseInt(data.retained_handling),
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
              <Zap className="h-4 w-4 text-white" />
            </div>
            Create Auto Subscription Rule
          </DialogTitle>
          <DialogDescription>Create a new automatic subscription rule for clients.</DialogDescription>
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
                          <Input placeholder="e.g. system-alert-sub" {...field} />
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

              {/* Section 2: Subscription Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subscription Settings</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter topic pattern (e.g., system/+, sensor/#)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QoS</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select QoS level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {QOS_OPTIONS.map(option => (
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
                    name="retained_handling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retained Handling</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select retained handling" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RETAINED_HANDLING_OPTIONS.map(option => (
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
                    name="no_local"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No Local</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select no local option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOOLEAN_OPTIONS.map(option => (
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
                    name="retain_as_published"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retain As Published</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select retain as published" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOOLEAN_OPTIONS.map(option => (
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
