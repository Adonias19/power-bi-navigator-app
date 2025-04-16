import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrashIcon, 
  PencilIcon, 
  PlusIcon, 
  ArrowUpCircle, 
  ArrowDownCircle,
  FolderIcon,
  FolderPlusIcon,
  LayoutDashboard,
  BarChart3,
  LineChart,
  PieChart,
  Settings as SettingsIcon
} from "lucide-react";
import { NavigationCategory, NavigationItem } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const AVAILABLE_ICONS = [
  { name: "LayoutDashboard", label: "Dashboard", component: <LayoutDashboard className="h-4 w-4" /> },
  { name: "BarChart3", label: "Bar Chart", component: <BarChart3 className="h-4 w-4" /> },
  { name: "LineChart", label: "Line Chart", component: <LineChart className="h-4 w-4" /> },
  { name: "PieChart", label: "Pie Chart", component: <PieChart className="h-4 w-4" /> },
  { name: "Settings", label: "Settings", component: <SettingsIcon className="h-4 w-4" /> },
  { name: "FolderIcon", label: "Folder", component: <FolderIcon className="h-4 w-4" /> },
];

const getIconByName = (name: string) => {
  const icon = AVAILABLE_ICONS.find(icon => icon.name === name);
  return icon ? icon.component : <LayoutDashboard className="h-4 w-4" />;
};

const loadSavedNavigation = (): { categories: NavigationCategory[], items: NavigationItem[] } => {
  const savedNav = localStorage.getItem('appNavigation');
  if (savedNav) {
    return JSON.parse(savedNav);
  }
  
  return {
    categories: [
      { id: "cat1", name: "Dashboards", icon: "FolderIcon", items: [], order: 0 },
      { id: "cat2", name: "Reports", icon: "FolderIcon", items: [], order: 1 },
    ],
    items: [
      { id: "1", name: "Overview", path: "/dashboard", icon: "LayoutDashboard", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat1", order: 0 },
      { id: "2", name: "Analytics", path: "/dashboard/analytics", icon: "PieChart", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat1", order: 1 },
      { id: "3", name: "All Reports", path: "/reports", icon: "BarChart3", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat2", order: 0 },
      { id: "4", name: "Financial", path: "/reports/financial", icon: "LineChart", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat2", order: 1 },
    ]
  };
};

const NavigationSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("categories");
  
  const initialNav = loadSavedNavigation();
  const [categories, setCategories] = useState<NavigationCategory[]>(initialNav.categories);
  const [items, setItems] = useState<NavigationItem[]>(initialNav.items);
  
  const [editingCategory, setEditingCategory] = useState<NavigationCategory | null>(null);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<NavigationCategory, 'id' | 'items' | 'order'>>({
    name: "",
    icon: "FolderIcon"
  });
  const [newItem, setNewItem] = useState<Omit<NavigationItem, 'id' | 'order'>>({
    name: "",
    path: "",
    icon: "LayoutDashboard",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    categoryId: categories[0]?.id || ""
  });

  useEffect(() => {
    const loadNavigationFromDB = async () => {
      try {
        const { data: dbCategories, error: catError } = await supabase
          .from('nav_categories')
          .select('*')
          .order('order_index');
        
        if (catError) throw catError;
        
        const { data: dbItems, error: itemsError } = await supabase
          .from('nav_items')
          .select('*')
          .order('order_index');
        
        if (itemsError) throw itemsError;
        
        const transformedCategories = dbCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          order: cat.order_index,
          items: []
        }));
        
        const transformedItems = dbItems.map(item => ({
          id: item.id,
          name: item.name,
          path: item.path,
          icon: item.icon,
          embedUrl: item.embed_url,
          categoryId: item.category_id,
          order: item.order_index
        }));
        
        if (transformedCategories.length > 0) {
          setCategories(transformedCategories);
          setNewItem(prev => ({
            ...prev,
            categoryId: transformedCategories[0]?.id || ""
          }));
        }
        
        if (transformedItems.length > 0) {
          setItems(transformedItems);
        }
      } catch (error) {
        console.error("Error loading navigation from database:", error);
        setCategories(initialNav.categories);
        setItems(initialNav.items);
      }
    };
    
    loadNavigationFromDB();
  }, []);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  
  const getItemsForCategory = (categoryId: string) => {
    return items
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  };

  const saveNavigation = async () => {
    const navigationData = {
      categories,
      items
    };
    
    localStorage.setItem('appNavigation', JSON.stringify(navigationData));
    
    window.dispatchEvent(new Event('storage'));
    
    try {
      const categoriesForDB = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        order_index: cat.order,
      }));
      
      const itemsForDB = items.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        icon: item.icon,
        embed_url: item.embedUrl,
        category_id: item.categoryId,
        order_index: item.order,
      }));
      
      const { error: catError } = await supabase
        .from('nav_categories')
        .upsert(categoriesForDB, { onConflict: 'id' });
      
      if (catError) throw catError;
      
      const { error: itemError } = await supabase
        .from('nav_items')
        .upsert(itemsForDB, { onConflict: 'id' });
      
      if (itemError) throw itemError;
      
      toast({
        title: "Navigation settings saved",
        description: "Your navigation changes have been saved to the database."
      });
    } catch (error) {
      console.error("Error saving navigation to database:", error);
      toast({
        title: "Error saving to database",
        description: "Changes were saved locally but not to the database.",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name) {
      const newId = `cat${Date.now()}`;
      const newCategoryWithId: NavigationCategory = {
        id: newId,
        ...newCategory,
        items: [],
        order: categories.length
      };
      
      try {
        const { data, error } = await supabase
          .from('nav_categories')
          .insert({
            id: newId,
            name: newCategory.name,
            icon: newCategory.icon,
            order_index: categories.length
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          newCategoryWithId.id = data[0].id;
        }
        
        setCategories(prev => [...prev, newCategoryWithId]);
        setNewCategory({ name: "", icon: "FolderIcon" });
        setIsAddingCategory(false);
        
        toast({
          title: "Category added",
          description: `Category "${newCategory.name}" has been added successfully.`
        });
      } catch (error) {
        console.error("Error adding category to database:", error);
        toast({
          title: "Error adding category",
          description: "There was an error saving to the database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveCategory = async (id: string) => {
    const categoryItems = items.filter(item => item.categoryId === id);
    if (categoryItems.length > 0) {
      toast({
        title: "Cannot delete category",
        description: "This category contains items. Please remove all items first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('nav_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      toast({
        title: "Category removed",
        description: "The category has been removed successfully."
      });
    } catch (error) {
      console.error("Error deleting category from database:", error);
      toast({
        title: "Error deleting category",
        description: "There was an error deleting from the database.",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = (category: NavigationCategory) => {
    setEditingCategory(category);
  };

  const handleSaveEditCategory = async () => {
    if (editingCategory) {
      try {
        const { error } = await supabase
          .from('nav_categories')
          .update({
            name: editingCategory.name,
            icon: editingCategory.icon
          })
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        
        setCategories(prev => 
          prev.map(cat => cat.id === editingCategory.id ? editingCategory : cat)
        );
        setEditingCategory(null);
        
        toast({
          title: "Category updated",
          description: "The category has been updated successfully."
        });
      } catch (error) {
        console.error("Error updating category in database:", error);
        toast({
          title: "Error updating category",
          description: "There was an error updating in the database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...sortedCategories];
    
    if (direction === 'up' && index > 0) {
      const currentOrder = newCategories[index].order;
      newCategories[index].order = newCategories[index - 1].order;
      newCategories[index - 1].order = currentOrder;
      
      try {
        const cat1 = newCategories[index];
        const cat2 = newCategories[index - 1];
        
        const updates = [
          { id: cat1.id, order_index: cat1.order },
          { id: cat2.id, order_index: cat2.order }
        ];
        
        const { error } = await supabase
          .from('nav_categories')
          .upsert(updates, { onConflict: 'id' });
        
        if (error) throw error;
      } catch (error) {
        console.error("Error updating category order in database:", error);
        toast({
          title: "Error updating order",
          description: "Changes were saved locally but not to the database.",
          variant: "destructive"
        });
      }
    } else if (direction === 'down' && index < categories.length - 1) {
      const currentOrder = newCategories[index].order;
      newCategories[index].order = newCategories[index + 1].order;
      newCategories[index + 1].order = currentOrder;
      
      try {
        const cat1 = newCategories[index];
        const cat2 = newCategories[index + 1];
        
        const updates = [
          { id: cat1.id, order_index: cat1.order },
          { id: cat2.id, order_index: cat2.order }
        ];
        
        const { error } = await supabase
          .from('nav_categories')
          .upsert(updates, { onConflict: 'id' });
        
        if (error) throw error;
      } catch (error) {
        console.error("Error updating category order in database:", error);
        toast({
          title: "Error updating order",
          description: "Changes were saved locally but not to the database.",
          variant: "destructive"
        });
      }
    }
    
    setCategories(newCategories);
    
    toast({
      title: "Category order updated",
      description: "The category has been moved " + direction + "."
    });
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.path && newItem.categoryId) {
      const newId = `item${Date.now()}`;
      const categoryItems = getItemsForCategory(newItem.categoryId);
      
      const newItemWithId: NavigationItem = {
        id: newId,
        ...newItem,
        order: categoryItems.length
      };
      
      try {
        const { data, error } = await supabase
          .from('nav_items')
          .insert({
            id: newId,
            name: newItem.name,
            path: newItem.path,
            icon: newItem.icon,
            embed_url: newItem.embedUrl,
            category_id: newItem.categoryId,
            order_index: categoryItems.length
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          newItemWithId.id = data[0].id;
        }
        
        setItems(prev => [...prev, newItemWithId]);
        setNewItem({
          name: "",
          path: "",
          icon: "LayoutDashboard",
          embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
          categoryId: newItem.categoryId
        });
        setIsAddingItem(false);
        
        toast({
          title: "Navigation item added",
          description: `Item "${newItem.name}" has been added successfully.`
        });
      } catch (error) {
        console.error("Error adding item to database:", error);
        toast({
          title: "Error adding item",
          description: "There was an error saving to the database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nav_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Navigation item removed",
        description: "The navigation item has been removed successfully."
      });
    } catch (error) {
      console.error("Error deleting item from database:", error);
      toast({
        title: "Error deleting item",
        description: "There was an error deleting from the database.",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (item: NavigationItem) => {
    setEditingItem(item);
  };

  const handleSaveEditItem = async () => {
    if (editingItem) {
      try {
        const { error } = await supabase
          .from('nav_items')
          .update({
            name: editingItem.name,
            path: editingItem.path,
            icon: editingItem.icon,
            embed_url: editingItem.embedUrl,
            category_id: editingItem.categoryId
          })
          .eq('id', editingItem.id);
        
        if (error) throw error;
        
        setItems(prev => 
          prev.map(item => item.id === editingItem.id ? editingItem : item)
        );
        setEditingItem(null);
        
        toast({
          title: "Navigation item updated",
          description: "The navigation item has been updated successfully."
        });
      } catch (error) {
        console.error("Error updating item in database:", error);
        toast({
          title: "Error updating item",
          description: "There was an error updating in the database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveItem = async (categoryId: string, itemIndex: number, direction: 'up' | 'down') => {
    const categoryItems = getItemsForCategory(categoryId);
    const newItems = [...items];
    
    if (direction === 'up' && itemIndex > 0) {
      const currentItem = categoryItems[itemIndex];
      const prevItem = categoryItems[itemIndex - 1];
      
      const currentItemIndex = newItems.findIndex(item => item.id === currentItem.id);
      const prevItemIndex = newItems.findIndex(item => item.id === prevItem.id);
      
      if (currentItemIndex !== -1 && prevItemIndex !== -1) {
        const tempOrder = newItems[currentItemIndex].order;
        newItems[currentItemIndex].order = newItems[prevItemIndex].order;
        newItems[prevItemIndex].order = tempOrder;
        
        try {
          const updates = [
            { id: currentItem.id, order_index: newItems[currentItemIndex].order },
            { id: prevItem.id, order_index: newItems[prevItemIndex].order }
          ];
          
          const { error } = await supabase
            .from('nav_items')
            .upsert(updates, { onConflict: 'id' });
          
          if (error) throw error;
        } catch (error) {
          console.error("Error updating item order in database:", error);
          toast({
            title: "Error updating order",
            description: "Changes were saved locally but not to the database.",
            variant: "destructive"
          });
        }
      }
    } else if (direction === 'down' && itemIndex < categoryItems.length - 1) {
      const currentItem = categoryItems[itemIndex];
      const nextItem = categoryItems[itemIndex + 1];
      
      const currentItemIndex = newItems.findIndex(item => item.id === currentItem.id);
      const nextItemIndex = newItems.findIndex(item => item.id === nextItem.id);
      
      if (currentItemIndex !== -1 && nextItemIndex !== -1) {
        const tempOrder = newItems[currentItemIndex].order;
        newItems[currentItemIndex].order = newItems[nextItemIndex].order;
        newItems[nextItemIndex].order = tempOrder;
        
        try {
          const updates = [
            { id: currentItem.id, order_index: newItems[currentItemIndex].order },
            { id: nextItem.id, order_index: newItems[nextItemIndex].order }
          ];
          
          const { error } = await supabase
            .from('nav_items')
            .upsert(updates, { onConflict: 'id' });
          
          if (error) throw error;
        } catch (error) {
          console.error("Error updating item order in database:", error);
          toast({
            title: "Error updating order",
            description: "Changes were saved locally but not to the database.",
            variant: "destructive"
          });
        }
      }
    }
    
    setItems(newItems);
    
    toast({
      title: "Item order updated",
      description: "The item has been moved " + direction + "."
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Navigation Management</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsAddingCategory(true)}
            variant="outline"
            size="sm"
            disabled={isAddingCategory}
            className="flex items-center"
          >
            <FolderPlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button
            onClick={() => setIsAddingItem(true)}
            variant="outline"
            size="sm"
            disabled={isAddingItem || categories.length === 0}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Navigation Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          {isAddingCategory && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create a new navigation category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-category-name">Name</Label>
                    <Input
                      id="new-category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="e.g., Analytics"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-category-icon">Icon</Label>
                    <Select
                      value={newCategory.icon}
                      onValueChange={(value) => setNewCategory({...newCategory, icon: value})}
                    >
                      <SelectTrigger id="new-category-icon">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ICONS.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center">
                              {icon.component}
                              <span className="ml-2">{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddingCategory(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleAddCategory}
                      disabled={!newCategory.name}
                    >
                      Add Category
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {sortedCategories.map((category, index) => (
              <div 
                key={category.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-md"
              >
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleMoveCategory(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpCircle className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleMoveCategory(index, 'down')}
                    disabled={index === sortedCategories.length - 1}
                  >
                    <ArrowDownCircle className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
                
                {editingCategory?.id === category.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="edit-category-name" className="text-xs text-gray-500">Name</Label>
                      <Input
                        id="edit-category-name"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category-icon" className="text-xs text-gray-500">Icon</Label>
                      <Select
                        value={editingCategory.icon}
                        onValueChange={(value) => setEditingCategory({...editingCategory, icon: value})}
                      >
                        <SelectTrigger id="edit-category-icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ICONS.map((icon) => (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center">
                                {icon.component}
                                <span className="ml-2">{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveEditCategory}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center flex-1">
                      {getIconByName(category.icon)}
                      <span className="ml-2 font-medium">{category.name}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        {getItemsForCategory(category.id).length} items
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Confirm Delete</h4>
                              <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete {category.name}?
                              </p>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRemoveCategory(category.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No categories found. Create a category to get started.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="items">
          {isAddingItem && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Navigation Item</CardTitle>
                <CardDescription>Create a new navigation item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-item-name">Name</Label>
                      <Input
                        id="new-item-name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        placeholder="e.g., Sales Dashboard"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-item-category">Category</Label>
                      <Select
                        value={newItem.categoryId}
                        onValueChange={(value) => setNewItem({...newItem, categoryId: value})}
                      >
                        <SelectTrigger id="new-item-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-item-path">Path</Label>
                      <Input
                        id="new-item-path"
                        value={newItem.path}
                        onChange={(e) => setNewItem({...newItem, path: e.target.value})}
                        placeholder="e.g., /dashboard/sales"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-item-icon">Icon</Label>
                      <Select
                        value={newItem.icon}
                        onValueChange={(value) => setNewItem({...newItem, icon: value})}
                      >
                        <SelectTrigger id="new-item-icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ICONS.map((icon) => (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center">
                                {icon.component}
                                <span className="ml-2">{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-item-embedUrl">Power BI Embed URL</Label>
                    <Input
                      id="new-item-embedUrl"
                      value={newItem.embedUrl}
                      onChange={(e) => setNewItem({...newItem, embedUrl: e.target.value})}
                      placeholder="Power BI report embed URL"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL for the Power BI report to embed
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddingItem(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleAddItem}
                      disabled={!newItem.name || !newItem.path || !newItem.categoryId}
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {categories.length > 0 ? (
            <div className="space-y-6">
              {sortedCategories.map((category) => {
                const categoryItems = getItemsForCategory(category.id);
                return (
                  <div key={category.id} className="space-y-2">
                    <h3 className="font-medium flex items-center text-sm text-gray-500 uppercase tracking-wider">
                      {getIconByName(category.icon)}
                      <span className="ml-1">{category.name}</span>
                    </h3>
                    
                    <div className="space-y-2">
                      {categoryItems.length > 0 ? (
                        categoryItems.map((item, itemIndex) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-md ml-4"
                          >
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleMoveItem(category.id, itemIndex, 'up')}
                                disabled={itemIndex === 0}
                              >
                                <ArrowUpCircle className="h-5 w-5 text-gray-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleMoveItem(category.id, itemIndex, 'down')}
                                disabled={itemIndex === categoryItems.length - 1}
                              >
                                <ArrowDownCircle className="h-5 w-5 text-gray-500" />
                              </Button>
                            </div>
                            
                            {editingItem?.id === item.id ? (
                              <div className="flex-1 grid grid-cols-2 gap-3">
                                <div>
                                  <Label htmlFor="edit-item-name" className="text-xs text-gray-500">Name</Label>
                                  <Input
                                    id="edit-item-name"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-item-path" className="text-xs text-gray-500">Path</Label>
                                  <Input
                                    id="edit-item-path"
                                    value={editingItem.path}
                                    onChange={(e) => setEditingItem({...editingItem, path: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-item-icon" className="text-xs text-gray-500">Icon</Label>
                                  <Select
                                    value={editingItem.icon}
                                    onValueChange={(value) => setEditingItem({...editingItem, icon: value})}
                                  >
                                    <SelectTrigger id="edit-item-icon">
                                      <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {AVAILABLE_ICONS.map((icon) => (
                                        <SelectItem key={icon.name} value={icon.name}>
                                          <div className="flex items-center">
                                            {icon.component}
                                            <span className="ml-2">{icon.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-item-category" className="text-xs text-gray-500">Category</Label>
                                  <Select
                                    value={editingItem.categoryId}
                                    onValueChange={(value) => setEditingItem({...editingItem, categoryId: value})}
                                  >
                                    <SelectTrigger id="edit-item-category">
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                          {cat.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-2">
                                  <Label htmlFor="edit-item-embedUrl" className="text-xs text-gray-500">Power BI Embed URL</Label>
                                  <Input
                                    id="edit-item-embedUrl"
                                    value={editingItem.embedUrl}
                                    onChange={(e) => setEditingItem({...editingItem, embedUrl: e.target.value})}
                                  />
                                </div>
                                <div className="col-span-2 flex justify-end gap-2 mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingItem(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={handleSaveEditItem}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center flex-1">
                                  {getIconByName(item.icon)}
                                  <div className="ml-2">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.path}</div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditItem(item)}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="grid gap-4">
                                        <div className="space-y-2">
                                          <h4 className="font-medium leading-none">Confirm Delete</h4>
                                          <p className="text-sm text-muted-foreground">
                                            Are you sure you want to delete {item.name}?
                                          </p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                          <Button variant="outline" size="sm">
                                            Cancel
                                          </Button>
                                          <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 border border-dashed rounded-md ml-4">
                          <p className="text-sm text-muted-foreground">No items in this category</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">No categories available. Please create categories first.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={saveNavigation}>
          Save Navigation
        </Button>
      </div>
    </div>
  );
};

export default NavigationSettings;
