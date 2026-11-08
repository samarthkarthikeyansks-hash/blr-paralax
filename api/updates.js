import { db } from "hatchable";
export const access = "public";
export const methods = ["POST"];
export default async function(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 const b=req.body||{};const email=String(b.email||"").trim().toLowerCase();const phone=String(b.phone||"").trim();const emailOptIn=b.email_opt_in!==false;const smsOptIn=b.sms_opt_in===true;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:"Enter a valid email address."});
 if(smsOptIn&&!/^\+?[0-9\s()\-]{8,20}$/.test(phone))return res.status(400).json({error:"Enter a valid mobile number to receive mobile updates."});
 if(!emailOptIn&&!smsOptIn)return res.status(400).json({error:"Choose at least one update method."});
 await db.query("INSERT INTO update_subscribers(email,phone,email_opt_in,sms_opt_in) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO UPDATE SET phone=EXCLUDED.phone,email_opt_in=EXCLUDED.email_opt_in,sms_opt_in=EXCLUDED.sms_opt_in,updated_at=NOW()",[email,phone,emailOptIn,smsOptIn]);
 return res.status(201).json({ok:true,message:"You're on the BLR × PARALAX updates list. Notification delivery will activate as the email/SMS services are configured."});
}