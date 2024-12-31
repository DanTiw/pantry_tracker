'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, getDocs, updateDoc, deleteDoc, doc, Firestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/app/firebase/config";
import { useUser } from "@clerk/nextjs";

import AddViaImageComponent from "@/components/addViaImage"; // Import the new component

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  weight: string;
}

const weightOptions = [
  { value: 'g', label: 'Grams' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'oz', label: 'Ounces' },
  { value: 'lb', label: 'Pounds' },
];

export default function Pantry() {
  const { user } = useUser();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState<PantryItem>({ id: '', name: '', quantity: 1, weight: 'g' });
  const [isEditing, setIsEditing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async (): Promise<void> => {
    if (!user) return;
    const q = query(collection(db, "pantryItems"), where("userId", "==", user.id));
    const querySnapshot = await getDocs(q);
    const fetchedItems: PantryItem[] = querySnapshot.docs.map(doc => ({ 
      id: doc.id,
      name: doc.data().name,
      quantity: doc.data().quantity,
      weight: doc.data().weight || 'g'
    }));
    setItems(fetchedItems);
  };

  const addOrUpdateItem = async (): Promise<void> => {
    if (!user || newItem.name.trim() === '') return;

    const itemData = {
      userId: user.id,
      name: newItem.name.trim(),
      quantity: newItem.quantity,
      weight: newItem.weight
    };

    if (isEditing) {
      await updateDoc(doc(db, "pantryItems", newItem.id), itemData);
    } else {
      const docRef = doc(collection(db, "pantryItems"));
      await setDoc(docRef, itemData);
    }

    setNewItem({ id: '', name: '', quantity: 1, weight: 'g' });
    setIsAlertOpen(false);
    fetchItems();
  };

  const updateItemQuantity = async (id: string, newQuantity: number): Promise<void> => {
    if (!user) return;
    if (newQuantity <= 0) {
      await deleteDoc(doc(db, "pantryItems", id));
    } else {
      await updateDoc(doc(db, "pantryItems", id), { quantity: newQuantity });
    }
    fetchItems();
  };

  const deleteItem = async (id: string): Promise<void> => {
    if (!user) return;
    await deleteDoc(doc(db, "pantryItems", id));
    fetchItems();
  };

  const openEditDialog = (item: PantryItem) => {
    setNewItem(item);
    setIsEditing(true);
    setIsAlertOpen(true);
  };

  // Function to handle the recognized item from AddViaImageComponent
  const handleItemRecognized = (itemName: string) => {
    setNewItem({ id: '', name: itemName, quantity: 1, weight: 'g' });
    setIsEditing(false);
    setIsAlertOpen(true);
  };

  if (!user) {
    return <div>Please sign in to access your pantry.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pantry Management</h1>

      {/* Buttons to add item manually or via image */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button
          onClick={() => {
            setNewItem({ id: '', name: '', quantity: 1, weight: 'g' });
            setIsEditing(false);
            setIsAlertOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add New Item Manually
        </Button>

        {/* Use the AddViaImageComponent */}
        <AddViaImageComponent onItemRecognized={handleItemRecognized} />
      </div>

      {/* Add or Edit Item Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditing ? 'Edit Item' : 'Add New Item'}</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details of the pantry item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value)) })}
                placeholder="Quantity"
                min="1"
                className="w-full sm:w-1/2"
              />
              <Select
                value={newItem.weight}
                onValueChange={(value) => setNewItem({ ...newItem, weight: value })}
              >
                <SelectTrigger className="w-full sm:w-1/2">
                  <SelectValue placeholder="Select weight unit" />
                </SelectTrigger>
                <SelectContent>
                  {weightOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={addOrUpdateItem}>
              {isEditing ? 'Update' : 'Add'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pantry Items Table */}
      <div className="overflow-x-auto">
        <Table className="mt-4 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Item Name</TableHead>
              <TableHead className="w-1/4">Quantity</TableHead>
              <TableHead className="w-1/4">Weight Unit</TableHead>
              <TableHead className="w-1/4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-1/4">{item.name}</TableCell>
                <TableCell className="w-1/4">{item.quantity}</TableCell>
                <TableCell className="w-1/4">{item.weight}</TableCell>
                <TableCell className="w-1/4 text-right">
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} size="sm">+</Button>
                    <Button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} size="sm">-</Button>
                    <Button onClick={() => openEditDialog(item)} size="sm">Edit</Button>
                    <Button onClick={() => deleteItem(item.id)} variant="destructive" size="sm">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}