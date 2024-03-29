db.query(query, [username],(err,resl)=>{
    if(resl[0].password == password)
    {
      res.render('dashboard',{username,stalls,amt,hist});
    }