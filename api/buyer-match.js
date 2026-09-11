import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const catalog = [
  { id:'demo-1', title:'Monsoon Garden Panel', craft:'Madhubani', price:'₹4,800', location:'Bihar', description:'Hand-painted narrative panel with bold floral and nature motifs.', tags:['wall art','colorful','storytelling','home decor','painting'] },
  { id:'demo-2', title:'Lotus Memory Vessel', craft:'Dhokra', price:'₹3,200', location:'Chhattisgarh', description:'Decorative metal vessel inspired by organic Indian forms.', tags:['metal','metalcraft','sculpture','decor','collectible'] },
  { id:'demo-3', title:'Indigo Geometry Saree', craft:'Weaving', price:'₹6,900', location:'Telangana', description:'Contemporary handwoven textile balancing traditional craft and geometric design.', tags:['textile','textile art','fashion','indigo','handwoven','weaving'] },
  { id:'demo-4', title:'Birds of the Coast', craft:'Pattachitra', price:'₹5,600', location:'Odisha', description:'Detailed narrative artwork with birds and nature-inspired composition.', tags:['painting','paintings','collector','storytelling','nature'] },
  { id:'demo-5', title:'Forest Lines Textile', craft:'Kalamkari', price:'₹7,200', location:'Andhra Pradesh', description:'Decorative textile study with hand-drawn organic motifs.', tags:['textile','textile art','wall decor','natural','pattern'] },
  { id:'demo-6', title:'Phulkari Sunburst', craft:'Phulkari', price:'₹5,400', location:'Punjab', description:'Embroidered textile with a bright radial floral composition.', tags:['embroidery','textile','textile art','gifting','colorful'] },
  { id:'demo-7', title:'Earth & Grain Wall Weave', craft:'Weaving', price:'₹8,900', location:'Telangana', description:'Textural woven wall piece designed for warm contemporary interiors.', tags:['weaving','wall decor','home decor','neutral','texture','interiors'] },
  { id:'demo-8', title:'Village Stories Triptych', craft:'Warli', price:'₹6,100', location:'Maharashtra', description:'Narrative folk-art panels depicting community and everyday life.', tags:['painting','paintings','folk art','wall art','storytelling','culture'] },
  { id:'demo-9', title:'Terracotta Moon Vase', craft:'Pottery', price:'₹2,900', location:'Rajasthan', description:'Hand-shaped terracotta vase with a warm earthy finish for contemporary homes.', tags:['pottery','clay','home decor','earthy','vase'] },
  { id:'demo-10', title:'Carved Neem Keepsake Box', craft:'Woodcraft', price:'₹3,600', location:'Rajasthan', description:'Hand-carved wooden keepsake box with floral detailing.', tags:['woodcraft','wood','home decor','gifting','carved'] },
  { id:'demo-11', title:'Brass Leaf Earrings', craft:'Jewellery', price:'₹1,800', location:'Odisha', description:'Lightweight handcrafted brass earrings inspired by leaf forms.', tags:['jewellery','metalcraft','fashion','gifting'] },
  { id:'demo-12', title:'Wild Grass Storage Basket', craft:'Baskets & Natural Fibre', price:'₹2,400', location:'Assam', description:'Handwoven natural-fibre basket for functional home storage.', tags:['baskets & natural fibre','basket','natural fibre','home decor','weaving'] },
  { id:'demo-13', title:'River Form Sculpture', craft:'Sculpture', price:'₹9,500', location:'West Bengal', description:'Contemporary handmade sculpture inspired by flowing river forms.', tags:['sculpture','contemporary art','collectible','decor'] },
  { id:'demo-14', title:'Indigo Thread Study', craft:'Embroidery', price:'₹4,200', location:'Gujarat', description:'Layered hand-embroidered textile artwork in indigo and natural tones.', tags:['embroidery','textile art','textile','wall art'] }
];

function normalise(value=''){return value.toLowerCase().replace(/[^a-z0-9& ]/g,' ').replace(/\s+/g,' ').trim()}
function productText(p){return normalise([p.craft,p.title,p.description,...p.tags].join(' '))}

function fallback(preferences,selectedCrafts=[]){
  const selected=selectedCrafts.map(normalise).filter(Boolean);
  const extra=normalise(preferences);
  const ranked=catalog.map(product=>{
    const hay=productText(product);
    let hits=0;
    selected.forEach(choice=>{if(hay.includes(choice)||choice.includes(normalise(product.craft)))hits+=1});
    if(extra&&extra.split(' ').some(k=>k.length>3&&hay.includes(k)))hits+=0.35;
    return {product,hits};
  }).sort((a,b)=>b.hits-a.hits||a.product.title.localeCompare(b.product.title));
  const exact=ranked.filter(x=>x.hits>=1);
  const pool=(exact.length?exact:ranked).slice(0,6);
  const matches=pool.map((x,i)=>({product:x.product,match_percentage:Math.max(62,96-i*6-(x.hits<1?12:0)),match_level:i===0?'Best match':i<3?'Strong alternative':'Similar option',reason:x.hits>=1?`Matches ${x.product.craft} or another selected art preference.`:'Related option based on the available catalog.'}));
  return {category:'Personalized multi-select craft discovery',intent:selected.length?`Find products matching: ${selectedCrafts.join(', ')}`:'Find artwork matching the buyer preferences',keywords:[...selected, ...extra.split(' ').filter(Boolean)].slice(0,12),matches,disclaimer:'Recommendations are based on selected preferences and available catalog data.'};
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  try{
    const {preferences='',selectedCrafts=[],budget='',purpose='',style='',location=''}=req.body||{};
    const crafts=Array.isArray(selectedCrafts)?selectedCrafts.filter(Boolean):[];
    const buyerText=[crafts.length&&`Selected art types: ${crafts.join(', ')}`,preferences,budget&&`Budget: ${budget}`,purpose&&`Purpose: ${purpose}`,style&&`Style: ${style}`,location&&`Location preference: ${location}`].filter(Boolean).join('\n').trim();
    if(!buyerText)return res.status(400).json({error:'Select at least one art type.'});
    if(!process.env.OPENAI_API_KEY)return res.status(200).json(fallback(buyerText,crafts));

    const response=await client.responses.create({model:'gpt-5.6-luna',input:[{role:'user',content:[{type:'input_text',text:`You are Artisan Connect's buyer discovery AI. The buyer can select MULTIPLE art types. Treat every selected art type as an explicit preference. Rank products that directly match any selected craft first, then use the optional description to refine the ordering. Do not ignore selected categories. Match percentage is an estimated recommendation score, not a guarantee. Never claim characteristics not present in the catalog.\n\nBUYER REQUEST:\n${buyerText}\n\nCATALOG:\n${JSON.stringify(catalog)}`}]}],text:{format:{type:'json_schema',name:'buyer_matches',strict:true,schema:{type:'object',additionalProperties:false,properties:{category:{type:'string'},intent:{type:'string'},keywords:{type:'array',items:{type:'string'}},matches:{type:'array',minItems:4,maxItems:6,items:{type:'object',additionalProperties:false,properties:{product_id:{type:'string'},match_percentage:{type:'integer',minimum:0,maximum:100},reason:{type:'string'},match_level:{type:'string',enum:['Best match','Strong alternative','Similar option','Exploration option']}},required:['product_id','match_percentage','reason','match_level']}}},required:['category','intent','keywords','matches']}}}});
    const ai=JSON.parse(response.output_text);
    const matches=ai.matches.map(m=>({...m,product:catalog.find(p=>p.id===m.product_id)})).filter(m=>m.product);
    return res.status(200).json({...ai,matches,disclaimer:'AI match scores are recommendations based on all selected buyer preferences and current catalog data.'});
  }catch(error){console.error('Buyer match error:',error);return res.status(500).json({error:'AI matching failed. Please try again.'});}
}
