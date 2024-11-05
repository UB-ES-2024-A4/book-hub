"use client";
import {useFormState} from "react-dom";
import {userInformationSchema} from "@/app/lib/zodSchemas";
import {UpdateUser} from "@/app/actions";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {User} from "@/app/types/User";
import {PropsUser} from "@/app/types/PropsUser";

type Props =  PropsUser & {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProfileForm ({ setIsEditing, userData, setUser}: Props) {

    const [lastResult, action] = useFormState(UpdateUser, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}) {
            formData.append('id', userData.id.toString());
            return parseWithZod(formData, {schema: userInformationSchema});
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    // Bio's state for the form
    const [bio, setBio] = useState(userData?.biography ?? "");
    // Function to handle the bio change
    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Limit the bio to 200 characters
        const newBio = e.target.value.slice(0, 200);
        setBio(newBio);
    };

    const handleSave = () => {

        const newUser: User = {
            id: userData.id,
            first_name: fields.first_name.value || "",
            last_name: fields.last_name.value || "",
            username: fields.username.value || "",
            biography: bio,
            email: userData.email,
        };
        setUser(newUser);
        setIsEditing(false);
      };

    return (
            <form className="space-y-6"
                  id={form.id}
                  onSubmit={form.onSubmit}
                  action={action}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 required">First
                            Name</label>
                        <Input
                            key={fields.first_name.key}
                            name={fields.first_name.name}
                            defaultValue={userData?.first_name}
                            id="firstName"
                            type="text"/>
                        <p className="pt-2 text-red-500 text-sm"
                        >{fields.first_name.errors}</p>
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 required">Last
                            Name</label>
                        <Input
                            key={fields.last_name.key}
                            name={fields.last_name.name}
                            defaultValue={userData?.last_name}
                            id="LastName"
                            type="text"/>
                        <p className="pt-2 text-red-500 text-sm"
                        >{fields.last_name.errors}</p>
                    </div>
                    <div>
                        <label htmlFor="username"
                               className="block text-sm font-medium text-gray-700 required">Username</label>
                        <Input
                            key={fields.username.key}
                            name={fields.username.name}
                            defaultValue={userData?.username}
                            id="LastName"
                            type="text"/>
                        <p className="pt-2 text-red-500 text-sm"
                        >{fields.username.errors}</p>
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 required">Bio</label>
                        <Textarea
                            value={bio}
                            key={fields.biography.key}
                            name={fields.biography.name}
                            id="bio"
                            maxLength={200} // Establece el límite de caracteres
                            onChange={handleBioChange}
                            className="w-full h-24 p-2 border rounded-lg"
                        />
                        <p className="pt-2 text-sm text-gray-500">
                            {bio.length}/200 characters
                        </p>
                        <p className="pt-2 text-red-500 text-sm">
                            {fields.biography.errors}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSave}>Save Changes</Button>
                </div>
            </form>
    )
}