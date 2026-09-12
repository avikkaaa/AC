import React,{useState}from'react';
import{createRoot}from'react-dom/client';
import'./styles.css';

const products=[
 ['Hand-painted Madhubani Panel','Madhubani','₹4,800'],
 ['Dhokra Lotus Vessel','Dhokra','₹3,200'],
 ['Kalamkari Textile Study','Kalamkari','₹6,400'],
 ['Handwoven Earth Rug','Weaving','₹8,900'],
 ['Warli Story Panel','Warli','₹5,200'],
 ['Pattachitra Bird Artwork','Pattachitra','₹4,600']
];
const preferences=['Madhubani','Dhokra','Kalamkari','Weaving','Warli','Pattachitra','Pottery','Jewellery','Home Decor','Textile Art','Sculpture','Woodcraft'];
const budgets=['Under ₹1,000','₹1,000 – ₹2,500','₹2,500 – ₹5,000','₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000 – ₹50,000','₹50,000 – ₹1,00,000','₹1,00,000+','No fixed budget'];
const langs=<><option value="en">English</option><option value="hi">हिन्दी</option><option value="bn">বাংলা</option><option value="mr">मराठी</option><option value="gu">ગુજરાતી</option><option value="ta">தமிழ்</option><option value="te">తెలుగు</option><option value="kn">ಕನ್ನಡ</option><option value="ml">മലയാളം</option><option value="or">ଓଡ଼ିଆ</option><option value="pa">ਪੰਜਾਬੀ</option><option value="as">অসমীয়া</option></>;
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}};

function App(){
 const[lang,setLang]=useState(localStorage.getItem('ac-lang')||'en');
 const[login,setLogin]=useState(false);
 const[role,setRole]=useState('buyer');
 const[loggedIn,setLoggedIn]=useState(localStorage.getItem('ac-user-role')||'');
 const change=e=>{localStorage.setItem('ac-lang',e.target.value);setLang(e.target.value)};
 const logout=()=>{localStorage.removeItem('ac-user-role');location.replace(location.pathname)};
 const submit=e=>{e.preventDefault();localStorage.setItem('ac-user-role',role);setLoggedIn(role);setLogin(false)};
 if(loggedIn)return <Dashboard role={loggedIn} lang={lang} change={change} logout={logout}/>;
 return <><header><a className="logo" href="#">✦ Artisan Connect</a><nav><a href="#crafts">Crafts</a><a href="#ai">AI Tools</a><a href="#stories">Stories</a><a href="#about">About</a></nav><div className="head-actions"><select value={lang} onChange={change}>{langs}</select><button className="login" onClick={()=>{setRole('buyer');setLogin(true)}}>Login →</button></div></header><main>
  <section className="hero"><div><span className="eyebrow">INDIAN HERITAGE × HUMAN STORIES × AI</span><h1>Where heritage finds its next chapter.</h1><p>Artisan Connect helps artisans tell their stories, reach buyers and discover new opportunities with AI.</p><div className="actions"><button className="btn primary" onClick={()=>{setRole('artisan');setLogin(true)}}>I'm an artisan →</button><button className="btn secondary" onClick={()=>{setRole('buyer');setLogin(true)}}>I'm a buyer →</button></div></div><div className="hero-art"><div className="arch"><div className="motif">✦</div><strong>HANDMADE<br/>WITH MEMORY</strong><small>India · Craft · Story</small></div></div></section>
  <section id="crafts"><span className="eyebrow">CRAFTS</span><h2>Many traditions. One connected platform.</h2></section>
  <section id="ai" className="ai-section"><div><span className="eyebrow">✦ AI CATALOG</span><h2>From one product to the right buyer.</h2><p>Artisans add their work. Buyers tell us what they want. AI helps connect the two.</p></div></section>
  <section id="stories"><span className="eyebrow">STORIES</span><h2>Every craft carries a story.</h2></section>
 </main><footer id="about"><a className="logo">✦ Artisan Connect</a><p>Connecting India's creative heritage with its next chapter.</p></footer>{login&&<Login role={role} setRole={setRole} close={()=>setLogin(false)} submit={submit}/>}</>;
}

function Login({role,setRole,close,submit}){return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="login-modal"><button className="modal-close" onClick={close}>×</button><div className="role-switch"><button className={role==='artisan'?'selected':''} onClick={()=>setRole('artisan')}>Artist / Artisan</button><button className={role==='buyer'?'selected':''} onClick={()=>setRole('buyer')}>Buyer / Collector</button></div><h2>{role==='artisan'?'Your craft deserves a bigger stage.':'Discover objects with a story.'}</h2><form onSubmit={submit}><label>Email<input type="email" required/></label><label>Password<input type="password" required/></label><button className="modal-submit">Login →</button></form></div></div>}

function Dashboard({role,lang,change,logout}){
 const artisan=role==='artisan';
 const storedBuyer=read('ac-buyer-details',{});
 const[buyer,setBuyer]=useState({name:'',phone:'',address:'',budget:'',preference:storedBuyer.preference||storedBuyer.interests?.[0]||'',...storedBuyer});
 const[profile,setProfile]=useState({name:'',phone:'',craft:'',location:'',price:'',materials:'',bio:'',story:'',...read('ac-artisan-profile',{})});
 const[screen,setScreen]=useState(artisan?(profile.name?'seller-home':'profile'):'setup');
 const[recommendations,setRecommendations]=useState([]);
 const[orders,setOrders]=useState(read('ac-demo-orders',[]));
 const[artworks,setArtworks]=useState([]);
 const[image,setImage]=useState(null);
 const[checkout,setCheckout]=useState(null);
 const[notice,setNotice]=useState('');
 const[loading,setLoading]=useState(false);

 const getRecommendations=async()=>{
  if(!buyer.name||!/^[0-9]{10}$/.test(buyer.phone)||!buyer.address||!buyer.budget||!buyer.preference.trim()){
   setNotice('Enter all details, a valid 10-digit phone number, and choose or type one art preference.');return;
  }
  localStorage.setItem('ac-buyer-details',JSON.stringify(buyer));
  setLoading(true);
  try{
   const r=await fetch('/api/buyer-match',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({selectedCrafts:[buyer.preference],preferences:buyer.preference,purpose:`Budget: ${buyer.budget}`,buyerDetails:buyer})});
   const d=JSON.parse(await r.text()||'{}');
   if(!r.ok)throw Error();
   setRecommendations(d.matches||[]);
  }catch{
   setRecommendations(products.map((p,i)=>({match_percentage:94-i*5,reason:`Suggested for ${buyer.preference}.`,product:{title:p[0],craft:p[1],price:p[2],location:'India'}})));
  }finally{setLoading(false);setScreen('shop')}
 };

 const saveProfile=e=>{e.preventDefault();localStorage.setItem('ac-artisan-profile',JSON.stringify(profile));setNotice('Profile saved.');setScreen('seller-home')};
 const addArtwork=e=>{e.preventDefault();if(!image){setNotice('Add an artwork photo first.');return}const f=new FormData(e.currentTarget);setArtworks(a=>[...a,{title:f.get('title'),price:f.get('price'),image:URL.createObjectURL(image)}]);setImage(null);e.currentTarget.reset();setScreen('seller-home')};
 const placeOrder=(product,payment)=>{const next=[...orders,{id:Date.now(),title:product.title,craft:product.craft,price:product.price,payment,buyer,status:'New'}];setOrders(next);localStorage.setItem('ac-demo-orders',JSON.stringify(next))};
 const nav=artisan?[['seller-home','Overview'],['profile','Seller profile'],['add','Add artwork'],['opportunities','Market opportunities']]:[['setup','Buyer details'],['shop','AI suggestions'],['orders','My orders']];

 return <div className="dashboard"><header className="dashboard-header"><a className="logo">✦ Artisan Connect</a><div className="dashboard-user"><select value={lang} onChange={change}>{langs}</select><span className="role-chip">{artisan?'Artist / Artisan':'Buyer / Collector'}</span><button className="logout" onClick={logout}>Log out</button></div></header><main className="dashboard-main"><aside className="dashboard-sidebar"><span className="eyebrow">{artisan?'SELLER SPACE':'BUYER SPACE'}</span><h2>{artisan?'Your studio':'Your collection'}</h2>{nav.map(x=><button key={x[0]} className={screen===x[0]?'active':''} onClick={()=>setScreen(x[0])}>{x[1]} →</button>)}<button className="sidebar-logout" onClick={logout}>Log out</button></aside><div className="dashboard-content">
  {!artisan&&screen==='setup'&&<BuyerSetup buyer={buyer} setBuyer={setBuyer} next={getRecommendations} loading={loading}/>} 
  {!artisan&&screen==='shop'&&<BuyerShop items={recommendations} buy={setCheckout}/>} 
  {!artisan&&screen==='orders'&&<BuyerOrders orders={orders}/>} 
  {artisan&&screen==='profile'&&<SellerProfile profile={profile} setProfile={setProfile} save={saveProfile}/>} 
  {artisan&&screen==='add'&&<AddArtwork image={image} setImage={setImage} add={addArtwork}/>} 
  {artisan&&screen==='seller-home'&&<SellerHome profile={profile} artworks={artworks} orders={orders} setScreen={setScreen}/>} 
  {artisan&&screen==='opportunities'&&<SellerOpportunities profile={profile}/>} 
  {notice&&<div className="dashboard-notice">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
 </div></main>{checkout&&<Checkout product={checkout} buyer={buyer} close={()=>setCheckout(null)} place={placeOrder}/>}</div>;
}

function BuyerSetup({buyer,setBuyer,next,loading}){
 const set=(key,value)=>setBuyer(prev=>({...prev,[key]:value}));
 const phone=e=>set('phone',e.target.value.replace(/\D/g,'').slice(0,10));
 const ready=buyer.name.trim()&&buyer.phone.length===10&&buyer.address.trim()&&buyer.budget&&buyer.preference.trim();
 return <section className="workspace-panel"><span className="eyebrow">✦ PERSONALIZED DISCOVERY</span><h1>What are you looking for?</h1><p className="workspace-intro">Choose one art preference below or type exactly what you want. You can continue only after giving one preference.</p><div className="seller-form"><div className="form-grid"><label>Your name<input value={buyer.name} onChange={e=>set('name',e.target.value)}/></label><label>Contact phone<input type="tel" inputMode="numeric" maxLength="10" value={buyer.phone} onChange={phone} placeholder="10-digit mobile number"/><small>{buyer.phone.length}/10 digits</small></label><label>Delivery address<textarea rows="3" value={buyer.address} onChange={e=>set('address',e.target.value)}/></label><label>Budget range<select value={buyer.budget} onChange={e=>set('budget',e.target.value)}><option value="">Choose your budget</option>{budgets.map(x=><option key={x}>{x}</option>)}</select></label></div>
 <label>What do you want?<input value={buyer.preference} onChange={e=>set('preference',e.target.value)} placeholder="e.g. Madhubani painting, pottery, jewellery..."/></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:10}}>{preferences.map(x=>{const selected=buyer.preference===x;return <button type="button" key={x} onClick={()=>set('preference',x)} style={{padding:'10px 14px',borderRadius:999,border:`1px solid ${selected?'var(--rust)':'var(--sand)'}`,background:selected?'var(--rust)':'var(--cream)',color:selected?'var(--ivory)':'var(--brown)',fontWeight:700}}>{selected?'✓ ':''}{x}</button>})}</div>
 <button className="btn primary" onClick={next} disabled={!ready||loading}>{loading?'Creating AI suggestions…':'Next — Get AI suggestions →'}</button></div></section>;
}

function BuyerShop({items,buy}){return <section className="workspace-panel"><span className="eyebrow">✦ AI MATCH</span><h1>AI suggested for you.</h1><div className="buyer-products">{items.map((m,i)=>{const p=m.product||{};return <article key={(p.title||'art')+i}><div className={'product i'+i%4}></div><div className="buyer-product-info"><small>{p.craft||'Artwork'} · {p.location||'India'}</small><b>{p.title||'Artwork'}</b><strong>{p.price||'Price on request'}</strong><small>{m.match_percentage||90}% match</small><p>{m.reason||''}</p><button className="btn primary" onClick={()=>buy(p)}>Buy now →</button></div></article>})}</div></section>}
function BuyerOrders({orders}){return <section className="workspace-panel"><span className="eyebrow">ORDERS</span><h1>Your orders.</h1>{orders.length?<div className="opportunity-list">{orders.map(o=><article key={o.id}><div><b>{o.title}</b><small>{o.payment}</small></div><strong>{o.price}</strong></article>)}</div>:<p>No orders yet.</p>}</section>}
function Checkout({product,buyer,close,place}){const[payment,setPayment]=useState('UPI');const[done,setDone]=useState(false);if(done)return <div className="modal-backdrop"><div className="login-modal"><h2>Order placed!</h2><p>Demo only — no real payment was charged.</p><button className="btn primary" onClick={close}>Continue shopping</button></div></div>;return <div className="modal-backdrop"><div className="login-modal"><button className="modal-close" onClick={close}>×</button><h2>{product.title}</h2><p>{product.price}</p><p><b>Deliver to</b><br/>{buyer.name}<br/>{buyer.phone}<br/>{buyer.address}</p><label>Payment<select value={payment} onChange={e=>setPayment(e.target.value)}><option>UPI</option><option>Card</option><option>Cash on Delivery</option></select></label><button className="modal-submit" onClick={()=>{place(product,payment);setDone(true)}}>Place demo order →</button></div></div>}

function SellerProfile({profile,setProfile,save}){const set=(k,v)=>setProfile(p=>({...p,[k]:v}));return <section className="workspace-panel"><span className="eyebrow">SELLER PROFILE</span><h1>Tell buyers about your craft.</h1><form className="seller-form" onSubmit={save}><div className="form-grid"><label>Name<input value={profile.name} onChange={e=>set('name',e.target.value)} required/></label><label>Phone<input value={profile.phone} onChange={e=>set('phone',e.target.value.replace(/\D/g,'').slice(0,10))} maxLength="10" required/></label><label>Primary craft<input value={profile.craft} onChange={e=>set('craft',e.target.value)} required/></label><label>Location<input value={profile.location} onChange={e=>set('location',e.target.value)} required/></label><label>Typical price range<input value={profile.price} onChange={e=>set('price',e.target.value)}/></label><label>Materials<input value={profile.materials} onChange={e=>set('materials',e.target.value)}/></label></div><label>About your work<textarea value={profile.bio} onChange={e=>set('bio',e.target.value)}/></label><label>Your story<textarea value={profile.story} onChange={e=>set('story',e.target.value)}/></label><button className="btn primary">Save seller profile →</button></form></section>}
function AddArtwork({image,setImage,add}){return <section className="workspace-panel"><h1>Add artwork</h1><form className="seller-form" onSubmit={add}><label className="artwork-upload"><input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])}/>{image?<strong>{image.name}</strong>:<strong>＋ Add artwork photo</strong>}</label><label>Artwork title<input name="title" required/></label><label>Price<input name="price" required/></label><button className="btn primary">Publish artwork →</button></form></section>}
function SellerHome({profile,artworks,orders,setScreen}){return <section className="workspace-panel"><div className="workspace-heading"><div><span className="eyebrow">SELLER OVERVIEW</span><h1>{profile.name||'Your studio'}</h1><p>{profile.craft} · {profile.location}</p></div><button className="btn primary" onClick={()=>setScreen('add')}>＋ Add artwork</button></div><div className="seller-stats"><div><strong>{artworks.length}</strong><span>Published works</span></div><div><strong>{orders.length}</strong><span>Buyer orders</span></div></div></section>}
function SellerOpportunities({profile}){return <section className="workspace-panel"><span className="eyebrow">AI MARKET LINKAGE</span><h1>Find new opportunities.</h1><p>Suggestions for {profile.craft||'your craft'} in {profile.location||'your location'}.</p></section>}

createRoot(document.getElementById('root')).render(<App/>);
