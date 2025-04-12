
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrashIcon, PencilIcon, PlusIcon, GripVertical, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

type NavItem = {
  id: string;
  name: string;
  path: string;
  icon: string;
};

const NavigationSettings: React.FC = () => {
  const { toast } = useToast();
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: "1", name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { id: "2", name: "Reports", path: "/reports", icon: "BarChart3" },
    { id: "3", name: "Settings", path: "/settings", icon: "Settings" }
  ]);
  
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Omit<NavItem, 'id'>>({
    name: "",
    path: "",
    icon: "LayoutDashboard"
  });

  const handleRemoveItem = (id: string) => {
    setNavItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Navigation item removed",
      description: "The navigation item has been removed successfully."
    });
  };

  const handleEditItem = (item: NavItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setNavItems(prev => 
        prev.map(item => item.id === editingItem.id ? editingItem : item)
      );
      setEditingItem(null);
      toast({
        title: "Navigation updated",
        description: "The navigation item has been updated successfully."
      });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [name]: value
      });
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleAddNewItem = () => {
    if (newItem.name && newItem.path) {
      const id = (navItems.length + 1).toString();
      setNavItems(prev => [...prev, { id, ...newItem }]);
      setNewItem({ name: "", path: "", icon: "LayoutDashboard" });
      setIsAddingNew(false);
      toast({
        title: "Navigation item added",
        description: "The new navigation item has been added successfully."
      });
    }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems];
    if (direction === 'up' && index > 0) {
      // Swap with the item above
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < navItems.length - 1) {
      // Swap with the item below
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setNavItems(newItems);
    
    toast({
      title: "Navigation order updated",
      description: "The item has been moved " + direction + "."
    });
  };

  const handleSaveOrder = () => {
    toast({
      title: "Navigation order updated",
      description: "The navigation order has been updated successfully."
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Navigation Items</h2>
        <Button
          onClick={() => setIsAddingNew(true)}
          variant="outline"
          size="sm"
          disabled={isAddingNew}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {isAddingNew && (
        <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-sm font-medium mb-4">Add New Navigation Item</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="new-name" className="text-sm">Name</label>
              <Input
                id="new-name"
                name="name"
                value={newItem.name}
                onChange={handleNewItemChange}
                placeholder="e.g., Reports"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="new-path" className="text-sm">Path</label>
              <Input
                id="new-path"
                name="path"
                value={newItem.path}
                onChange={handleNewItemChange}
                placeholder="e.g., /reports"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="new-icon" className="text-sm">Icon</label>
              <Input
                id="new-icon"
                name="icon"
                value={newItem.icon}
                onChange={handleNewItemChange}
                placeholder="Icon name"
              />
              <p className="text-xs text-gray-500">
                Use Lucide icon names (e.g., LayoutDashboard, BarChart3)
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddingNew(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleAddNewItem}
                disabled={!newItem.name || !newItem.path}
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {navItems.map((item, index) => (
          <div 
            key={item.id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-md"
          >
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleMoveItem(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUpCircle className="h-5 w-5 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleMoveItem(index, 'down')}
                disabled={index === navItems.length - 1}
              >
                <ArrowDownCircle className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
            
            {editingItem?.id === item.id ? (
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-name" className="text-xs text-gray-500">Name</label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingItem.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label htmlFor="edit-path" className="text-xs text-gray-500">Path</label>
                  <Input
                    id="edit-path"
                    name="path"
                    value={editingItem.path}
                    onChange={handleEditChange}
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
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.path}</div>
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
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveOrder}>
          Save Navigation Order
        </Button>
      </div>
    </div>
  );
};

export default NavigationSettings;
