
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SignCard } from "./dictionary/SignCard";
import { SignDetailsDialog } from "./dictionary/SignDetailsDialog";
import { mockSigns } from "@/data/commonSigns";
import { alphabetSigns } from "@/data/alphabetSigns";
import { SignEntry } from "@/types/dictionary";

interface SignDictionaryProps {
  showAlphabet?: boolean;
}

export function SignDictionary({ showAlphabet = false }: SignDictionaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSign, setSelectedSign] = useState<SignEntry | null>(null);

  const signs = showAlphabet ? alphabetSigns : mockSigns;

  const filteredSigns = signs.filter((sign) =>
    sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sign.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search signs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSigns.map((sign) => (
          <SignCard
            key={sign.id}
            sign={sign}
            onLearnMore={setSelectedSign}
          />
        ))}
      </div>

      <SignDetailsDialog
        sign={selectedSign}
        isOpen={!!selectedSign}
        onClose={() => setSelectedSign(null)}
      />
    </div>
  );
}
