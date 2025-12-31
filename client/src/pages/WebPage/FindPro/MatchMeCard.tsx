import { ShieldCheck } from "lucide-react";

export default function MatchMeCard() {
  return (
    <div className="rounded-lg border border-[#F5D238] bg-white shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-lg bg-[#F5D238]/10 border border-[#F5D238]/20 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-[#F5D238]" />
        </div>
        <div className="font-bold text-[#1A1B16] text-lg leading-tight">Want us to match you with a contractor with $250K Guarantee?</div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Provide your project details and we will find the best fit for your needs.</p>
      <button className="w-full rounded-lg bg-[#1A1B16] hover:bg-black text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
        Find me a pro
      </button>
      <p className="mt-3 text-xs text-gray-500 text-center">* Full Coverage Guarantee is only provided by GU Elite contractors</p>
    </div>
  );
}
