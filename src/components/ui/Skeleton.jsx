const Skeleton = ({ className = "", height = "h-4", width = "w-full", rounded = "rounded" }) => {
    return <div className={`skeleton ${height} ${width} ${rounded} ${className}`}></div>;
};

export const TutorCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex flex-col items-center">
                <Skeleton height="h-48" width="w-48" rounded="rounded-full" />
                <div className="mt-4 w-full text-center">
                    <Skeleton height="h-6" width="w-3/4" className="mx-auto" />
                    <Skeleton height="h-4" width="w-1/2" className="mx-auto mt-2" />
                    <div className="mt-4">
                        <Skeleton height="h-4" width="w-full" className="mt-2" />
                        <Skeleton height="h-4" width="w-full" className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <Skeleton height="h-10" width="w-full" rounded="rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;