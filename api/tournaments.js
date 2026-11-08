import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function(req,res){
 const {rows}=await db.query("SELECT id,name,game,format,mode,status,prize_pool,registration_fee,date,schedule,description,registration_url,created_at FROM tournaments WHERE status <> 'DRAFT' ORDER BY created_at DESC");
 res.setHeader("Cache-Control","no-store");res.json(rows);
}