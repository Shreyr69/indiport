import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { categories } = useProducts();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    min_order: '',
    unit: '',
    category: '',
    location: '',
    stock_quantity: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    setImages(prev => [...prev, ...files].slice(0, 5));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    input?.click();
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(data.publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Upload images
      const imageUrls = await uploadImages();
      
      // Create product
      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          min_order: parseInt(formData.min_order),
          unit: formData.unit,
          category: formData.category,
          location: formData.location,
          stock_quantity: parseInt(formData.stock_quantity),
          seller_id: user.id,
          image_url: imageUrls[0] || null,
          images: imageUrls,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Product submitted",
        description: "Your product has been submitted for review"
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        min_order: '',
        unit: '',
        category: '',
        location: '',
        stock_quantity: ''
      });
      setImages([]);
      
      onSuccess?.();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to submit product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-elevated max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="label-text">Product Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category" className="label-text">Category *</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="price" className="label-text">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="min_order" className="label-text">Min Order *</Label>
              <Input
                id="min_order"
                type="number"
                required
                value={formData.min_order}
                onChange={(e) => setFormData(prev => ({ ...prev, min_order: e.target.value }))}
                placeholder="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="unit" className="label-text">Unit *</Label>
              <Select
                required
                value={formData.unit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="units">Units</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="kilograms">Kilograms</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock_quantity" className="label-text">Stock *</Label>
              <Input
                id="stock_quantity"
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                placeholder="100"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="label-text">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="label-text">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed product description..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label className="label-text">Product Images (Max 5)</Label>
            
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div 
              className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleClick}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mb-4">PNG, JPG up to 10MB each</p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 5}
              />
              <Button type="button" variant="outline" disabled={images.length >= 5}>
                Choose Files
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;