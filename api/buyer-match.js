import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const catalog = [
  { id:'demo-1', title:'Monsoon Garden Panel', craft:'Madhubani', price:'₹4,800', location:'Bihar', description:'Hand-painted narrative panel with bold floral and nature motifs.', tags:['wall art','colorful','storytelling','home decor'] },
  { id:'demo-2', title:'Lotus Memory Vessel', craft:'Dhokra', price:'₹3,200', location:'Chhattisgarh', description:'Decorative metal vessel inspired by organic Indian forms.', tags:['metal','sculpture','decor','collectible'] },
  { id:'demo-3', title:'Indigo Geometry Saree', craft:'Handloom', price:'₹6,900', location:'Telangana', description:'Contemporary handwoven textile balancing traditional craft and geometric design.', tags:['textile','fashion','indigo','handwoven'] },
  { id:'demo-4', title:'Birds of the Coast', craft:'Pattachitra', price:'₹5,600', location:'Odisha', description:'Detailed narrative artwork with birds and nature-inspired composition.', tags:['painting','collector','storytelling','nature'] },
  { id:'demo-5', title:'Forest Lines Textile', craft:'Kalamkari', price:'₹7,200', location:'Andhra Pradesh', description:'Decorative textile study with hand-drawn organic motifs.', tags:['textile','wall decor','natural','pattern'] },
  { id:'demo-6', title:'Phulkari Sunburst', craft:'Phulkari', price:'₹5,400', location:'Punjab', description:'Embroidered textile with a bright radial floral composition.', tags:['embroidery','textile','gifting','colorful'] },
  { id:'demo-7', title:'Earth & Grain Wall Weave', craft:'Weaving', price:'₹8,900', location:'Telangana', description:'Textural woven wall piece designed for warm contemporary interiors.', tags:['wall decor','neutral','texture','interiors'] },
  { id:'demo-8', title:'Village Stories Triptych', craft:'Warli', price:'₹6,100', location:'Maharashtra', description:'Narrative folk-art panels depicting community and everyday life.', tags:['folk art','wall art','storytelling','culture'] }
];

function fallback(preferences) {
  const text = preferences.toLowerCase();
  const rules = [
    [/wall|decor|interior|home/, ['demo-7','demo-1','demo-8','demo-4']],
    [/textile|fabric|weav|saree|fashion/, ['demo-3','demo-6','demo-5','demo-7']],
    [/collect|museum|painting|artwork|folk|culture/, ['demo-4','demo-8','demo-1','demo-2']],
    [/gift|gifting/, ['demo-6','demo-2','demo-1','demo-4']]
  ];
  const ids = rules.find(([rx])=>rx.test(text))?.[1] || ['demo-1','demo-4','demo-7','demo-6'];
  return { category:'AI-curated Indian craft discovery', intent:'Find artwork matching the buyer description', keywords:text.split(/\s+/).filter(Boolean).slice(0,8), matches:ids.map((id,i)=>({product:catalog.find(p=>p.id===id),match_percentage:[95,88,82,76][i],reason:i===0?'Strongest fit for the stated preference.':'Similar visual, craft or use-case fit.'})) , disclaimer:'Demo recommendation: add OPENAI_API_KEY for live AI reasoning.' };
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  try{
    const {preferences='',budget='',purpose='',style='',location=''}=req.body||{};
    const buyerText=[preferences,budget&&`Budget: ${budget}`,purpose&&`Purpose: ${purpose}`,style&&`Style: ${style}`,location&&`Location preference: ${location}`].filter(Boolean).join('\n').trim();
    if(!buyerText)return res.status(400).json({error:'Tell us what kind of artwork or object you are looking for.'});
    if(!process.env.OPENAI_API_KEY)return res.status(200).json(fallback(buyerText));

    const response=await client.responses.create({model:'gpt-5.6-luna',input:[{role:'user',content:[{type:'input_text',text:`You are Artisan Connect's buyer discovery AI. The buyer describes what they want below. Categorise their intent, extract useful keywords, then rank the provided craft catalog. Match percentage is an estimated recommendation score, not a guarantee. Give the strongest match a high score only when multiple stated preferences align. Return similar alternatives with lower scores. Never claim a product has characteristics not present in the catalog.\n\nBUYER REQUEST:\n${buyerText}\n\nCATALOG:\n${JSON.stringify(catalog)}`}]}],text:{format:{type:'json_schema',name:'buyer_matches',strict:true,schema:{type:'object',additionalProperties:false,properties:{category:{type:'string'},intent:{type:'string'},keywords:{type:'array',items:{type:'string'}},matches:{type:'array',minItems:4,maxItems:4,items:{type:'object',additionalProperties:false,properties:{product_id:{type:'string'},match_percentage:{type:'integer',minimum:0,maximum:100},reason:{type:'string'},match_level:{type:'string',enum:['Best match','Strong alternative','Similar option','Exploration option']}},required:['product_id','match_percentage','reason','match_level']}}},required:['category','intent','keywords','matches']}}}});
    const ai=JSON.parse(response.output_text);
    const matches=ai.matches.map(m=>({...m,product:catalog.find(p=>p.id===m.product_id)})).filter(m=>m.product);
    return res.status(200).json({...ai,matches,disclaimer:'AI match scores are recommendations based on the buyer request and current catalog data.'});
  }catch(error){console.error('Buyer match error:',error);return res.status(500).json({error:'AI matching failed. Please try again.'});}
}
