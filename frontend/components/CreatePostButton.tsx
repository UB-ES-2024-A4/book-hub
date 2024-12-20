type CreatePostButtonProps = {
    openDialog: () => void;
}

export default function CreatePostButton({openDialog}: CreatePostButtonProps) {
    return (<div onClick={openDialog}
                     className={`transition-colors duration-300 cursor-pointer text-gray-300 hover:text-blue-600`}>
            Create Post</div>
    );
}