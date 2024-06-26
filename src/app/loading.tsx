import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-neutral-100 dark:bg-background">
            <Spinner />
        </div>
    )
}