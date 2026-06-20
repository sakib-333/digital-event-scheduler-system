import { Spinner } from './ui/spinner'

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Spinner className="size-8" />
                <h1>Loading...</h1>
            </div>
        </div>
    )
}

export default LoadingSpinner