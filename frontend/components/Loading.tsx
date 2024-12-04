export default function LoadingSpinner() {
    return (
        <div className="min-h-screen flex justify-center items-center text-center w-full">
            <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            {/* Style */}
            <style jsx>{`
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    width: 3rem;
                    height: 3rem;
                    border-top-color: #3498db;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
