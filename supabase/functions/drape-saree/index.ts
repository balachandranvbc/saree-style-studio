import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Detailed prompts for each draping style - accurate real-world descriptions
const DRAPING_STYLE_PROMPTS: Record<string, string> = {
  nivi: `NIVI STYLE (Modern/Andhra Pradesh):
- Pleats (5-7) tucked at the waist CENTER, fanning outward
- Pallu draped diagonally from right hip, across body, over LEFT shoulder
- Pallu falls at back reaching just below hip level
- Front pleats should be crisp and evenly spaced
- Blouse paired with matching or contrasting color`,

  bengali: `BENGALI STYLE (Kolkata/West Bengal):
- NO FRONT PLEATS at all - this is the key difference
- Saree wrapped around body starting from left
- Pallu brought from BACK over RIGHT shoulder (signature key-hole style)
- Creates a distinctive front drape with the pallu showing prominently
- A portion of pallu hangs at the front in a decorative loop (the "key")
- Often paired with red-bordered white saree (Lal Paar) for festivals`,

  gujarati: `GUJARATI SEEDHA PALLU STYLE:
- Pleats tucked at LEFT side of waist (not center)
- Pallu comes from BACK, over RIGHT shoulder, and falls to the FRONT
- Pallu displayed prominently in front showing all the work/design
- The pallu end is tucked or pinned at right shoulder
- Creates a diagonal line across the torso
- Perfect for showing off designer pallu work`,

  tamil: `TAMIL NADU MADISAR STYLE (Traditional Brahmin):
- Complex wrap using 9-yard saree
- Creates V-shaped drape at the front
- Fabric is wrapped between legs (like dhoti) from back
- Front pleats are tucked slightly to the right
- Multiple folds create layered appearance
- Pallu goes over RIGHT shoulder and wraps around
- Very structured, for religious ceremonies`,

  kerala: `KERALA KASAVU STYLE (Mundum Neriyathum):
- Traditional TWO-PIECE style (mundu + neriyathu)
- Base: White/cream with GOLDEN (kasavu) border
- Extremely simple, minimal pleating (2-4 pleats)
- Lower portion wrapped like lungi
- Upper portion (neriyathu) draped over left shoulder
- Golden border creates the signature look
- Very clean, elegant, modest draping`,

  maharashtrian: `MAHARASHTRIAN NAUVARI STYLE (9-yard):
- DHOTI-STYLE wrapping - fabric passed between legs
- Creates pants-like lower draping
- Pleats tucked at BACK (not front)
- Very practical for movement and dance
- Pallu wrapped around waist and tucked
- Often worn with traditional jewelry (nath, green bangles)
- Power pose - shows strength and tradition`,

  lehenga: `LEHENGA STYLE SAREE (Modern/Bridal):
- Pre-stitched or heavily pleated circular pleats (10-15 pleats)
- Creates lehenga-like flare at the bottom
- Pleats sewn/stitched to fall in circles like a skirt
- Pallu PINNED at shoulder with decorative brooch
- Pallu spread out beautifully showing all embroidery
- Often has can-can underneath for volume
- Popular for weddings and receptions`,

  hyderabadi: `HYDERABADI KHADA DUPATTA STYLE:
- Royal Nawabi style from Hyderabad
- Standing vertical pleats in front
- Pallu worn like a DUPATTA over both shoulders
- Creates regal, dignified appearance
- Often paired with heavy jewelry
- Pallu edges visible on both sides
- Perfect for formal events`,

  coorgi: `COORGI STYLE (Karnataka/Kodagu):
- Unique BACK-PLEATED style
- All pleats are at the BACK, not front
- Creates smooth front appearance
- Pallu wrapped TIGHTLY around right shoulder
- Very secure draping for active work
- Traditional for Kodava community
- Often worn with distinctive Coorgi jewelry`,

  bengali_lalpaar: `BENGALI LAL PAAR STYLE (Festive):
- Same as Bengali style BUT with specific colors
- WHITE base saree with RED (lal) border (paar)
- Worn specifically during Durga Puja
- Signature married woman's look in Bengal
- Red sindoor, red alta on feet complement the look
- Pallu key-hole style over right shoulder
- Symbol of Bengali cultural identity`
};

// Detailed fabric descriptions for realistic rendering
const FABRIC_DESCRIPTIONS: Record<string, string> = {
  silk: "pure mulberry silk with natural luminous sheen, medium-heavy weight with elegant drape, smooth texture with subtle luster that catches light beautifully",
  cotton: "soft handwoven cotton with natural matte finish, breathable and lightweight, shows natural texture and slight irregularities of handloom",
  organza: "sheer transparent organza with crisp finish, extremely lightweight, holds shape well, slightly stiff with glass-like transparency",
  georgette: "flowing pure georgette with subtle crepe texture, lightweight with beautiful movement, slightly grainy surface, elegant drape",
  chiffon: "ultra-lightweight sheer chiffon, extremely soft and floaty, translucent with graceful flow and movement",
  banarasi: "heavy Banarasi brocade silk with intricate gold/silver metallic zari weaving, rich texture with raised patterns, luxurious weight",
  kanjivaram: "premium Kanjivaram silk with distinctive thick gold zari border, heavy weight with stiff drape, shows temple motifs and traditional designs",
  chanderi: "delicate Chanderi silk-cotton blend with subtle golden sheen, lightweight with fine texture, traditional buttis (small motifs)"
};

serve(async (req) => {
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

    const styleDescription = DRAPING_STYLE_PROMPTS[drapingStyle] || DRAPING_STYLE_PROMPTS.nivi;
    const fabricDescription = FABRIC_DESCRIPTIONS[fabric] || FABRIC_DESCRIPTIONS.silk;

    // Enhanced photorealistic prompt
    const drapingPrompt = `You are an expert fashion photographer and virtual stylist specializing in Indian sarees.

**CRITICAL TASK**: Dress the person in this photo with a beautiful saree while maintaining PERFECT photorealism. The result must look like an actual photograph, not AI-generated.

**SAREE SPECIFICATIONS**:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Color: ${sareeColor || '#8B0000'} (ensure exact color match)
${secondaryColor ? `Secondary/Border Color: ${secondaryColor}` : 'Border: Gold zari'}
Fabric: ${fabricDescription}
${borderStyle ? `Border Design: ${borderStyle}` : ''}
${pattern ? `Pattern/Motifs: ${pattern}` : ''}

**DRAPING STYLE - FOLLOW EXACTLY**:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${styleDescription}

**CLOTH PHYSICS REQUIREMENTS**:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. REALISTIC FOLDS: Natural fabric folds at waist, pleats, and pallu
2. WEIGHT: Show proper gravity - heavier at bottom, flowing at top
3. TENSION: Fabric tension at shoulder and waist anchor points
4. DRAPE: Natural drape following body contours
5. SHADOWS: Self-shadowing in folds and pleats
6. HIGHLIGHTS: Fabric sheen appropriate for ${fabric || 'silk'}
7. MOVEMENT: Slight natural movement in pallu edges

**BODY FIT REQUIREMENTS**:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Blouse: Well-fitted, matching/complementary color
- Waist: Saree sits naturally at waist level
- Pleats: Fall naturally from waist to feet
- Pallu: Proper length and spread for the style
${measurements ? `
MEASUREMENTS FOR FIT:
- Height: ${measurements.height}cm
- Shoulder Width: ${measurements.shoulderWidth}cm
- Bust: ${measurements.bust}cm  
- Waist: ${measurements.waist}cm
- Hips: ${measurements.hips}cm` : ''}

**PRESERVATION RULES**:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Keep face EXACTLY as original - no changes
✓ Keep hair style and color unchanged
✓ Keep background identical
✓ Match original lighting perfectly
✓ Match skin tone and complexion
✓ Preserve any existing jewelry if present
✓ Keep pose and posture unchanged

**OUTPUT QUALITY**:
Generate a PHOTOREALISTIC image indistinguishable from a real fashion photograph. Professional studio quality.`;

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
