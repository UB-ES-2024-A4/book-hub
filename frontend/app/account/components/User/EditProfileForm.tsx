"use client";
import {useFormState} from "react-dom";
import {userInformationSchema} from "@/app/lib/zodSchemas";
import {CreatePost, UpdateUser} from "@/app/actions";
import {SubmissionResult, useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {PropsUser} from "@/app/types/PropsUser";
import {toast} from "nextjs-toast-notify";
import {User} from "@/app/types/User";
import {useFeed} from "@/contex/FeedContext";

type Props =  PropsUser & {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProfileForm ({ setIsEditing, userData, setUser}: Props) {
    const [newUserData, setNewUserData] = useState<User | null>(null);
    const [serverError, setServerError] = useState<{status: number, message: string} | null>(null);

    const { addUserData } = useFeed();

     const [lastResult, action] = useFormState(async (prevState: unknown, formData: FormData) => {
        const result = await UpdateUser(prevState, formData);
        const submission: SubmissionResult = {status: "success",}
        console.log("MESSAGE", result);
        if(!result.status) return submission;

        if (result.status !== 200) {
            toast.error(result.message, {
                duration: 4000,
                progress: true,
                position: "top-center",
                transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
                sonido: true,
              });
            console.log("result message", result.message);
        }else{
            // Load information from the server data
            setNewUserData(result.data);
            toast.info(" ¡ Successfully changed ! ", {
                duration: 4000, progress: true, position: "bottom-center", transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
                    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
                    'class="lucide lucide-check z-50"><path d="M20 6 9 17l-5-5"/></svg>',
                sonido: true,
            });
        }
        setServerError({status: result.status, message: result.message});

        return submission;
    }, undefined);

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
        console.log("ERROR SERVER", serverError);
        if (serverError && serverError.status != 200){
            if(serverError.status ==  403) {
                // Esperar 2 segundos antes de redirigir
            }
        }
        else {
        console.log("DATA NEW USER DATA____________________", newUserData);
            // Load information from the server data
            const newUser: User = {
                id: userData.id,
                first_name: newUserData?.first_name || "",
                last_name: newUserData?.last_name || "",
                username: newUserData?.username || "",
                biography: newUserData?.biography || "",
                email: newUserData?.email || "",
            };
            setUser(newUser);
            addUserData(newUser);
            setIsEditing(false);
        }
    }

    // Save the changes when the server error is resolved
    useEffect(() => {
        if (serverError !== null) {
            handleSave();
        }
    }, [serverError]);

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
                    <Button type="submit" >Save Changes</Button>
                </div>
            </form>
    )
}