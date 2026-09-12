const mobileStyle=document.createElement('style');
mobileStyle.id='ac-mobile-responsive';
mobileStyle.textContent=`
@media (max-width: 900px){
  section{padding:72px 5%}
  .hero{grid-template-columns:1fr;gap:28px;min-height:auto;padding-top:52px}
  .hero-art{height:430px}
  .craft-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ai-section{grid-template-columns:1fr;gap:34px}
  .stories,.products{grid-template-columns:repeat(2,minmax(0,1fr))}
  footer{grid-template-columns:1fr;gap:18px}

  .dashboard-main{grid-template-columns:1fr;padding:18px 3%;gap:14px}
  .dashboard-sidebar{position:relative;top:auto;display:flex;gap:8px;overflow-x:auto;white-space:nowrap;padding:10px;border-radius:16px;scrollbar-width:none}
  .dashboard-sidebar::-webkit-scrollbar{display:none}
  .dashboard-sidebar .eyebrow,.dashboard-sidebar h2{display:none}
  .dashboard-sidebar>button:not(.sidebar-logout),.dashboard-sidebar .sidebar-logout{flex:0 0 auto;width:auto;margin:0;padding:10px 13px}
  .sidebar-logout{margin-top:0!important}
  .workspace-panel{padding:30px 24px;min-height:auto}
  .workspace-heading{flex-wrap:wrap}
  .seller-art-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .buyer-products{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ac-catalog-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  .ac-income-cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}

@media (max-width: 680px){
  html,body{max-width:100%;overflow-x:hidden}
  header{height:auto;min-height:64px;padding:9px 14px;gap:10px}
  header nav{display:none}
  .logo{font-size:17px;max-width:150px;overflow:hidden;text-overflow:ellipsis}
  .head-actions,.dashboard-user{gap:7px;min-width:0}
  .head-actions select,.dashboard-user select{display:block!important;max-width:92px;min-width:78px;height:38px;padding:0 7px;border:1px solid rgba(74,44,34,.16);border-radius:10px;background:var(--ivory);font-size:12px;color:var(--brown)}
  .login{height:42px;padding:0 13px;border-radius:11px;font-size:12px}

  section{padding:58px 18px}
  h1{font-size:clamp(39px,12vw,54px);line-height:1.03}
  h2{font-size:clamp(31px,9vw,42px)}
  .hero{padding:42px 18px 55px;gap:18px}
  .hero p{font-size:15px}
  .hero-art{height:350px;margin-top:4px}
  .arch{width:245px;height:310px;padding:28px;box-shadow:13px 14px 0 var(--ivory),22px 22px 0 rgba(184,92,56,.13)}
  .arch:before{inset:16px}
  .motif{top:48px;font-size:66px}
  .arch strong{font-size:22px}
  .insight{right:0;top:10%;padding:12px 14px}
  .actions{gap:9px;margin:22px 0}
  .actions .btn{min-height:48px;padding:0 16px}

  .craft-grid,.stories,.products,.buyer-products,.seller-art-grid,.ac-catalog-grid{grid-template-columns:1fr!important}
  .craft-img,.product{height:210px}
  .portrait{height:220px}
  .upload{padding:14px!important;border-radius:18px}
  .ai-section .upload>div:first-child{grid-template-columns:1fr!important}
  .ai-section .upload>div:first-child>div{min-height:155px!important}
  .ai-section .upload span[aria-hidden="true"]{display:none!important}
  .journey{flex-direction:column;align-items:stretch;margin-top:30px}
  .journey div{width:100%;padding:16px}
  .journey i{transform:rotate(90deg);align-self:center}
  .impact{grid-template-columns:repeat(2,1fr);padding:55px 20px}
  .impact strong{font-size:38px}
  .final{padding:70px 18px}
  footer{padding:38px 18px}

  .login-modal{width:calc(100vw - 24px);max-height:calc(100dvh - 24px);padding:28px 18px;border-radius:20px}
  .login-modal h2{font-size:34px;padding-right:28px}
  .role-switch{grid-template-columns:1fr;margin-bottom:22px}

  .dashboard-header{height:auto;min-height:66px;padding:9px 12px;gap:8px;flex-wrap:wrap}
  .dashboard-header .logo{flex:1 1 130px}
  .dashboard-user{flex:1 1 auto;justify-content:flex-end;flex-wrap:wrap}
  .dashboard-user .role-chip{display:none}
  .logout{padding:8px 10px;font-size:11px}
  .dashboard-main{padding:10px 10px 24px;gap:10px}
  .dashboard-sidebar{border-radius:14px;padding:8px}
  .dashboard-sidebar>button:not(.sidebar-logout),.dashboard-sidebar .sidebar-logout{font-size:11px;padding:9px 11px}
  .workspace-panel{padding:22px 16px;border-radius:20px}
  .workspace-panel h1{font-size:clamp(34px,10vw,46px);margin-bottom:14px}
  .workspace-intro{font-size:14px}
  .workspace-heading{display:block}
  .workspace-heading>.btn{width:100%;margin-top:14px}
  .form-grid{grid-template-columns:1fr}
  .seller-form{gap:14px;margin-top:20px}
  .seller-form input,.seller-form textarea,.seller-form select,.shop-search{font-size:16px;min-height:48px}
  .seller-form .btn{width:100%}
  .seller-stats{grid-template-columns:1fr 1fr;gap:10px}
  .seller-stats div{padding:16px}
  .seller-stats strong{font-size:28px}
  .seller-empty{padding:28px 14px}
  .opportunity-list article{grid-template-columns:1fr;gap:9px;padding:15px}
  .opportunity-list article button{justify-self:start}

  .buyer-products{gap:14px}
  .buyer-products .product,.ac-ai-data-art{height:210px!important}
  .buyer-product-info{padding:15px}
  .buyer-product-info .btn{width:100%}
  .ac-catalog-art{height:205px!important}
  .ac-product-hero{height:210px!important}
  .ac-catalog-body{padding:13px!important}
  .ac-card-actions{flex-direction:column}
  .ac-card-actions button{min-height:42px}
  .ac-cat-chips{gap:6px!important;overflow-x:auto;flex-wrap:nowrap!important;padding-bottom:4px;scrollbar-width:none}
  .ac-cat-chips::-webkit-scrollbar{display:none}
  .ac-cat-chips button{flex:0 0 auto}

  .artist-list article{grid-template-columns:96px minmax(0,1fr)!important;min-height:120px!important}
  .artist-list .portrait{width:96px!important;height:120px!important;min-height:120px!important;font-size:42px!important}
  .artist-list article>div:last-child{padding:14px 12px!important;min-width:0}
  .artist-list article b{font-size:16px!important}
  .artist-list article p{font-size:13px!important;line-height:1.45!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

  .ac-income-cards{grid-template-columns:1fr!important;gap:10px!important}
  .ac-income-cards article{padding:16px!important}
  .ac-income-row{grid-template-columns:1.4fr .8fr!important;padding:12px!important;gap:8px!important}
  .ac-income-row span:nth-child(2),.ac-income-row span:nth-child(3),.ac-income-row.head span:nth-child(2),.ac-income-row.head span:nth-child(3){display:none!important}

  #ac-art-type-picker{margin-top:14px!important}
  .ac-art-options{gap:7px!important}
  .ac-art-options button{padding:9px 11px!important;font-size:12px}
}

@media (max-width: 420px){
  .head-actions select,.dashboard-user select{display:block!important;max-width:80px;min-width:72px;height:36px;padding:0 5px;font-size:11px}
  .head-actions{margin-left:auto}
  .hero-art{height:320px}
  .arch{width:220px;height:285px}
  .insight{font-size:9px}
  .insight b{font-size:12px}
  .seller-stats{grid-template-columns:1fr}
  .impact{grid-template-columns:1fr 1fr;gap:18px}
  .workspace-panel{padding:18px 12px}
  .ac-ai-data-art,.ac-catalog-art,.buyer-products .product{height:190px!important}
}
`;
document.head.appendChild(mobileStyle);
