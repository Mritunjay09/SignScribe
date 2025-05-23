
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignEntry } from "@/types/dictionary";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SignCardProps {
  sign: SignEntry;
  onLearnMore: (sign: SignEntry) => void;
}

export function SignCard({ sign, onLearnMore }: SignCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={sign.imagePath} alt={sign.name} />
          <AvatarFallback className="bg-purple-100 text-purple text-lg">
            {sign.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{sign.name}</h3>
          <span className="bg-slate-100 text-slate px-2 py-1 rounded-full text-xs">
            {sign.difficulty}
          </span>
        </div>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {sign.description}
        </p>
        <Button
          variant="outline"
          className="w-full border-purple text-purple hover:bg-purple hover:text-white"
          onClick={() => onLearnMore(sign)}
        >
          Learn Sign
        </Button>
      </CardContent>
    </Card>
  );
}
