const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: {"content-type":"application/json; charset=utf-8", "cache-control":"no-store"} });
const clean = (v, n=500) => String(v ?? '').trim().slice(0,n);
const validHttp = v => { try { const u=new URL(v); return ['http:','https:'].includes(u.protocol); } catch { return false; } };
const isAdmin = (r,e) => { const h=r.headers.get('authorization')||''; return h === `Bearer ${e.ADMIN_TOKEN}` && e.ADMIN_TOKEN && !e.ADMIN_TOKEN.startsWith('CHANGE_'); };

export default { async fetch(request, env) {
  const u = new URL(request.url);
  if (!u.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  try {
    if (u.pathname === '/api/resources' && request.method === 'GET') {
      const q=clean(u.searchParams.get('q'),100), category=clean(u.searchParams.get('category'),40);
      let sql="SELECT id,title,description,share_url,source_url,category,tags,license_note,submitter,created_at FROM resources WHERE status='approved'";
      const args=[];
      if(q){sql+=' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)'; const x=`%${q}%`; args.push(x,x,x);}
      if(category){sql+=' AND category=?'; args.push(category);}
      sql+=' ORDER BY created_at DESC LIMIT 100';
      const s=env.DB.prepare(sql); const out= args.length ? await s.bind(...args).all() : await s.all();
      return json(out.results);
    }
    if (u.pathname === '/api/resources' && request.method === 'POST') {
      const b=await request.json();
      const title=clean(b.title,120), description=clean(b.description,1200), share=clean(b.share_url,500), source=clean(b.source_url,500), category=clean(b.category,40)||'其他', tags=clean(b.tags,200), license=clean(b.license_note,300), submitter=clean(b.submitter,80)||'匿名';
      if(!title || !validHttp(share) || !validHttp(source) || !license) return json({error:'标题、有效链接、来源链接和授权说明为必填项'},400);
      await env.DB.prepare('INSERT INTO resources(title,description,share_url,source_url,category,tags,license_note,submitter) VALUES(?,?,?,?,?,?,?,?)').bind(title,description,share,source,category,tags,license,submitter).run();
      return json({ok:true,message:'已提交，审核通过后展示'},201);
    }
    if (u.pathname === '/api/admin/pending' && request.method === 'GET') {
      if(!isAdmin(request,env)) return json({error:'未授权'},401);
      const out=await env.DB.prepare("SELECT * FROM resources WHERE status='pending' ORDER BY created_at DESC LIMIT 200").all(); return json(out.results);
    }
    const m=u.pathname.match(/^\/api\/admin\/resources\/(\d+)$/);
    if(m && request.method==='PATCH'){
      if(!isAdmin(request,env)) return json({error:'未授权'},401);
      const b=await request.json(); if(!['approved','rejected'].includes(b.status)) return json({error:'状态无效'},400);
      await env.DB.prepare("UPDATE resources SET status=?,updated_at=datetime('now') WHERE id=?").bind(b.status,Number(m[1])).run(); return json({ok:true});
    }
    return json({error:'Not found'},404);
  } catch(err){ return json({error:'服务器错误',detail:String(err.message||err)},500); }
}};
