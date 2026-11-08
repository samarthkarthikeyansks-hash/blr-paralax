import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET","POST","DELETE"];
export default async function(req,res){
 if(req.method==="GET"){const {rows}=await db.query("SELECT * FROM tournaments ORDER BY created_at DESC");return res.json(rows)}
 if(req.method==="DELETE"){const id=req.query.id||req.body?.id;if(!id)return res.status(400).json({error:"Tournament ID required"});await db.query("DELETE FROM tournaments WHERE id=$1",[id]);return res.json({ok:true})}
 const b=req.body||{};if(!b.name||!b.game)return res.status(400).json({error:"Tournament name and game are required"});
 const values=[String(b.name).slice(0,120),String(b.game).slice(0,40),String(b.format||"Solo").slice(0,60),String(b.mode||"").slice(0,80),String(b.status||"DRAFT").slice(0,40),String(b.prize_pool||"0").slice(0,40),String(b.registration_fee||"0").slice(0,40),String(b.date||"").slice(0,80),String(b.schedule||"").slice(0,2000),String(b.description||"").slice(0,4000),String(b.registration_url||"").slice(0,500)];
 if(b.id){const {rows}=await db.query("UPDATE tournaments SET name=$1,game=$2,format=$3,mode=$4,status=$5,prize_pool=$6,registration_fee=$7,date=$8,schedule=$9,description=$10,registration_url=$11,updated_at=NOW() WHERE id=$12 RETURNING *",[...values,b.id]);if(!rows.length)return res.status(404).json({error:"Tournament not found"});return res.json(rows[0])}
 const {rows}=await db.query("INSERT INTO tournaments(name,game,format,mode,status,prize_pool,registration_fee,date,schedule,description,registration_url) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",values);res.status(201).json(rows[0]);
}