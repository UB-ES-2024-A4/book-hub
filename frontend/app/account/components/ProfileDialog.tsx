// frontend/components/ProfileDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/User";

type ProfileDialogProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editedUser: User;
  setEditedUser: React.Dispatch<React.SetStateAction<User>>;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
};

const ProfileDialog: React.FC<ProfileDialogProps> = ({ isEditing, setIsEditing, editedUser, setEditedUser, setUserData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('Saving user data:', editedUser);
    setUserData((prev) => ({
      ...prev,
      fullName: editedUser.fullName,
      username: editedUser.username,
      email: editedUser.email,
      bio: editedUser.bio,
    }));
    setIsEditing(false);
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <Input id="fullName" name="fullName" value={editedUser.fullName} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <Input id="username" name="username" value={editedUser.username} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <Textarea id="bio" name="bio" value={editedUser.bio} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;