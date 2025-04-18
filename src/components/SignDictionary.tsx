import { useState } from "react";
import { Search, Filter, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

// Mock data for sign dictionary
const mockSigns = [
  { 
    id: 1, 
    name: "Hello", 
    category: "Greetings", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Hello' is made by extending your hand with your palm facing forward, fingers pointing up, and moving your hand in an arc from the side of your head outward, as if you're waving.",
    steps: [
      "Face your palm outward, with fingers pointing up",
      "Keep your elbow at your side",
      "Move your hand in an arc away from your body",
      "Smile while making this gesture for added friendliness"
    ],
    tips: "Keep the movement relaxed and natural, like a traditional wave."
  },
  { 
    id: 2, 
    name: "Thank You", 
    category: "Courtesy", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "To sign 'Thank You', extend your flat hand with fingers together from your chin forward. It's like blowing a kiss from your chin or mouth.",
    steps: [
      "Touch your chin or lips with the fingertips of your flat hand",
      "Move your hand forward and slightly up",
      "End with your palm facing up",
      "Make sure to maintain eye contact"
    ],
    tips: "This is one of the most important signs to know for basic communication."
  },
  { 
    id: 3, 
    name: "Please", 
    category: "Courtesy", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Please' is made by placing your flat hand on your chest and moving it in a circular motion clockwise. It shows politeness and respect.",
    steps: [
      "Place your dominant hand flat against the center of your chest",
      "Move your hand in a circular motion clockwise",
      "Keep your facial expression pleasant",
      "Make the motion once or twice"
    ],
    tips: "The circular motion should be smooth and deliberate, not too large or exaggerated."
  },
  { 
    id: 4, 
    name: "Sorry", 
    category: "Courtesy", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "To sign 'Sorry', make a fist with your right hand, and rub it in a circular motion over your heart. The expression on your face should also show remorse.",
    steps: [
      "Make a fist with your dominant hand",
      "Place it over your heart (center of chest)",
      "Rub in a circular motion",
      "Show a genuinely apologetic facial expression"
    ],
    tips: "The sincerity of your facial expression is as important as the hand movement itself."
  },
  { 
    id: 5, 
    name: "Help", 
    category: "Common", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Help' looks like one hand helping or lifting the other. Your dominant hand forms a thumbs-up and lifts your non-dominant flat hand.",
    steps: [
      "Place your non-dominant hand out flat, palm up",
      "Make a thumbs-up with your dominant hand",
      "Place your dominant hand under your non-dominant hand",
      "Lift both hands together slightly"
    ],
    tips: "Think of it as one hand literally helping or lifting the other hand up."
  },
  { 
    id: 6, 
    name: "Name", 
    category: "Questions", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "To sign 'Name', extend your index and middle fingers of both hands and tap them together twice. This simulates two people meeting and exchanging names.",
    steps: [
      "Extend the index and middle fingers of both hands (like making 'peace signs')",
      "Hold your hands in front of you, palms facing each other",
      "Tap the extended fingers of both hands together twice",
      "Maintain eye contact with the person you're asking"
    ],
    tips: "When asking someone's name, pair this sign with a questioning facial expression."
  },
  { 
    id: 7, 
    name: "Where", 
    category: "Questions", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Where' is made by shaking your index finger pointing in different directions with a questioning look, as if you're searching for something.",
    steps: [
      "Hold your dominant hand up with index finger extended (rest of fingers in a loose fist)",
      "Point your index finger in different directions (left, right, forward)",
      "Make a questioning facial expression with raised eyebrows",
      "Move your hand slightly as you change direction"
    ],
    tips: "Your facial expression is crucial—raise your eyebrows to show it's a question."
  },
  { 
    id: 8, 
    name: "When", 
    category: "Questions", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "To sign 'When', form your non-dominant hand into a 'C' shape, and tap the index finger of your dominant hand into the 'C' shape, while raising your eyebrows.",
    steps: [
      "Form a 'C' shape with your non-dominant hand, palm facing sideways",
      "Extend the index finger of your dominant hand",
      "Tap your index finger into the 'C' shape",
      "Raise your eyebrows to indicate a question"
    ],
    tips: "The 'C' hand shape represents a clock face, symbolizing time."
  },
  { 
    id: 9, 
    name: "Family", 
    category: "Relationships", 
    difficulty: "Hard", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Family' is made by first signing an 'F' handshape (index finger and thumb touching, other fingers extended) and then making a circle motion to include everyone.",
    steps: [
      "Make an 'F' handshape with both hands (index finger and thumb touching, other fingers extended)",
      "Start with both hands close to your chest",
      "Move both hands outward in a circular motion",
      "End with hands slightly apart to indicate inclusivity"
    ],
    tips: "The circular motion represents bringing everyone in the family together as a unit."
  },
  { 
    id: 10, 
    name: "Friend", 
    category: "Relationships", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "To sign 'Friend', hook your index fingers together, first one way and then the other. This represents two people linked or connected.",
    steps: [
      "Hold both hands in front of you with index fingers extended (other fingers in a fist)",
      "Hook your index fingers together",
      "Unhook and reverse the direction (hook them the other way)",
      "Do this motion smoothly"
    ],
    tips: "Think of it as two people becoming linked or connected in friendship."
  },
  { 
    id: 11, 
    name: "Love", 
    category: "Emotions", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Love' is made by crossing your arms over your chest, like giving yourself a hug. It's one of the most recognizable signs in ASL.",
    steps: [
      "Make fists with both hands, with thumbs extended upward",
      "Cross your arms over your chest (dominant arm on top)",
      "Touch your shoulders or upper chest with your fists",
      "Your expression should match the warmth of the word"
    ],
    tips: "This sign looks like hugging yourself, which represents the warmth of love."
  },
  { 
    id: 12, 
    name: "Happy", 
    category: "Emotions", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Happy' involves brushing your open hands up your chest and outward several times, like happiness flowing outward from your heart.",
    steps: [
      "Start with both open hands in front of your chest, palms facing your body",
      "Move both hands upward and outward in a repeated motion (2-3 times)",
      "Smile while making the sign",
      "The motion should be light and cheerful"
    ],
    tips: "Your facial expression is very important when signing emotions—make sure to smile!"
  },
  { 
    id: 13, 
    name: "How are you?", 
    category: "Greetings", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "This sign combines 'how' and 'you' gestures. Start with the 'how' sign by making a questioning face and moving your hands, then point to the person you're addressing.",
    steps: [
      "Make a questioning facial expression",
      "Hold your hands palm up in front of you",
      "Move your hands slightly outward and upward",
      "Point to the person you're addressing"
    ],
    tips: "Your facial expression is crucial for this sign - make sure to show genuine interest."
  },
  { 
    id: 14, 
    name: "What is your name?", 
    category: "Questions", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "This combines the signs for 'what' and 'name'. First make the 'what' sign, then the name sign by tapping your index and middle fingers together.",
    steps: [
      "Start with the 'what' sign - shaking your index finger side to side",
      "Then make the 'name' sign by extending index and middle fingers of both hands",
      "Tap these fingers together twice",
      "End with a questioning expression"
    ],
    tips: "Keep the movement fluid between the 'what' and 'name' signs for natural conversation."
  },
  { 
    id: 15, 
    name: "Can you help?", 
    category: "Questions", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'can' and 'help'. The help sign looks like one hand helping or lifting the other.",
    steps: [
      "Start with 'can' by making two 'C' hands and moving them up slightly",
      "Then make the 'help' sign by placing your dominant fist under your non-dominant flat palm",
      "Lift both hands together",
      "Show a questioning expression"
    ],
    tips: "The motion should be smooth and natural, showing genuine need for assistance."
  },
  { 
    id: 16, 
    name: "Good morning", 
    category: "Greetings", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'good' and 'morning'. The morning sign is like showing the sun rising.",
    steps: [
      "Start with the 'good' sign - touch your chin with your flat right hand",
      "Move your hand down and out",
      "For 'morning', bring your bent arm up like a rising sun",
      "Keep your facial expression bright and welcoming"
    ],
    tips: "This is a common greeting, so practice until it feels natural and fluid."
  },
  { 
    id: 17, 
    name: "Can you repeat?", 
    category: "Questions", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'repeat' involves rotating your index fingers around each other in a circular motion.",
    steps: [
      "Hold both hands up with index fingers extended",
      "Make circular motions with your index fingers around each other",
      "Add a questioning expression",
      "Make the motion twice for emphasis if needed"
    ],
    tips: "This is a very useful sign to know when learning. Don't be afraid to use it often!"
  },
  { 
    id: 18, 
    name: "Yes, I understand", 
    category: "Common", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'yes' and 'understand'. The understand sign looks like knowledge entering your head.",
    steps: [
      "Start with the 'yes' sign - make a fist that nods like a head nodding",
      "Then make the 'understand' sign by touching your temple",
      "Move your hand forward from your temple",
      "Nod your head while signing for emphasis"
    ],
    tips: "Your facial expression should show confidence and comprehension."
  },
  { 
    id: 19, 
    name: "No, I don't know", 
    category: "Common", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'no' and 'don't know'. The don't know sign looks like shrugging.",
    steps: [
      "Start with the 'no' sign - extending index and middle fingers, moving them side to side",
      "Then shrug your shoulders slightly",
      "Raise your hands palm up at shoulder level",
      "Show a slightly confused expression"
    ],
    tips: "Keep the movement natural and don't exaggerate the shrug too much."
  },
  { 
    id: 20, 
    name: "Thank you, that's nice", 
    category: "Courtesy", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'thank you' and 'nice'. The nice sign is similar to good but with a different motion.",
    steps: [
      "Start with 'thank you' by touching your chin and moving forward",
      "Then make the 'nice' sign by placing your flat hand on your chest",
      "Move your hand in a small circle on your chest",
      "Smile while signing"
    ],
    tips: "This is a great way to show appreciation. Make sure your facial expression matches your gratitude."
  },
  { 
    id: 21, 
    name: "What do you like?", 
    category: "Questions", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'what' and 'like'. The like sign is made by moving your flat hand up your chest.",
    steps: [
      "Start with the 'what' sign - shake your index finger",
      "Then make the 'like' sign by placing your flat hand on your chest",
      "Move your hand upward on your chest",
      "End with a questioning expression"
    ],
    tips: "Make sure to show interest in your facial expression when asking this question."
  },
  { 
    id: 22, 
    name: "Tell me more", 
    category: "Common", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "Combine the signs for 'tell' and 'more'. The more sign looks like bringing things together.",
    steps: [
      "Start with the 'tell' sign - index finger moving from your mouth outward",
      "Then make the 'more' sign by bringing your fingers together repeatedly",
      "Keep your movements clear and deliberate",
      "Show interest in your facial expression"
    ],
    tips: "This is a great way to encourage conversation and show you're engaged."
  }
];

// Mock data for alphabet signs
const alphabetSigns = [
  { 
    id: 1, 
    name: "A", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'A' is made by making a fist with your hand, with your thumb resting against the side of your index finger.",
    steps: [
      "Make a fist with your dominant hand",
      "Ensure your thumb is resting along the side of your index finger",
      "Keep your palm facing outward",
      "Hold the position clearly"
    ],
    tips: "Keep your hand relaxed but firm, and make sure your thumbnail is visible from the front view."
  },
  { 
    id: 2, 
    name: "B", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'B' is made by holding your hand up with your palm facing forward and your fingers pointing upward, with your thumb tucked against the palm.",
    steps: [
      "Hold your hand up with all four fingers extended and together",
      "Tuck your thumb against your palm",
      "Keep your palm facing forward",
      "Hold the position clearly"
    ],
    tips: "Think of your hand as creating the shape of a capital 'B' from the side view."
  },
  { 
    id: 3, 
    name: "C", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'C' is made by curving your hand into the shape of the letter C, with your thumb and fingers forming a half-circle.",
    steps: [
      "Position your hand with your palm facing sideways (toward your right if right-handed)",
      "Curve all fingers and thumb to form a C shape",
      "Make sure there's a clear opening between thumb and fingers",
      "Maintain the curved shape"
    ],
    tips: "The 'C' handshape is used in many other signs, so mastering this shape will help with learning additional vocabulary."
  },
  { 
    id: 4, 
    name: "D", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'D' is made by forming a circle with your thumb and index finger while keeping your other fingers straight up.",
    steps: [
      "Touch the tip of your thumb to the tip of your index finger, forming a circle",
      "Keep your middle, ring, and pinky fingers straight up",
      "Face your palm forward",
      "Keep the shape firm"
    ],
    tips: "The 'D' handshape should resemble the uppercase letter D, with the straight fingers forming the straight line."
  },
  { 
    id: 5, 
    name: "E", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'E' is made by curling all fingers in so that the fingernails rest against the palm, with the thumb tucked against the index finger.",
    steps: [
      "Curl all fingers so the fingernails touch the palm",
      "Tuck your thumb against the side of your index finger",
      "Face your palm toward the person you're communicating with",
      "Hold the position clearly"
    ],
    tips: "The 'E' handshape can be easily confused with the 'A' handshape. In 'E', the fingertips are visible against the palm, while in 'A', the fingers are fully closed."
  },
  { 
    id: 6, 
    name: "F", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'F' is made by touching your thumb and index finger together to form a circle, while extending your other three fingers.",
    steps: [
      "Connect your thumb and index finger to create a small circle or 'O' shape",
      "Extend your middle, ring, and pinky fingers straight up",
      "Keep your palm facing to the side or slightly forward",
      "Hold the position clearly"
    ],
    tips: "The 'F' handshape is similar to the 'D' handshape, but with the palm orientation changed slightly to the side rather than directly forward."
  },
  { 
    id: 7, 
    name: "G", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'G' is made by extending your index finger and thumb, with the thumb and index finger parallel to each other pointing forward.",
    steps: [
      "Extend your index finger straight forward",
      "Extend your thumb to the side, parallel to your index finger",
      "Keep your middle, ring, and pinky fingers curled into your palm",
      "Point your index finger forward, not up"
    ],
    tips: "The 'G' handshape resembles a gun shape. Be sure to point forward, not upward, to distinguish it from other letters."
  },
  { 
    id: 8, 
    name: "H", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'H' is made by extending your index and middle fingers together side by side, while keeping your other fingers closed.",
    steps: [
      "Extend your index and middle fingers, keeping them together side by side",
      "Close your ring and pinky fingers against your palm",
      "Position your thumb alongside your closed fingers",
      "Keep your palm facing to the side"
    ],
    tips: "The 'H' handshape can be remembered as showing two fingers, just as the letter H has two vertical lines."
  },
  { 
    id: 9, 
    name: "I", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'I' is made by extending only your pinky finger while keeping all other fingers closed into a fist.",
    steps: [
      "Make a fist with your hand",
      "Extend only your pinky finger straight up",
      "Keep your palm facing forward or slightly to the side",
      "Hold the position clearly"
    ],
    tips: "The 'I' handshape is also used for the number 9 in some counting systems in sign language."
  },
  { 
    id: 10, 
    name: "J", 
    category: "Alphabet", 
    difficulty: "Hard", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'J' is made by extending your pinky finger and tracing the letter J in the air, starting with an upward motion and ending with a hook to the side.",
    steps: [
      "Start with the 'I' handshape (pinky extended, other fingers in a fist)",
      "Move your hand in a J-shaped motion",
      "Start by moving slightly upward, then curve down and hook to the side",
      "The motion should be smooth and clearly form a J shape"
    ],
    tips: "This is one of the few letters that requires movement. Practice the smooth J-shaped motion several times to perfect it."
  },
  { 
    id: 11, 
    name: "K", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'K' is made by extending your index finger, middle finger, and thumb up, with the index and middle fingers together and the thumb extended to the side.",
    steps: [
      "Extend your index and middle fingers, keeping them together",
      "Extend your thumb outward to the side",
      "Keep your ring and pinky fingers closed against your palm",
      "Position your palm facing forward"
    ],
    tips: "In the 'K' handshape, your index and middle finger represent the two upward strokes of the letter K, while your thumb represents the diagonal stroke."
  },
  { 
    id: 12, 
    name: "L", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'L' is made by extending your index finger straight up and your thumb out to the side, forming a right angle or 'L' shape.",
    steps: [
      "Extend your index finger straight up",
      "Extend your thumb out to the side, at a right angle to your index finger",
      "Keep your middle, ring, and pinky fingers curled into your palm",
      "Hold your palm facing forward"
    ],
    tips: "This handshape forms a clear 'L' shape with your thumb and index finger, making it one of the more intuitive letter signs to remember."
  },
  { 
    id: 13, 
    name: "M", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'M' is made by placing your thumb between your ring and pinky fingers, with your other fingers folded over your thumb.",
    steps: [
      "Place your thumb between your ring and pinky fingers",
      "Fold your index, middle, and ring fingers over your thumb",
      "Keep your palm facing down",
      "Make sure your thumb is visible between your fingers"
    ],
    tips: "Think of the three fingers folded over as representing the three strokes of the letter M. This helps remember this handshape."
  },
  { 
    id: 14, 
    name: "N", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'N' is made by placing your thumb between your middle and ring fingers, with your other fingers folded over your thumb.",
    steps: [
      "Place your thumb between your middle and ring fingers",
      "Fold your index and middle fingers over your thumb",
      "Keep your palm facing down",
      "Ensure your thumb is visible between your fingers"
    ],
    tips: "The 'N' handshape is similar to 'M', but with the thumb positioned one finger over. Think of the two fingers folded as the two strokes of the letter N."
  },
  { 
    id: 15, 
    name: "O", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'O' is made by forming a circle shape with all your fingers and thumb touching at the tips.",
    steps: [
      "Touch all fingertips to the tip of your thumb, forming a circular shape",
      "Keep the shape rounded and clear",
      "Position your palm facing forward",
      "Make sure the circle is complete with no gaps"
    ],
    tips: "Think of shaping your hand like the letter O itself. This handshape is also used in many other signs, so it's important to master."
  },
  { 
    id: 16, 
    name: "P", 
    category: "Alphabet", 
    difficulty: "Hard", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'P' is made by extending your index, middle, and thumb as if pointing downward, with your index and middle fingers pointing down and your thumb pointing to the side.",
    steps: [
      "Point your middle finger downward",
      "Keep your index finger aligned with your middle finger",
      "Position your thumb pointing to the side",
      "Keep your ring and pinky fingers curled into your palm"
    ],
    tips: "The 'P' handshape can be visualized as the top loop of a P, formed by your thumb and index finger, with the straight part of the P formed by your middle finger."
  },
  { 
    id: 17, 
    name: "Q", 
    category: "Alphabet", 
    difficulty: "Hard", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Q' is made by bringing your index finger and thumb together to form a circle at the bottom, with the rest of your hand closed in a fist, pointing downward.",
    steps: [
      "Form a circle with your index finger and thumb at the bottom",
      "Point your hand downward",
      "Keep your other fingers curled into a fist",
      "Position your palm facing down and slightly inward"
    ],
    tips: "Think of the circle formed by your index finger and thumb as the circular part of the letter Q, with your hand position representing the tail of the Q."
  },
  { 
    id: 18, 
    name: "R", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'R' is made by crossing your index and middle fingers while extending them upward, with your thumb touching your ring and pinky fingers.",
    steps: [
      "Cross your index finger over your middle finger",
      "Extend both crossed fingers upward",
      "Keep your thumb, ring, and pinky fingers together",
      "Position your palm facing forward"
    ],
    tips: "The crossed fingers in the 'R' handshape represent the diagonal stroke in the uppercase letter R. Practice keeping your fingers crossed while maintaining the shape."
  },
  { 
    id: 19, 
    name: "S", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'S' is made by forming a fist with your thumb wrapped over your fingers, resting on top of your fingers.",
    steps: [
      "Make a fist with your hand",
      "Place your thumb on top of your fingers",
      "Keep your palm facing forward",
      "Make sure your thumb is visible from the front"
    ],
    tips: "This is one of the simpler handshapes but can be confused with other letters. Ensure your thumb is clearly visible resting on top of your fingers."
  },
  { 
    id: 20, 
    name: "T", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'T' is made by making a fist and placing your thumb between your index and middle fingers.",
    steps: [
      "Make a fist with all fingers",
      "Place your thumb between your index and middle fingers",
      "Keep your thumb visible between the fingers",
      "Position your palm facing forward"
    ],
    tips: "Your thumb placement is crucial for the 'T' handshape - it should be clearly visible between your index and middle fingers."
  },
  { 
    id: 21, 
    name: "U", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'U' is made by extending your index and middle fingers upward while keeping them together, with other fingers closed.",
    steps: [
      "Extend your index and middle fingers upward, keeping them together",
      "Keep your ring and pinky fingers closed against your palm",
      "Tuck your thumb against your closed fingers",
      "Position your palm facing forward"
    ],
    tips: "The 'U' handshape can be remembered as showing two fingers, just like the letter U has two upward strokes. This shape is also used for the number 2."
  },
  { 
    id: 22, 
    name: "V", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'V' is made by extending your index and middle fingers in a V shape, while keeping your other fingers closed.",
    steps: [
      "Extend your index and middle fingers, separating them to form a V shape",
      "Keep your ring and pinky fingers closed against your palm",
      "Tuck your thumb against your closed fingers",
      "Position your palm facing forward"
    ],
    tips: "The 'V' handshape is also commonly used as a peace sign. Make sure your two fingers form a clear V shape with space between them."
  },
  { 
    id: 23, 
    name: "W", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'W' is made by extending your index, middle, and ring fingers to form three prongs, while keeping your pinky and thumb closed.",
    steps: [
      "Extend your index, middle, and ring fingers",
      "Keep all three fingers separated and straight",
      "Keep your pinky finger closed against your palm",
      "Tuck your thumb against your closed pinky",
      "Position your palm facing forward"
    ],
    tips: "The three extended fingers in the 'W' handshape represent the three points of the letter W. This shape is also used for the number 3."
  },
  { 
    id: 24, 
    name: "X", 
    category: "Alphabet", 
    difficulty: "Medium", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'X' is made by bending your index finger into a hook shape, while keeping all other fingers closed in a fist.",
    steps: [
      "Make a fist with your hand",
      "Slightly bend your index finger to form a hook or claw shape",
      "Keep all other fingers closed",
      "Position your palm facing to the side"
    ],
    tips: "The hooked index finger in the 'X' handshape resembles the curved part of the letter X. This is a subtle handshape that requires practice to distinguish from others."
  },
  { 
    id: 25, 
    name: "Y", 
    category: "Alphabet", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Y' is made by extending your thumb and pinky finger outward while keeping your other fingers closed.",
    steps: [
      "Extend your thumb and pinky
