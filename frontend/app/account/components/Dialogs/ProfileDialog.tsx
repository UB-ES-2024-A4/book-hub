// frontend/components/ProfileDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/User";
import EditProfileForm from "@/app/account/components/EditProfileForm";

type ProfileDialogProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editedUser: User;
  setEditedUser: React.Dispatch<React.SetStateAction<User>>;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
};

const ProfileDialog: React.FC<ProfileDialogProps> = ({ isEditing, setIsEditing, editedUser, setEditedUser, setUserData }) => {

  const handleSave = () => {
    console.log('Saving user data:', editedUser);
    setUserData((prev) => ({
      ...prev,
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
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
        <EditProfileForm editedUser={editedUser} setIsEditing={setIsEditing} setUserData={setUserData} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;