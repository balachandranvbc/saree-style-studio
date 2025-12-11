import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DRAPING_STYLE_PROMPTS: Record<string, string> = {
  nivi: "Nivi style draping - the most common style with pleats tucked at the waist center, pallu draped over the left shoulder",
  bengali: "Bengali style draping - pleats tucked at the front right side, pallu brought from behind over the right shoulder, with signature key-hole style front drape",
  gujarati: "Gujarati style draping - pallu is draped from the back over the right shoulder to the front, with pleats at the back",
  tamil_nadu: "Tamil Nadu/Madurai style draping - saree is pleated at the front like Nivi but the pallu is longer and draped around the waist again before going over shoulder",
  kerala: "Kerala Kasavu style - white/cream saree with golden border, pallu tucked at the waist and draped over the left shoulder, very simple and elegant",
  modern_lehenga: "Modern lehenga style draping - saree worn like a lehenga with pre-stitched pleats and pallu pinned at shoulder, giving a contemporary look",
  maharashtrian: "Maharashtrian Nauvari style - 9-yard saree draped like dhoti pants, with fabric pulled between legs and tucked at back"
};

const FABRIC_DESCRIPTIONS: Record<string, string> = {
  silk: "luxurious pure silk with natural sheen and rich texture, heavy fall and smooth drape",
  cotton: "soft handloom cotton with matte finish, light and breathable with natural texture",
  organza: "sheer transparent organza with crisp finish, delicate and flowy",
  georgette: "flowing georgette with subtle crepe texture, elegant drape and movement",
  chiffon: "lightweight sheer chiffon, extremely soft with graceful flow",
  banarasi: "heavy Banarasi brocade silk with intricate gold/silver zari work and motifs",
  kanjivaram: "rich Kanjivaram silk with heavy golden border and traditional temple motifs",
  chanderi: "delicate Chanderi fabric with subtle sheen, lightweight with fine texture"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      imageBase64, 
      drapingStyle, 
      sareeColor, 
      secondaryColor,
      fabric,
      borderStyle,
      pattern,
      poseData,
      measurements
    } = await req.json();

    console.log('Received drape request:', { 
      drapingStyle, 
      sareeColor, 
      fabric,
      hasImage: !!imageBase64,
      hasPoseData: !!poseData 
    });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build the detailed prompt for saree draping
    const styleDescription = DRAPING_STYLE_PROMPTS[drapingStyle] || DRAPING_STYLE_PROMPTS.nivi;
    const fabricDescription = FABRIC_DESCRIPTIONS[fabric] || FABRIC_DESCRIPTIONS.silk;

    const drapingPrompt = `You are an expert at virtual fashion try-on, specifically for Indian sarees. 

TASK: Drape a beautiful saree on the person in this image while keeping their face, pose, body proportions, and the original photo's lighting perfectly intact.

SAREE SPECIFICATIONS:
- Primary Color: ${sareeColor || 'deep maroon red'}
${secondaryColor ? `- Secondary/Border Color: ${secondaryColor}` : ''}
- Fabric: ${fabricDescription}
- Draping Style: ${styleDescription}
${borderStyle ? `- Border Style: ${borderStyle}` : ''}
${pattern ? `- Pattern/Design: ${pattern}` : ''}

DRAPING REQUIREMENTS:
1. The saree MUST look like real cloth with natural physics - proper folds, pleats, tension, and draping
2. Match the lighting, shadows, and color temperature of the original photo exactly
3. Show realistic fabric texture and sheen appropriate for ${fabric || 'silk'}
4. The pleats should have natural depth and shadow
5. The pallu should flow naturally according to the ${drapingStyle} style
6. Add subtle fabric movement where appropriate (like at pallu edges)
7. Ensure the saree fits the body proportions naturally - not too tight, not floating
8. Keep the person's face, hair, jewelry (if any), and background completely unchanged
9. The blouse should complement the saree color and be appropriate for the style

${measurements ? `BODY MEASUREMENTS for fit reference:
- Shoulder width: ${measurements.shoulderWidth}cm
- Height: ${measurements.height}cm
- Bust: ${measurements.bust}cm
- Waist: ${measurements.waist}cm
- Hips: ${measurements.hips}cm` : ''}

${poseData ? `POSE INFORMATION:
The person's pose has been detected. Ensure the saree draping follows the body contours naturally.` : ''}

OUTPUT: Generate a photorealistic image of the person wearing the saree. The result should look like a professional fashion photograph, not an AI-generated image.`;

    console.log('Sending request to AI gateway for image generation...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: drapingPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          code: 'RATE_LIMIT'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI usage limit reached. Please add credits to continue.',
          code: 'PAYMENT_REQUIRED'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received, extracting image...');

    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImage) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated by AI');
    }

    console.log('Successfully generated draped saree image');

    return new Response(JSON.stringify({ 
      success: true,
      resultImage: generatedImage,
      description: textResponse,
      drapingStyle,
      fabric
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in drape-saree function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'PROCESSING_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
