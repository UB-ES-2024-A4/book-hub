type CreatePostButtonProps = {
    openDialog: () => void;
}

export default function CreatePostButton({openDialog}: CreatePostButtonProps) {
    return (<div onClick={openDialog}
                     className={`path transition-colors duration-300 cursor-pointer text-gray-300`}>
            Create Post</div>
    );
}