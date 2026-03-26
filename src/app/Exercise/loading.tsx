import Loading from "@/components/_ui/Loading";

/**
 * Exercise Pages Loading Component
 * 
 * Shown during route transitions within Exercise routes.
 * Provides visual feedback while exercise data is being loaded.
 */
export default function ExerciseLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-40">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                <Loading 
                    variant="spinner" 
                    size="xl" 
                    colorClass="text-[#4F85A6]"
                    notAbsolute
                />
                <p className="mt-4 text-lg text-[#3f3c40] font-medium">
                    Carregando exercício...
                </p>
                <p className="mt-2 text-sm text-[#4F85A6]">
                    Por favor, aguarde
                </p>
            </div>
        </div>
    );
}
