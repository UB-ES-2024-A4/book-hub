// frontend/components/ProfileDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditProfileForm from "@/app/account/components/User/EditProfileForm";
import {PropsUser} from "@/app/types/PropsUser";

type ProfileDialogProps =  PropsUser & {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ isEditing, setIsEditing, userData, setUser }) => {

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <EditProfileForm setIsEditing={setIsEditing} userData={userData} setUser={setUser}/>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;