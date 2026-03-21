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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, ShieldX } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { createBlacklist, getTenantList } from '@/services/mqtt';

const BLACKLIST_TYPE_OPTIONS = [
  { value: 'ClientId', label: 'Client ID' },
  { value: 'User', label: 'User' },
  { value: 'Ip', label: 'IP Address' },
  { value: 'ClientIdMatch', label: 'Client ID Match' },
  { value: 'UserMatch', label: 'User Match' },
  { value: 'IPCIDR', label: 'IP CIDR' },
];

const formSchema = z.object({
  tenant: z.string().min(1, 'Tenant is required'),
  name: z.string().min(1, 'Name is required'),
  blacklist_type: z.string().min(1, 'Blacklist type is required'),
  resource_name: z.string().min(1, 'Resource name is required'),
  end_time: z.date({ required_error: 'End time is required' }),
  desc: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateBlacklistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBlacklistForm({ open, onOpenChange }: CreateBlacklistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForBlacklistCreate'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: '',
      name: '',
      blacklist_type: '',
      resource_name: '',
      desc: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createBlacklist,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blacklist rule created successfully',
      });
      queryClient.refetchQueries({ queryKey: ['QueryBlacklistListData_all'], exact: false });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Failed to create blacklist rule:', error);
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
      blacklist_type: data.blacklist_type,
      resource_name: data.resource_name,
      end_time: Math.floor(data.end_time.getTime() / 1000),
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
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-red-50 dark:from-purple-950/40 dark:to-red-950/40">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-red-500 shadow-sm">
              <ShieldX className="h-4 w-4 text-white" />
            </div>
            Create Blacklist Rule
          </DialogTitle>
          <DialogDescription>Add a new blacklist rule to block specific resources.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">

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
                          <Input placeholder="Unique rule name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pl-6">
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

              {/* Section 2: Block Rule */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldX className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Block Rule</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="blacklist_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blacklist Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BLACKLIST_TYPE_OPTIONS.map(opt => (
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
                    name="resource_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. bad_client" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-2">
                        <FormLabel>End Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick an end date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white">
                {isSubmitting ? 'Creating...' : 'Create Blacklist Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
