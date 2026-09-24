export default async function Login({searchParams}: {searchParams: Promise<{error?: string}>}) {
  const {error} = await searchParams;
  return <main style={{maxWidth:400,margin:"12vh auto",padding:24,fontFamily:"Arial,sans-serif"}}><h1>Accès aux commandes</h1><p>Entrez votre mot de passe pour consulter les commandes.</p><form action="/api/admin/login" method="post"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required autoComplete="current-password" style={{display:"block",width:"100%",padding:12,margin:"12px 0"}}/>{error&&<p role="alert" style={{color:"#b42318"}}>Mot de passe incorrect.</p>}<button style={{padding:"12px 20px"}}>Se connecter</button></form></main>;
}
