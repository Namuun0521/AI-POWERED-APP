// export async function POST(req: Request) {
//   const { prompt } = await req.json();
//   const encodedPrompt = encodeURIComponent(prompt.trim());
//   const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
//   const imageRes = await fetch(imageUrl);
//   if (!imageRes.ok) {
//     return new Response("Failed tp generate image", { status: 500 });
//   }
//   return new Response(imageRes.body, {
//     headers: { "Content-Type": "image/png" },
//   });
// }
import { NextRequest, NextResponse } from "next/server";

const FOOD_IMAGES: Record<string, string[]> = {
  pizza: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80",
  ],
  burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop&q=80",
  ],
  sushi: [
    "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800&h=600&fit=crop&q=80",
  ],
  pasta: [
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&q=80",
  ],
  ramen: [
    "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&q=80",
  ],
  cake: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&h=600&fit=crop&q=80",
  ],
  salad: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80",
  ],
  steak: [
    "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop&q=80",
  ],
  chicken: [
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&h=600&fit=crop&q=80",
  ],
  sandwich: [
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&fit=crop&q=80",
  ],
};

const DEFAULT_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80",
];

function findFoodImage(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  for (const [food, images] of Object.entries(FOOD_IMAGES)) {
    if (lowerPrompt.includes(food)) {
      return images[Math.floor(Math.random() * images.length)];
    }
  }

  return DEFAULT_FOOD_IMAGES[
    Math.floor(Math.random() * DEFAULT_FOOD_IMAGES.length)
  ];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const imageUrl = findFoodImage(prompt);

    console.log("Food prompt:", prompt);
    console.log("Selected image:", imageUrl);

    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      throw new Error("Failed to fetch image");
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate image" },
      { status: 500 },
    );
  }
}
