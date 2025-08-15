import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Building2, Settings, Upload, Mail, Phone, FileText, Check, Clock, AlertCircle } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      company_name: profile?.company_name || '',
      address: profile?.address || '',
      city: profile?.city || '',
      country: profile?.country || '',
      bio: profile?.bio || '',
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await updateProfile(data);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error uploading image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getVerificationStatus = (type: 'email' | 'phone' | 'business') => {
    if (type === 'email') {
      return profile?.email && profile?.verified ? 'verified' : 'pending';
    }
    if (type === 'phone') {
      return profile?.phone && profile?.verified ? 'verified' : 'pending';
    }
    if (type === 'business') {
      return profile?.company_name && profile?.verified ? 'verified' : 'pending';
    }
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full opacity-20"></div>
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                      <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{profile?.full_name || 'User'}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`capitalize mb-4 ${
                      profile?.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      profile?.role === 'seller' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {profile?.role || 'buyer'}
                  </Badge>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <Button 
                      variant="outline" 
                      disabled={uploading} 
                      className="w-full bg-background/50 hover:bg-background/80 border-primary/30 hover:border-primary/50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'personal' 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Personal Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('company')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'company' 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Company Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'preferences' 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Preferences</span>
                  </button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Personal Information */}
                <TabsContent value="personal">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              {...form.register('full_name')}
                              className="w-full"
                            />
                            {form.formState.errors.full_name && (
                              <p className="text-sm text-destructive">
                                {form.formState.errors.full_name.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              {...form.register('email')}
                              className="w-full"
                            />
                            {form.formState.errors.email && (
                              <p className="text-sm text-destructive">
                                {form.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              {...form.register('phone')}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select value={form.watch('country') || ''} onValueChange={(value) => form.setValue('country', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="Germany">Germany</SelectItem>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="Japan">Japan</SelectItem>
                                <SelectItem value="China">China</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              {...form.register('city')}
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            {...form.register('address')}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio/Description</Label>
                          <Textarea
                            id="bio"
                            {...form.register('bio')}
                            className="w-full min-h-[120px]"
                            placeholder="Tell us about yourself..."
                          />
                        </div>

                        <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Company Information */}
                <TabsContent value="company">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 dark:border-purple-800/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                              id="company_name"
                              {...form.register('company_name')}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Industry</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Manufacturing" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="automotive">Automotive</SelectItem>
                                <SelectItem value="textiles">Textiles</SelectItem>
                                <SelectItem value="food">Food & Beverages</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Company Website</Label>
                          <Input 
                            placeholder="https://company.com"
                            className="w-full"
                          />
                        </div>

                        {/* Verification Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50 dark:border-green-800/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Email Verified</span>
                              </div>
                              {getStatusIcon(getVerificationStatus('email'))}
                            </div>
                            <Badge className={`mt-2 ${getStatusColor(getVerificationStatus('email'))}`}>
                              {getVerificationStatus('email') === 'verified' ? 'Verified' : 'Pending'}
                            </Badge>
                          </Card>

                          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/10 border-yellow-200/50 dark:border-yellow-800/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Phone Verified</span>
                              </div>
                              {getStatusIcon(getVerificationStatus('phone'))}
                            </div>
                            <Badge className={`mt-2 ${getStatusColor(getVerificationStatus('phone'))}`}>
                              Pending
                            </Badge>
                          </Card>

                          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 border-red-200/50 dark:border-red-800/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Business License</span>
                              </div>
                              {getStatusIcon(getVerificationStatus('business'))}
                            </div>
                            <Badge className={`mt-2 ${getStatusColor(getVerificationStatus('business'))}`}>
                              Pending
                            </Badge>
                          </Card>
                        </div>

                        <Button type="submit" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences */}
                <TabsContent value="preferences">
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select defaultValue="english">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="hindi">Hindi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Select defaultValue="eastern">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="eastern">Eastern Time (ET)</SelectItem>
                              <SelectItem value="central">Central Time (CT)</SelectItem>
                              <SelectItem value="mountain">Mountain Time (MT)</SelectItem>
                              <SelectItem value="pacific">Pacific Time (PT)</SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger className="md:w-1/2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD - US Dollar</SelectItem>
                            <SelectItem value="eur">EUR - Euro</SelectItem>
                            <SelectItem value="gbp">GBP - British Pound</SelectItem>
                            <SelectItem value="inr">INR - Indian Rupee</SelectItem>
                            <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notification Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Notification Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive updates about orders and RFQs</p>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">SMS Notifications</Label>
                              <p className="text-sm text-muted-foreground">Urgent updates via text message</p>
                            </div>
                            <Switch />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Marketing Communications</Label>
                              <p className="text-sm text-muted-foreground">Product updates and promotions</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;